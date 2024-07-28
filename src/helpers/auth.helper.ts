import jwt from 'jsonwebtoken'
import { User } from '../models/user.model'
import { HTTP_CODES } from '../../globals'
import { FastifyReply, FastifyRequest } from 'fastify'

const jwtSecret = process.env.JWT_SECRET!

export const generateAuthToken = async (id: number): Promise<string | null> => {
  const token = jwt.sign({ id }, jwtSecret, {
    expiresIn: '7 days'
  })

  const user = await User.findOne({ where: { id } })

  if (user) {
    await user.update({ token })
    return token
  }

  return null
} 

export const auth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new Error('Unauthorized')
    }

    const decoded = jwt.verify(token, jwtSecret)

    if (typeof decoded === 'string' || !decoded?.id) {
      return reply.code(HTTP_CODES.BAD_REQUEST).send({ message: 'Invalid token' })
    }

    const user = await User.findOne({ where: { id: decoded.id, token: token } })

    if (!user) {
      throw new Error('Unauthorized')
    }
  } catch (err) {
    reply.code(HTTP_CODES.UNAUTHORIZED).send({ error: 'Please login' })
  }
}