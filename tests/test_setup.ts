import 'dotenv/config'
import { sequelize } from "../src/db"
import bcryptjs from 'bcryptjs'
import { productFour, productOne, productThree, productTwo, userOne } from "./data"
import { User } from "../src/models/user.model"
import app from '../src/app'
import { Product } from "../src/models/product.model"

export const setup = async () => {
  await sequelize.sync({ force: true })

  const userOneHashed = await bcryptjs.hash(userOne.password, 8)

  await User.create({
    id: userOne.id,
    email: userOne.email,
    password: userOneHashed,
    token: userOne.token
  })

  await Product.bulkCreate([
    productOne,
    productTwo,
    productThree,
    productFour
  ])

  await app.ready()
}