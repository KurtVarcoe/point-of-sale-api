import request from 'supertest'
import { setup } from "./test_setup"
import app from '../src/app'
import { HTTP_CODES } from '../globals'
import { userOne } from './data'

const root = '/sale'

beforeEach(setup)

test('Should create sale', async () => {
  await request(app.server).post(`${root}/create`)
  .set('Authorization', `Bearer ${userOne.token}`)
  .send({
    products: {
      "1": {
        quantity: 10,
        upsell: {
          "2": {
            "quantity": 5
          },
          "3": {
            "quantity": 3
          }
        }
      },
      "2": {
        "quantity": 3,
        "upsell": {
          "4": {
            "quantity": 4
          }
        }
      }
    }
  })
  .expect(HTTP_CODES.OK)
})


test('Should fail to create sale, too many items ordered', async () => {
  await request(app.server).post(`${root}/create`)
  .set('Authorization', `Bearer ${userOne.token}`)
  .send({
    products: {
      "1": {
        quantity: 10,
        upsell: {
          "2": {
            "quantity": 5
          },
          "3": {
            "quantity": 3
          }
        }
      },
      "2": {
        "quantity": 3,
        "upsell": {
          "4": {
            "quantity": 11
          }
        }
      }
    }
  })
  .expect(HTTP_CODES.BAD_REQUEST)
})