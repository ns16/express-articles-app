import chai from 'chai'
import { getAuthorization, createUser } from './_tools/helpers.js'
import {
  userSchema,
  usersListSchema,
  paginationSchema,
  usersWithArticlesListSchema,
  userWithArticlesSchema
} from './_tools/schemas.js'
import server from '../index.js'

let authorization = null

describe('UsersController (e2e)', () => {
  before(async () => authorization = await getAuthorization())

  describe('/api/v1/users (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/users').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/users')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/users').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(usersListSchema)
      res.body.data.should.have.lengthOf(10)
      res.body.pagination.should.be.jsonSchema(paginationSchema)
      res.body.pagination.should.deep.equal({
        page: 1,
        pageSize: 10,
        rowCount: 10,
        pageCount: 1
      })
    })

    describe('paging', () => {
      it('{"query":{"page":1}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ page: 1 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })

      it('{"query":{"page":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ page: 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 2,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })
    })

    describe('sort', () => {
      it('{"query":{"sort":"id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ sort: 'id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].id', 1)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })

      it('{"query":{"sort":"-id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ sort: '-id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].id', 10)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })

      it('{"query":{"sort:"username"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ sort: 'username' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].username', 'Albina_Kuphal-Zieme')
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })

      it('{"query":{"sort":"-username"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ sort: '-username' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].username', 'Sheldon52')
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })
    })

    describe('includes', () => {
      it('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [articles]' })
      })

      it('{"query":{"includes":["articles"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersWithArticlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })
    })

    describe('filters', () => {
      it('{"query":{"filters[id__foo]":5}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__foo]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[id__gt]":5}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__gt]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.be.greaterThan(5))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__gte]":5}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__gte]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.be.greaterThanOrEqual(5))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__lt]":6}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__lt]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.be.lessThan(6))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__lte]":6}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__lte]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.be.lessThanOrEqual(6))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__gte]":7,"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({
            'filters[id__gte]': 7,
            'filters[id__lte]': 4
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      it('{"query":{"filters[id__lte]":4,"filters[id__gte]":7}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({
            'filters[id__lte]': 4,
            'filters[id__gte]': 7
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      it('{"query":{"filters[id__eq]":5}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__eq]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.id.should.be.equal(5))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__ne]":5}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__ne]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(9)
        res.body.data.forEach(item => item.id.should.be.not.equal(5))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 9,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__between]":[4,6]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__between]': [4, 6] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.id.should.be.within(4, 6))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__notBetween]":[4,6]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__notBetween]': [4, 6] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(7)
        res.body.data.forEach(item => item.id.should.be.not.within(4, 6))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 7,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__in]":[2,5,8]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__in]': [2, 5, 8] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => [2, 5, 8].should.include(item.id))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__notIn]":[2,5,8]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[id__notIn]': [2, 5, 8] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(7)
        res.body.data.forEach(item => [2, 5, 8].should.not.include(item.id))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 7,
          pageCount: 1
        })
      })

      it('{"query":{"filters[username__foo]":"Sheldon52"}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[username__foo]': 'Sheldon52' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[username__eq]":"Sheldon52"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[username__eq]': 'Sheldon52' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.username.should.be.equal('Sheldon52'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      it('{"query":{"filters[username__ne]":"Sheldon52"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[username__ne]': 'Sheldon52' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(9)
        res.body.data.forEach(item => item.username.should.be.not.equal('Sheldon52'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 9,
          pageCount: 1
        })
      })

      it('{"query":{"filters[username__in]":["Sheldon52","Hester_Schowalter67"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[username__in]': ['Sheldon52', 'Hester_Schowalter67'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => ['Sheldon52', 'Hester_Schowalter67'].should.include(item.username))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      it('{"query":{"filters[username__notIn]":["Sheldon52","Hester_Schowalter67"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[username__notIn]': ['Sheldon52', 'Hester_Schowalter67'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(8)
        res.body.data.forEach(item => ['Sheldon52', 'Hester_Schowalter67'].should.not.include(item.username))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 8,
          pageCount: 1
        })
      })

      it('{"query":{"filters[username__like]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[username__like]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.username.should.have.string('a'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"filters[username__notLike]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({ 'filters[username__notLike]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.username.should.not.have.string('a'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"filters[username__like]":"b","filters[username__notLike]":"b"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({
            'filters[username__like]': 'b',
            'filters[username__notLike]': 'b'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      it('{"query":{"filters[username__notLike]":"b","filters[username__like]":"b"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users')
          .query({
            'filters[username__notLike]': 'b',
            'filters[username__like]': 'b'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })
    })
  })

  describe('/api/v1/users/all (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/users/all').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/users/all')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server)
        .get('/api/v1/users/all')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(usersListSchema)
      res.body.data.should.have.lengthOf(10)
    })

    describe('sort', () => {
      it('{"query":{"sort":"id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ sort: 'id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].id', 1)
      })

      it('{"query":{"sort":"-id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ sort: '-id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].id', 10)
      })

      it('{"query":{"sort":"username"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ sort: 'username' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].username', 'Albina_Kuphal-Zieme')
      })

      it('{"query":{"sort":"-username"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ sort: '-username' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].username', 'Sheldon52')
      })
    })

    describe('includes', () => {
      it('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [articles]' })
      })

      it('{"query":{"includes":["articles"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersWithArticlesListSchema)
        res.body.data.should.have.lengthOf(10)
      })
    })

    describe('filters', () => {
      it('{"query":{"filters[id__foo]":5}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__foo]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[id__gt]":5}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__gt]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.be.greaterThan(5))
      })

      it('{"query":{"filters[id__gte]":5}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__gte]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.be.greaterThanOrEqual(5))
      })

      it('{"query":{"filters[id__lt]":6}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__lt]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.be.lessThan(6))
      })

      it('{"query":{"filters[id__lte]":6}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__lte]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.be.lessThanOrEqual(6))
      })

      it('{"query":{"filters[id__gte]":7,"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({
            'filters[id__gte]': 7,
            'filters[id__lte]': 4
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[id__lte]":4,"filters[id__gte]":7}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({
            'filters[id__lte]': 4,
            'filters[id__gte]': 7
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[id__eq]":5}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__eq]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.id.should.be.equal(5))
      })

      it('{"query":{"filters[id__ne]":5}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__ne]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(9)
        res.body.data.forEach(item => item.id.should.be.not.equal(5))
      })

      it('{"query":{"filters[id__between]":[4,6]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__between]': [4, 6] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.id.should.be.within(4, 6))
      })

      it('{"query":{"filters[id__notBetween]":[4,6]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__notBetween]': [4, 6] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(7)
        res.body.data.forEach(item => item.id.should.be.not.within(4, 6))
      })

      it('{"query":{"filters[id__in]":[2,5,8]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__in]': [2, 5, 8] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => [2, 5, 8].should.include(item.id))
      })

      it('{"query":{"filters[id__notIn]":[2,5,8]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[id__notIn]': [2, 5, 8] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(7)
        res.body.data.forEach(item => [2, 5, 8].should.not.include(item.id))
      })

      it('{"query":{"filters[username__foo]":"Sheldon52"}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[username__foo]': 'Sheldon52' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[username__eq]":"Sheldon52"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[username__eq]': 'Sheldon52' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.username.should.be.equal('Sheldon52'))
      })

      it('{"query":{"filters[username__ne]":"Sheldon52"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[username__ne]': 'Sheldon52' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(9)
        res.body.data.forEach(item => item.username.should.be.not.equal('Sheldon52'))
      })

      it('{"query":{"filters[username__in]":["Sheldon52","Hester_Schowalter67"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[username__in]': ['Sheldon52', 'Hester_Schowalter67'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => ['Sheldon52', 'Hester_Schowalter67'].should.include(item.username))
      })

      it('{"query":{"filters[username__notIn]":["Sheldon52","Hester_Schowalter67"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[username__notIn]': ['Sheldon52', 'Hester_Schowalter67'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(8)
        res.body.data.forEach(item => ['Sheldon52', 'Hester_Schowalter67'].should.not.include(item.username))
      })

      it('{"query":{"filters[username__like]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[username__like]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.username.should.have.string('a'))
      })

      it('{"query":{"filters[username__notLike]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({ 'filters[username__notLike]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.username.should.not.have.string('a'))
      })

      it('{"query":{"filters[username__like]":"b","filters[username__notLike]":"b"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({
            'filters[username__like]': 'b',
            'filters[username__notLike]': 'b'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[username__notLike]":"b","filters[username__like]":"b"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/all')
          .query({
            'filters[username__notLike]': 'b',
            'filters[username__like]': 'b'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(usersListSchema)
        res.body.data.should.have.lengthOf(0)
      })
    })
  })

  describe('/api/v1/users/:id (GET)', () => {
    it('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/users/1').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"query":{}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server).get('/api/v1/users/a').query({}).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"query":{}} - 404 error, entity not found', async () => {
      const res = await chai.request(server)
        .get('/api/v1/users/100')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":1},"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/users/1')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"params":{"id":1},"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/users/1').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(userSchema)
      res.body.data.should.have.property('id', 1)
    })

    describe('includes', () => {
      it('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/1')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [articles]' })
      })

      it('{"params":{"id":1},{"query":{"includes":["articles"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/users/1')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(userWithArticlesSchema)
        res.body.data.should.have.property('id', 1)
      })
    })
  })

  describe('/api/v1/users (POST)', () => {
    it('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/users').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"body":{"name":"Rosalind Trantow","username":"Sheldon52","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, username field must be unique', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Sheldon52',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/users').send(body).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'username field must be unique' })
    })

    it('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35+gmail.com"}} - 400 error, email must be an email', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35+gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/users').send(body).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"email" must be a valid email' })
    })

    it('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Sheldon_Bahringer6@yahoo.com"}} - 400 error, email field must be unique', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Sheldon_Bahringer6@yahoo.com'
      }
      const res = await chai.request(server).post('/api/v1/users').send(body).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'email field must be unique' })
    })

    it('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - success', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await chai.request(server).post('/api/v1/users').send(body).set('Authorization', authorization)
      res.should.have.status(201)
      res.body.data.should.be.jsonSchema(userSchema)
      res.body.data.should.deep.match({
        id: 11,
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        email: 'Rosalind.Trantow35@gmail.com'
      })
    })
  })

  describe('/api/v1/users/:id (PUT)', () => {
    it('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await chai.request(server).put('/api/v1/users/11').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, id param must be a number', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await chai.request(server).put('/api/v1/users/a').send(body).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 404 error, entity not found', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await chai.request(server)
        .put('/api/v1/users/100')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Sheldon52","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, username field must be unique', async () => {
      const user = await createUser()
      const body = {
        name: 'Rosalind Trantow',
        username: 'Sheldon52',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await chai.request(server)
        .put(`/api/v1/users/${user.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'username field must be unique' })
    })

    it('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35+gmail.com"}} - 400 error, email must be an email', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35+gmail.com'
      }
      const res = await chai.request(server)
        .put('/api/v1/users/11')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"email" must be a valid email' })
    })

    it('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Sheldon_Bahringer6@yahoo.com"}} - 400 error, email field must be unique', async () => {
      const user = await createUser()
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Sheldon_Bahringer6@yahoo.com'
      }
      const res = await chai.request(server)
        .put(`/api/v1/users/${user.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'email field must be unique' })
    })

    it('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - success', async () => {
      const user = await createUser()
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await chai.request(server)
        .put(`/api/v1/users/${user.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(userSchema)
      res.body.data.should.deep.match({
        id: user.id,
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      })
    })
  })

  describe('/api/v1/users/:id (DELETE)', () => {
    it('{"params":{"id":11}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).delete('/api/v1/users/11')
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server).delete('/api/v1/users/a').set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100}} - 404 error, entity not found', async () => {
      const res = await chai.request(server).delete('/api/v1/users/100').set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":11}} - success', async () => {
      const user = await createUser()
      const res = await chai.request(server).delete(`/api/v1/users/${user.id}`).set('Authorization', authorization)
      res.should.have.status(204)
      res.body.should.deep.equal({})
    })
  })
})
