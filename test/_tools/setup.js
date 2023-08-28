import chai from 'chai'
import chaiDeepMatch from 'chai-deep-match'
import chaiHttp from 'chai-http'
import chaiJsonSchema from 'chai-json-schema'

import db from '../../lib/db.js'

chai.should()
chai.use(chaiDeepMatch)
chai.use(chaiHttp)
chai.use(chaiJsonSchema)

before(async () => {
  await db.knex.migrate.rollback({}, true)
  await db.knex.migrate.latest()
  await db.knex.seed.run()
})

beforeEach(async () => {
  await db.knex.raw('START TRANSACTION')
})

afterEach(async () => {
  await db.knex.raw('ROLLBACK')
})

after(() => setTimeout(() => process.exit(0), 1000))
