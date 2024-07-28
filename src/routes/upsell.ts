import { FastifyInstance, FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { HTTP_CODES } from "../../globals";
import { auth } from "../helpers/auth.helper";
import { Product } from "../models/product.model";

const root = '/upsell'

export async function upsellRoutes (fastify: FastifyInstance) {
  interface UpsellLinkRequest extends RouteGenericInterface {
    Body: {
      base: string | number;
      upsell: string | number;
    }
  }

  fastify.post(`${root}/link`, { preValidation: [auth] }, async (request: FastifyRequest<UpsellLinkRequest>, reply: FastifyReply) => {
    const { base, upsell } = request.body
    const baseProduct = await Product.findByPk(base)
    const upsellProduct = await Product.findByPk(upsell)
    
    if (!baseProduct || !upsellProduct) {
      return reply.code(HTTP_CODES.NOT_FOUND).send({
        message: 'Invalid product id(s)'
      })
    }

    try {
      await baseProduct.addUpsell(upsellProduct)
      return reply.send({
        message: 'Products successfully linked'
      })
    } catch (err) {
      if (err instanceof Error) {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err.message)
      } else {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err)
      }
    }
  })

  interface UpsellGetRequest extends RouteGenericInterface {
    Params: {
      id: string | number;
    }
  }

  fastify.get(`${root}/:id`, { preValidation: [auth] }, async (request: FastifyRequest<UpsellGetRequest>, reply: FastifyReply) => {
    const { id } = request.params
    const product = await Product.findByPk(id)

    if (!product) {
      return reply.code(HTTP_CODES.NOT_FOUND).send({
        message: 'Invalid product id'
      })
    }

    try {
      const upsells = await product.getUpsells()
      
      return reply.send(upsells)
    } catch (err) {
      if (err instanceof Error) {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err.message)
      } else {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err)
      }
    }
  })

  interface UpsellRemoveRequest extends RouteGenericInterface {
    Body: {
      base: string | number;
      upsell: string | number;
    }
  }

  fastify.put(`${root}/remove`, { preValidation: [auth] }, async (request: FastifyRequest<UpsellRemoveRequest>, reply: FastifyReply) => {
    const { base, upsell } = request.body

    const baseProduct = await Product.findByPk(base)
    const upsellProduct = await Product.findByPk(upsell)

    if (!baseProduct || !upsellProduct) {
      return reply.code(HTTP_CODES.NOT_FOUND).send({
        message: 'Invalid product id(s)'
      })
    }

    try {
      const response = await baseProduct.removeUpsell(upsellProduct)
      
      if (response === 0) {
        return reply.code(HTTP_CODES.BAD_REQUEST).send({
          message: 'No upsell link exists between these two items'
        })
      } else {
        return reply.send({
          message: 'Upsell link successfully removed'
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err.message)
      } else {
        return reply.code(HTTP_CODES.SERVER_ERROR).send(err)
      }
    }
  })
}