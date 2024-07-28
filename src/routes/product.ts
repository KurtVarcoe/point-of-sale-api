import { FastifyInstance, FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify"
import { HTTP_CODES } from "../../globals"
import { auth } from "../helpers/auth.helper"
import { Product } from "../models/product.model"

const root = '/product'

export async function productRoutes (fastify: FastifyInstance) {
  fastify.get(`${root}/getAll`, { preValidation: [auth] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const products = await Product.findAll()

    return reply.send(products)
  })

  interface CreateProductRequest extends RouteGenericInterface {
    Body: {
      name: string;
      price: number;
      quantity: number;
      description?: string;
    }
  }

  fastify.post(`${root}/create`, { preValidation: [auth] }, async (request: FastifyRequest<CreateProductRequest>, reply: FastifyReply) => {
    const {
      name,
      price,
      quantity,
      description,
    } = request.body
    
    if (!name) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        message: 'Product name not found'
      })
    }

    if (!price) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        message: 'Product price not found'
      })
    }

    if (!quantity) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        message: 'Product quantity not found'
      })
    }

    try {
      const product = await Product.create({
        name,
        price,
        quantity,
        description
      })
  
      return reply.code(HTTP_CODES.CREATED).send(product)
    } catch (err) {
      if (err instanceof Error) {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err.message)
      } else {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err)
      }
    }
  })

  interface UpdateProductRequest extends RouteGenericInterface {
    Params: {
      id: string;
    },
    Body: {
      name?: string;
      price?: number;
      quantity?: number;
      description?: string;
    }
  }

  fastify.put(`${root}/update/:id`, { preValidation: [auth] }, async (request: FastifyRequest<UpdateProductRequest>, reply: FastifyReply) => {
    const { id } = request.params

    const { name, price, quantity, description } = request.body

    if (!id) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        message: 'Please provide a product id'
      })
    }

    const product = await Product.findByPk(id)

    if (!product) {
      return reply.code(HTTP_CODES.NOT_FOUND).send({
        message: 'Product does not exist'
      })
    }

    const updatedProduct = await product.update({ name, price, quantity, description })

    return updatedProduct
  })

  interface DeleteProductRequest extends RouteGenericInterface {
    Params: {
      id: string | number;
    };
  }

  fastify.delete(`${root}/delete/:id`, { preValidation: [auth] }, async (request: FastifyRequest<DeleteProductRequest>, reply: FastifyReply) => {
    const { id } = request.params

    if (!id) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        message: 'Please provide a product id'
      })
    }

    const product = await Product.findByPk(id)

    if (!product) {
      return reply.code(HTTP_CODES.NOT_FOUND).send({
        message: 'Product does not exist'
      })
    }

    try {
      await product.destroy()
      return reply.send()
    } catch (err) {
      if (err instanceof Error) {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err.message)
      } else {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err)
      }
    }
  })
}