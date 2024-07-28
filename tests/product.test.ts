import request from 'supertest'
import app from '../src/app'
import { HTTP_CODES } from '../globals'
import { userOne, productOne } from './data'
import { setup } from "./test_setup"

const root = '/product'

beforeEach(setup)

test('Should create new product', async () => {
  await request(app.server).post(`${root}/create`)
  .set('Authorization', `Bearer ${userOne.token}`)
  .send(productOne)
  .expect(HTTP_CODES.CREATED)
})

test('Should not create product if unauthenticated', async () => {
  await request(app.server).post(`${root}/create`)
  .send(productOne)
  .expect(HTTP_CODES.UNAUTHORIZED)
})

test('Should update product price', async () => {
  await request(app.server).put(`${root}/update/${productOne.id}`)
  .set('Authorization', `Bearer ${userOne.token}`)
  .send({ price: 20 })
  .expect(HTTP_CODES.OK)
})

test('Should delete product', async () => {
  await request(app.server).delete(`${root}/delete/${productOne.id}`)
  .set('Authorization', `Bearer ${userOne.token}`)
  .expect(HTTP_CODES.OK)
})