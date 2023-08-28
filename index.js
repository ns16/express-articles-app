import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'

import config from './config.js'
import handleErrors from './lib/handle_errors.js'
import router from './lib/router.js'

const app = express()

app.use(cors({ exposedHeaders: 'Token' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}
app.use('/api/v1', router())
app.use(handleErrors)

app.listen(process.env.NODE_ENV !== 'test' ? config.port : 9999, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server running on port ${config.port}`) // eslint-disable-line no-console
  }
})

export default app
