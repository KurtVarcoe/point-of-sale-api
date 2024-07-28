import { Op } from "sequelize"
import { auth } from "../helpers/auth.helper"
import { Product } from "../models/product.model"
import { Sale } from "../models/sale.model"
import { SaleProduct } from "../models/sale_product.model"
import { FastifyInstance, FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify"
import { HTTP_CODES } from "../../globals"

const root = '/sale'

export async function salesRoutes (fastify: FastifyInstance) {
  interface createSaleRequest extends RouteGenericInterface {
    Body: {
      products: {
        [id: string]: {
          quantity: number;
          upsell?: {
            [id: string]: {
              quantity: number
            }
          }
        }
      }
    }
  }

  fastify.post(`${root}/create`, { preValidation: [auth] }, async (request: FastifyRequest<createSaleRequest>, reply: FastifyReply) => {
    const { products: requestProducts } = request.body

    if (!requestProducts || typeof requestProducts !== 'object') {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({ message: 'Invalid request payload' })
    }

    const requestProductKeys = Object.keys(requestProducts)

    // Adds all products with the same id up to make querying easier,
    // Removes distinction between main products and upsell products
    const flattenProducts = requestProductKeys.reduce((acc: Record<string, Record<'quantity', number>>, productId) => {
      // Add or update the main product quantity
      acc[productId] = acc[productId] || { quantity: 0 };
      acc[productId].quantity += requestProducts[productId].quantity;

      // Add all upsell products
      const upsellProducts = requestProducts[productId]?.upsell
      if (upsellProducts && Object.keys(upsellProducts).length) {
        Object.keys(upsellProducts).forEach((upsellId) => {
          if (requestProducts[productId].upsell?.[upsellId]) {
            acc[upsellId] = acc[upsellId] || { quantity: 0 };
            acc[upsellId].quantity += upsellProducts[upsellId].quantity;
          }
        })
      }

      return acc
    }, {})

    // Get all products where the quantity ordered does not exceed the amount in stock
    const flattenProductIds = Object.keys(flattenProducts)
    const productPromises = flattenProductIds.map((productId) => Product.findOne({ where: { id: productId, quantity: { [Op.gte]: flattenProducts[productId].quantity } } }))

    const productsResolved = await Promise.all(productPromises)

    // Remove all null values
    const products = productsResolved.filter((product) => product != null)

    if (products.length < flattenProductIds.length) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        message: 'Cannot order more products than we have in stock'
      })
    }

    if (!products.length) {
      return reply.code(HTTP_CODES.NOT_FOUND).send({
        message: 'No products found'
      })
    }

    // Remove the quantity of products ordered from stock
    const removeQuantityPromises = products.map((product) => {
      const newQuantity = product.quantity - flattenProducts[product.id].quantity
      return product.update({ quantity: newQuantity })
    })

    await Promise.all(removeQuantityPromises)

    const totalAmount = products.reduce((acc, product) => {
      acc += (flattenProducts[product.dataValues.id].quantity * product.dataValues.price)
      return acc
    }, 0)

    const sale = await Sale.create({ totalAmount })

    // Save snapshots of products in case details change later
    const saleProductPromises = products.map((product) => {
      return SaleProduct.create({
        saleId: sale.id,
        productId: product.id,
        quantity: flattenProducts[product.id].quantity,
        productName: product.name,
        productPrice: product.price,
      })
    })

    await Promise.all(saleProductPromises)

    return sale
  })

  interface GetSaleRequest extends RouteGenericInterface {
    Params: {
      id: string | number
    }
  }

  fastify.get(`${root}/:id`, { preValidation: [auth] }, async (request: FastifyRequest<GetSaleRequest>, reply: FastifyReply) => {
    const { id } = request.params

    const sale = await Sale.findOne({ where: { id } })

    if (!sale) {
      return reply.code(HTTP_CODES.NOT_FOUND).send({
        message: 'Transaction not found'
      })
    }

    const saleProducts = await SaleProduct.findAll({ where: { saleId: id } })
    const saleProductValues = saleProducts.map((saleProduct) => saleProduct.dataValues)

    return reply.send({
      sale,
      products: saleProductValues
    })
  })
}