import chai from 'chai'
import { getAuthorization, createAdmin } from './_tools/helpers.js'
import { adminSchema, adminsListSchema, paginationSchema } from './_tools/schemas.js'
import server from '../index.js'

let authorization = null

describe('AdminsController (e2e)', () => {
  before(async () => authorization = await getAuthorization())

  describe('/api/v1/admins (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/admins').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/admins')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/admins').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(adminsListSchema)
      res.body.data.should.have.lengthOf(1)
      res.body.pagination.should.be.jsonSchema(paginationSchema)
      res.body.pagination.should.deep.equal({
        page: 1,
        pageSize: 10,
        rowCount: 1,
        pageCount: 1
      })
    })

    describe('paging', () => {
      it('{"query":{"page":1}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/admins')
          .query({ page: 1 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(adminsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      it('{"query":{"page":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/admins')
          .query({ page: 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(adminsListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 2,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })
    })
  })

  describe('/api/v1/admins/all (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/admins/all').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/admins/all')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server)
        .get('/api/v1/admins/all')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(adminsListSchema)
      res.body.data.should.have.lengthOf(1)
    })
  })

  describe('/api/v1/admins/:id (GET)', () => {
    it('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/admins/1').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"query":{}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server).get('/api/v1/admins/a').query({}).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"query":{}} - 404 error, entity not found', async () => {
      const res = await chai.request(server)
        .get('/api/v1/admins/100')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":1},"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/admins/1')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"params":{"id":1},"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/admins/1').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(adminSchema)
      res.body.data.should.have.property('id', 1)
    })
  })

  describe('/api/v1/admins (POST)', () => {
    it('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/admins').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"body":{"name":"Anatoly Muravyov","username":"ns16","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - 400 error, username field must be unique', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'ns16',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/admins').send(body).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'username field must be unique' })
    })

    it('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov+gmail.com"}} - 400 error, email must be an email', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov+gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/admins').send(body).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"email" must be a valid email' })
    })

    it('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"nikolay.shamayko@gmail.com"}} - 400 error, email field must be unique', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'nikolay.shamayko@gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/admins').send(body).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'email field must be unique' })
    })

    it('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - success', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/admins').send(body).set('Authorization', authorization)
      res.should.have.status(201)
      res.body.data.should.be.jsonSchema(adminSchema)
      res.body.data.should.deep.match({
        id: 2,
        name: 'Anatoly Muravyov',
        username: 'test',
        email: 'anatoly.muravyov@gmail.com'
      })
    })
  })

  describe('/api/v1/admins/:id (PUT)', () => {
    it('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await chai.request(server).put('/api/v1/admins/2').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 400 error, id param must be a number', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await chai.request(server)
        .put('/api/v1/admins/a')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 404 error, entity not found', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await chai.request(server)
        .put('/api/v1/admins/100')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"ns16","email":"anatoly.muravyov@gmail.com"}} - 400 error, username field must be unique', async () => {
      const admin = await createAdmin()
      const body = {
        name: 'Anatoly Muravyov',
        username: 'ns16',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await chai.request(server)
        .put(`/api/v1/admins/${admin.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'username field must be unique' })
    })

    it('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov+gmail.com"}} - 400 error, email must be an email', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov+gmail.com'
      }
      const res = await chai.request(server)
        .put('/api/v1/admins/2')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"email" must be a valid email' })
    })

    it('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"nikolay.shamayko@gmail.com"}} - 400 error, email field must be unique', async () => {
      const admin = await createAdmin()
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'nikolay.shamayko@gmail.com'
      }
      const res = await chai.request(server)
        .put(`/api/v1/admins/${admin.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'email field must be unique' })
    })

    it('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - success', async () => {
      const admin = await createAdmin()
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await chai.request(server)
        .put(`/api/v1/admins/${admin.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(adminSchema)
      res.body.data.should.deep.match({
        id: admin.id,
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      })
    })
  })

  describe('/api/v1/admins/:id (DELETE)', () => {
    it('{"params":{"id":2}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).delete('/api/v1/admins/2')
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server).delete('/api/v1/admins/a').set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100}} - 404 error, entity not found', async () => {
      const res = await chai.request(server).delete('/api/v1/admins/100').set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":2}} - success', async () => {
      const admin = await createAdmin()
      const res = await chai.request(server).delete(`/api/v1/admins/${admin.id}`).set('Authorization', authorization)
      res.should.have.status(204)
      res.body.should.deep.equal({})
    })
  })
})
