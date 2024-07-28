import request from 'supertest'
import app from '../src/app'
import { User } from '../src/models/user.model'
import { HTTP_CODES } from '../globals'
import { userOne } from './data'
import { setup } from './test_setup'
import { sequelize } from '../src/db'

const root = '/user'

beforeAll(setup)

afterAll(() => {
  sequelize.close()
})

test('Should create new user', async () => {
  const password = 'Red123'
  const response = await request(app.server).post(`${root}/create`)
  .send({
    email: 'kurt@example.com',
    password
  })
  .expect(HTTP_CODES.CREATED)

  // Check user is in DB
  const user = await User.findByPk(response.body.user.id)
  expect(user).not.toBeNull()

  // check that password was hashed
  expect(user?.password).not.toBe(password)
})

test('Should fail to create duplicate user', async () => {
  await request(app.server).post(`${root}/create`)
  .send({
    email: userOne.email,
    password: 'Pass789'
  })
  .expect(HTTP_CODES.BAD_REQUEST)
})

test('Should login existing user', async () => {
  await request(app.server).post(`${root}/login`)
  .send({
    email: userOne.email,
    password: userOne.password
  })
  .expect(HTTP_CODES.OK)
})