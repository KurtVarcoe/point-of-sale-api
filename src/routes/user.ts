import bcryptjs from 'bcryptjs'
import { FastifyInstance, FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify"
import { User } from "../models/user.model"
import { HTTP_CODES } from '../../globals';
import { generateAuthToken } from '../helpers/auth.helper';

const root = '/user'

export async function userRoutes (fastify: FastifyInstance) {
  interface UserCreateRequest extends RouteGenericInterface {
    Body: {
      email: string;
      password: string;
    }
  }

  fastify.post(`${root}/create`, async (request: FastifyRequest<UserCreateRequest>, reply: FastifyReply) => {
    const { email, password } = request.body

    if (!email) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        success: false,
        message: 'No email found'
      })
    }

    if (!password) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        success: false,
        message: 'No password found'
      })
    }

    // Prevent user from using same email as another
    const duplicateUser = await User.count({ where: { email } })

    if (duplicateUser) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        success: false,
        message: 'User with that email already exists'
      })
    }

    const hashedPassword = await bcryptjs.hash(password, 8)

    const user = await User.create({
      email,
      password: hashedPassword,
    })

    const token = await generateAuthToken(user.id)

    if (!token) {
      return reply.code(HTTP_CODES.SERVER_ERROR).send()
    }
    
    await user.update({ token })

    // Don't send password to the frontend
    const userObj: { password?: string } = { ...user.dataValues }
    delete userObj.password

    return reply.code(HTTP_CODES.CREATED).send({
      user: userObj,
    })
  })

  interface UserLoginRequest extends RouteGenericInterface {
    Body: {
      email: string;
      password: string;
    }
  }

  fastify.post(`${root}/login`, async (request: FastifyRequest<UserLoginRequest>, reply: FastifyReply) => {
    const { email, password } = request.body

    if (!email) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        success: false,
        message: 'No email found'
      })
    }

    if (!password) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        success: false,
        message: 'No password found'
      })
    }

    const user = await User.findOne({ where: { email } })
    
    if (!user) {
      return reply.code(HTTP_CODES.NOT_FOUND).send({
        success: false,
        message: 'Incorrect password and email combination'
      })
    }

    const isMatchedPassword = await bcryptjs.compare(password, user.password)

    if (isMatchedPassword) {
      const token = await generateAuthToken(user.id)
      if (token) {
        user.update({ token })
      }

      return reply.code(HTTP_CODES.OK).send({
        user,
      })
    } else {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({
        success: false,
        message: 'Incorrect password and email combination',
      })
    }
  })
}