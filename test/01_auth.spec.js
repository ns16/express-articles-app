import chai from 'chai'
import { getAuthorization } from './_tools/helpers.js'
import { adminSchema } from './_tools/schemas.js'
import server from '../index.js'

let authorization = null

describe('AuthController (e2e)', () => {
  before(async () => authorization = await getAuthorization())

  describe('/api/v1/auth/login (POST)', () => {
    it('{"body":{"username":"ns17","password":"123456"}} - 401 error, invalid username', async () => {
      const body = {
        username: 'ns17',
        password: '123456'
      }
      const res = await chai.request(server).post('/api/v1/auth/login').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid username or password' })
    })

    it('{"body":{"username":"ns16","password":"123457"}} - 401 error, invalid password', async () => {
      const body = {
        username: 'ns16',
        password: '123457'
      }
      const res = await chai.request(server).post('/api/v1/auth/login').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid username or password' })
    })

    it('{"body":{"username":"ns16","password":"123456"}} - success', async () => {
      const body = {
        username: 'ns16',
        password: '123456'
      }
      const res = await chai.request(server).post('/api/v1/auth/login').send(body)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(adminSchema)
      res.body.data.should.deep.match({
        id: 1,
        username: 'ns16'
      })
    })
  })

  describe('/api/v1/auth/me (GET)', () => {
    it('401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/auth/me')
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('success', async () => {
      const res = await chai.request(server).get('/api/v1/auth/me').set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(adminSchema)
      res.body.data.should.deep.match({
        id: 1,
        username: 'ns16'
      })
    })
  })
})
