import chai from 'chai'
import { getAuthorization, createArticle } from './_tools/helpers.js'
import {
  articleSchema,
  articlesListSchema,
  articlesWithContentListSchema,
  articlesWithTagsListSchema,
  articlesWithUserListSchema,
  articleWithContentSchema,
  articleWithTagsSchema,
  articleWithUserSchema,
  paginationSchema
} from './_tools/schemas.js'
import server from '../index.js'

let authorization = null

describe('ArticlesController (e2e)', () => {
  before(async () => authorization = await getAuthorization())

  describe('/api/v1/articles (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/articles').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/articles')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/articles').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(articlesListSchema)
      res.body.data.should.have.lengthOf(10)
      res.body.pagination.should.be.jsonSchema(paginationSchema)
      res.body.pagination.should.deep.equal({
        page: 1,
        pageSize: 10,
        rowCount: 20,
        pageCount: 2
      })
    })

    describe('paging', () => {
      it('{"query":{"page":1}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ page: 1 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"page":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ page: 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 2,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"page":3}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ page: 3 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 3,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"pageSize":20}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ pageSize: 20 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 20,
          rowCount: 20,
          pageCount: 1
        })
      })

      it('{"query":{"pageSize":30}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ pageSize: 30 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 30,
          rowCount: 20,
          pageCount: 1
        })
      })
    })

    describe('sort', () => {
      it('{"query":{"sort":"id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ sort: 'id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].id', 1)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"sort":"-id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ sort: '-id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].id', 20)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"sort":"title"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ sort: 'title' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].title', 'adipisci ducimus occaecati')
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"sort":"-title"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ sort: '-title' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property('[0].title', 'voluptatum necessitatibus totam')
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })
    })

    describe('includes', () => {
      it('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be one of [user, content, tags]' })
      })

      it('{"query":{"includes":["user"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'includes[]': 'user' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesWithUserListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"includes":["content"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'includes[]': 'content' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesWithContentListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"includes":["tags"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'includes[]': 'tags' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesWithTagsListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })
    })

    describe('filters', () => {
      it('{"query":{"filters[id__foo]":15}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__foo]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[id__gt]":15}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__gt]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.greaterThan(15))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__gte]":15}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__gte]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.greaterThanOrEqual(15))
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
          .get('/api/v1/articles')
          .query({ 'filters[id__lt]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.lessThan(6))
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
          .get('/api/v1/articles')
          .query({ 'filters[id__lte]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.lessThanOrEqual(6))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__gte]":17,"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({
            'filters[id__gte]': 17,
            'filters[id__lte]': 4
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      it('{"query":{"filters[id__lte]":4,"filters[id__gte]":17}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({
            'filters[id__lte]': 4,
            'filters[id__gte]': 17
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      it('{"query":{"filters[id__eq]":10}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__eq]': 10 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.id.should.be.eql(10))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__ne]":10}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__ne]': 10 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => item.id.should.not.be.eql(10))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 19,
          pageCount: 2
        })
      })

      it('{"query":{"filters[id__between]":[8,13]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__between]': [8, 13] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.be.within(8, 13))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__notBetween]":[8,13]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__notBetween]': [8, 13] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => item.id.should.be.not.within(8, 13))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 14,
          pageCount: 2
        })
      })

      it('{"query":{"filters[id__in]":[2,10,18]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__in]': [2, 10, 18] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => [2, 10, 18].should.include(item.id))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__notIn]":[2,10,18]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[id__notIn]': [2, 10, 18] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => [2, 10, 18].should.not.include(item.id))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 17,
          pageCount: 2
        })
      })

      it('{"query":{"filters[title__foo]":"sint repellendus inventore"}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[title__foo]': 'sint repellendus inventore' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[title__eq]":"sint repellendus inventore"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[title__eq]': 'sint repellendus inventore' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.title.should.be.equal('sint repellendus inventore'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      it('{"query":{"filters[title__ne]":"sint repellendus inventore"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[title__ne]': 'sint repellendus inventore' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => item.title.should.be.not.equal('sint repellendus inventore'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 19,
          pageCount: 2
        })
      })

      it('{"query":{"filters[title__in]":["sint repellendus inventore","facere ea odit"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[title__in]': ['sint repellendus inventore', 'facere ea odit'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => ['sint repellendus inventore', 'facere ea odit'].should.include(item.title))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      it('{"query":{"filters[title__notIn]":["sint repellendus inventore","facere ea odit"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[title__notIn]': ['sint repellendus inventore', 'facere ea odit'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => ['sint repellendus inventore', 'facere ea odit'].should.not.include(item.title))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 18,
          pageCount: 2
        })
      })

      it('{"query":{"filters[title__like]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[title__like]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => item.title.should.have.string('a'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 15,
          pageCount: 2
        })
      })

      it('{"query":{"filters[title__notLike]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({ 'filters[title__notLike]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.title.should.not.have.string('a'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"filters[title__like]":"b","filters[title__notLike]":"b"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({
            'filters[title__like]': 'b',
            'filters[title__notLike]': 'b'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      it('{"query":{"filters[title__notLike]":"b","filters[title__like]":"b"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles')
          .query({
            'filters[title__notLike]': 'b',
            'filters[title__like]': 'b'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
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

  describe('/api/v1/articles/all (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/articles/all').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/articles/all')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server)
        .get('/api/v1/articles/all')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(articlesListSchema)
      res.body.data.should.have.lengthOf(20)
    })

    describe('sort', () => {
      it('{"query":{"sort":"id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ sort: 'id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.data.should.have.nested.property('[0].id', 1)
      })

      it('{"query":{"sort":"-id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ sort: '-id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.data.should.have.nested.property('[0].id', 20)
      })

      it('{"query":{"sort":"title"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ sort: 'title' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.data.should.have.nested.property('[0].title', 'adipisci ducimus occaecati')
      })

      it('{"query":{"sort":"-title"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ sort: '-title' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.data.should.have.nested.property('[0].title', 'voluptatum necessitatibus totam')
      })
    })

    describe('includes', () => {
      it('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be one of [user, content, tags]' })
      })

      it('{"query":{"includes":["user"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'includes[]': 'user' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesWithUserListSchema)
        res.body.data.should.have.lengthOf(20)
      })

      it('{"query":{"includes":["content"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'includes[]': 'content' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesWithContentListSchema)
        res.body.data.should.have.lengthOf(20)
      })

      it('{"query":{"includes":["tags"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'includes[]': 'tags' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesWithTagsListSchema)
        res.body.data.should.have.lengthOf(20)
      })
    })

    describe('filters', () => {
      it('{"query":{"filters[id__foo]":15}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__foo]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[id__gt]":15}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__gt]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.greaterThan(15))
      })

      it('{"query":{"filters[id__gte]":15}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__gte]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.greaterThanOrEqual(15))
      })

      it('{"query":{"filters[id__lt]":6}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__lt]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.lessThan(6))
      })

      it('{"query":{"filters[id__lte]":6}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__lte]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.lessThanOrEqual(6))
      })

      it('{"query":{"filters[id__gte]":17,"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({
            'filters[id__gte]': 17,
            'filters[id__lte]': 4
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[id__lte]":4,"filters[id__gte]":17}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({
            'filters[id__lte]': 4,
            'filters[id__gte]': 17
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[id__eq]":10}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__eq]': 10 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.id.should.be.equal(10))
      })

      it('{"query":{"filters[id__ne]":10}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__ne]': 10 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(19)
        res.body.data.forEach(item => item.id.should.be.not.equal(10))
      })

      it('{"query":{"filters[id__between]":[8,13]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__between]': [8, 13] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.be.within(8, 13))
      })

      it('{"query":{"filters[id__notBetween]":[8,13]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__notBetween]': [8, 13] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(14)
        res.body.data.forEach(item => item.id.should.be.not.within(8, 13))
      })

      it('{"query":{"filters[id__in]":[2,10,18]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__in]': [2, 10, 18] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => [2, 10, 18].should.include(item.id))
      })

      it('{"query":{"filters[id__notIn]":[2,5,8]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[id__notIn]': [2, 10, 18] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(17)
        res.body.data.forEach(item => [2, 10, 18].should.not.include(item.id))
      })

      it('{"query":{"filters[title__foo]":"sint repellendus inventore"}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[title__foo]': 'sint repellendus inventore' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[title__eq]":"sint repellendus inventore"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[title__eq]': 'sint repellendus inventore' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.title.should.be.equal('sint repellendus inventore'))
      })

      it('{"query":{"filters[title__ne]":"sint repellendus inventore"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[title__ne]': 'sint repellendus inventore' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(19)
        res.body.data.forEach(item => item.title.should.be.not.equal('sint repellendus inventore'))
      })

      it('{"query":{"filters[title__in]":["sint repellendus inventore","facere ea odit"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[title__in]': ['sint repellendus inventore', 'facere ea odit'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => ['sint repellendus inventore', 'facere ea odit'].should.include(item.title))
      })

      it('{"query":{"filters[title__notIn]":["sint repellendus inventore","facere ea odit"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[title__notIn]': ['sint repellendus inventore', 'facere ea odit'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(18)
        res.body.data.forEach(item => ['sint repellendus inventore', 'facere ea odit'].should.not.include(item.title))
      })

      it('{"query":{"filters[title__like]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[title__like]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(15)
        res.body.data.forEach(item => item.title.should.have.string('a'))
      })

      it('{"query":{"filters[title__notLike]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({ 'filters[title__notLike]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.title.should.not.have.string('a'))
      })

      it('{"query":{"filters[title__like]":"b","filters[title__notLike]":"b"}}', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({
            'filters[title__like]': 'b',
            'filters[title__notLike]': 'b'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[title__notLike]":"b","filters[title__like]":"b"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/all')
          .query({
            'filters[title__notLike]': 'b',
            'filters[title__like]': 'b'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articlesListSchema)
        res.body.data.should.have.lengthOf(0)
      })
    })
  })

  describe('/api/v1/articles/:id (GET)', () => {
    it('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/articles/1').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"query":{}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server)
        .get('/api/v1/articles/a')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"query":{}} - 404 error, entity not found', async () => {
      const res = await chai.request(server)
        .get('/api/v1/articles/100')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":1},"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/articles/1')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"params":{"id":1},"query":{}} - success', async () => {
      const res = await chai.request(server)
        .get('/api/v1/articles/1')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(articleSchema)
      res.body.data.should.have.property('id', 1)
    })

    describe('includes', () => {
      it('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/1')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be one of [user, content, tags]' })
      })

      it('{"params":{"id":1},{"query":{"includes":["user"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/1')
          .query({ 'includes[]': 'user' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articleWithUserSchema)
        res.body.data.should.have.property('id', 1)
      })

      it('{"params":{"id":1},{"query":{"includes":["content"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/1')
          .query({ 'includes[]': 'content' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articleWithContentSchema)
        res.body.data.should.have.property('id', 1)
      })

      it('{"params":{"id":1},{"query":{"includes":["tags"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/articles/1')
          .query({ 'includes[]': 'tags' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(articleWithTagsSchema)
        res.body.data.should.have.property('id', 1)
      })
    })
  })

  describe('/api/v1/articles (POST)', () => {
    it('{"body":{"user_id":1,"title":"illum beatae soluta","description":"...","status":"published"}} - 401 error, invalid token', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await chai.request(server).post('/api/v1/articles').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"body":{"user_id":100,"title":"illum beatae soluta","description":"...","status":"published"}} - 400 error, user model with id 100 must be exists', async () => {
      const body = {
        user_id: 100,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await chai.request(server)
        .post('/api/v1/articles')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'User model with id 100 must be exists' })
    })

    it('{"body":{"user_id":1,"title":"illum beatae soluta","description":"...","status":"published"}} - success', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await chai.request(server)
        .post('/api/v1/articles')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(201)
      res.body.data.should.be.jsonSchema(articleSchema)
      res.body.data.should.deep.match({
        id: 21,
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      })
    })
  })

  describe('/api/v1/articles/:id (PUT)', () => {
    it('{"params":{"id":21},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 401 error, invalid token', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await chai.request(server).put('/api/v1/articles/21').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 400 error, id param must be a number', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await chai.request(server)
        .put('/api/v1/articles/a')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 404 error, entity not found', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await chai.request(server)
        .put('/api/v1/articles/100')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":21},"body":{"user_id":100,"title":"illum beatae cumque","description":"...","status":"published"}} - 400 error, user model with id 100 must be exists', async () => {
      const article = await createArticle()
      const body = {
        user_id: 100,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await chai.request(server)
        .put(`/api/v1/articles/${article.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'User model with id 100 must be exists' })
    })

    it('{"params":{"id":21},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - success', async () => {
      const article = await createArticle()
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await chai.request(server)
        .put(`/api/v1/articles/${article.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(articleSchema)
      res.body.data.should.deep.match({
        id: article.id,
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      })
    })
  })

  describe('/api/v1/articles/:id (DELETE)', () => {
    it('{"params":{"id":21}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).delete('/api/v1/articles/21')
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server).delete('/api/v1/articles/a').set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100}} - 404 error, entity not found', async () => {
      const res = await chai.request(server).delete('/api/v1/articles/100').set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":21}} - success', async () => {
      const article = await createArticle()
      const res = await chai.request(server)
        .delete(`/api/v1/articles/${article.id}`)
        .set('Authorization', authorization)
      res.should.have.status(204)
      res.body.should.deep.equal({})
    })
  })
})
