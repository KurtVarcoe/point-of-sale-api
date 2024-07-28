import 'dotenv/config'
import Fastify from 'fastify'
import { userRoutes } from './routes/user'
import { productRoutes } from './routes/product'
import { upsellRoutes } from './routes/upsell'
import { salesRoutes } from './routes/sale'

const fastify = Fastify({
  logger: true
})

fastify.register(userRoutes)
fastify.register(productRoutes)
fastify.register(upsellRoutes)
fastify.register(salesRoutes)

export default fastify