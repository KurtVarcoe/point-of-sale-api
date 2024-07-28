import jwt from 'jsonwebtoken'

const userOneId = 1

export const userOne = {
  id: userOneId,
  email: 'user@one.com',
  password: 'numbah1',
  token: jwt.sign({ id: userOneId }, process.env.JWT_SECRET!)
}

const productOneId = 1

export const productOne = {
  id: productOneId,
  name: 'burger',
  price: 25.00,
  quantity: 1000,
  description: 'Tasty goodness',
}

const productTwoId = 2

export const productTwo = {
  id: productTwoId,
  name: 'cheeseburger',
  price: 30.00,
  quantity: 100,
  description: 'Melted cheese',
}

const productThreeId = 3

export const productThree = {
  id: productThreeId,
  name: 'chips',
  price: 12.00,
  quantity: 200,
  description: 'Great option',
}

const productFourId = 4

export const productFour = {
  id: productFourId,
  name: 'drinks',
  price: 12.00,
  quantity: 10,
  description: 'Thirst quencher',
}