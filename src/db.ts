import { Sequelize } from 'sequelize'
import { DB } from '../globals'

const dbName = process.env.NODE_ENV === 'test' ? DB.TEST_DB_NAME! : DB.DB_NAME!

export const sequelize = new Sequelize(dbName, DB.USERNAME!, DB.PASSWORD, {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306
})