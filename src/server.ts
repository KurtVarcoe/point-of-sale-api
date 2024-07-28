import 'dotenv/config'
import { sequelize } from './db'
import app from './app'

const port = process.env.PORT || "3000"

sequelize.sync({ force: true })
  .then(async () => {
    console.log('Database & tables created!')
    app.listen({ port: parseInt(port, 10) })
      .catch((err) => {
        app.log.error(err)
        process.exit(1)
      })
  })
  .catch(err => {
    console.error('Unable to create tables, shutting down...', err)
  })

