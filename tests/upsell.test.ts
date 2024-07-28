import request from 'supertest'
import { setup } from "./test_setup"
import app from '../src/app'
import { HTTP_CODES } from '../globals'
import { Product } from '../src/models/product.model'
import { productThree, productTwo, userOne } from './data'

const root = '/upsell'

beforeEach(setup)

test('Should create upsell link', async () => {
  await request(app.server).post(`${root}/link`)
  .set('Authorization', `Bearer ${userOne.token}`)
  .send({
    base: 1,
    upsell: 2
  })
  .expect(HTTP_CODES.OK)
})

test('Should remove upsell link', async () => {
  // create link to remove
  const baseProduct = await Product.findByPk(productTwo.id)
  const upsellProduct = await Product.findByPk(productThree.id)

  if (baseProduct && upsellProduct) {
    baseProduct.addUpsell(upsellProduct)
    await request(app.server).put(`${root}/remove`)
    .set('Authorization', `Bearer ${userOne.token}`)
    .send({
      base: productTwo.id,
      upsell: productThree.id
    })
    .expect(HTTP_CODES.OK)
  }
})