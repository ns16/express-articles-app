import chai from 'chai'

import server from '../index.js'

import { getAuthorization, createTag } from './_tools/helpers.js'
import {
  tagSchema,
  tagsListSchema,
  paginationSchema,
  tagsWithArticlesListSchema,
  tagWithArticlesSchema
} from './_tools/schemas.js'

let authorization = null

describe('TagsController (e2e)', () => {
  before(async () => {
    authorization = await getAuthorization()
  })

  describe('/api/v1/tags (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/tags').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/tags')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/tags').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(tagsListSchema)
      res.body.data.should.have.lengthOf(5)
      res.body.pagination.should.be.jsonSchema(paginationSchema)
      res.body.pagination.should.deep.equal({
        page: 1,
        pageSize: 10,
        rowCount: 5,
        pageCount: 1
      })
    })

    describe('paging', () => {
      it('{"query":{"page":1}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ page: 1 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"page":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ page: 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 2,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })
    })

    describe('sort', () => {
      it('{"query":{"sort":"id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ sort: 'id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.should.have.nested.property('[0].id', 1)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"sort":"-id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ sort: '-id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.should.have.nested.property('[0].id', 5)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"sort":"name"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ sort: 'name' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.should.have.nested.property('[0].name', 'aliquam')
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"sort":"-name"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ sort: '-name' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.should.have.nested.property('[0].name', 'veniam')
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })
    })

    describe('includes', () => {
      it('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [articles]' })
      })

      it('{"query":{"includes":["articles"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsWithArticlesListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })
    })

    describe('filters', () => {
      it('{"query":{"filters[id__foo]":3}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__foo]': 3 })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[id__gt]":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__gt]': 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.id.should.greaterThan(2))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__gte]":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__gte]': 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(4)
        res.body.data.forEach(item => item.id.should.greaterThanOrEqual(2))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__lt]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__lt]': 4 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.id.should.lessThan(4))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__lte]': 4 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(4)
        res.body.data.forEach(item => item.id.should.lessThanOrEqual(4))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__gte]":2,"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({
            'filters[id__gte]': 2,
            'filters[id__lte]': 4
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__lte]":4,"filters[id__gte]":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({
            'filters[id__lte]': 4,
            'filters[id__gte]': 2
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__eq]":3}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__eq]': 3 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.id.should.be.equal(3))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__ne]":3}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__ne]': 3 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(4)
        res.body.data.forEach(item => item.id.should.be.not.equal(3))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__between]":[2,4]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__between]': [2, 4] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.id.should.be.within(2, 4))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__notBetween]":[2,4]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__notBetween]': [2, 4] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => item.id.should.be.not.within(2, 4))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__in]":[2,4]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__in]': [2, 4] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => [2, 4].should.include(item.id))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      it('{"query":{"filters[id__notIn]":[2,4]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[id__notIn]': [2, 4] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => [2, 4].should.not.include(item.id))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[name__foo]":"nulla"}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[name__foo]': 'nulla' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[name__eq]":"nulla"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[name__eq]': 'nulla' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.name.should.be.equal('nulla'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      it('{"query":{"filters[name__ne]":"nulla"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[name__ne]': 'nulla' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(4)
        res.body.data.forEach(item => item.name.should.be.not.equal('nulla'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        })
      })

      it('{"query":{"filters[name__in]":["rem","perferendis"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[name__in]': ['rem', 'perferendis'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => ['rem', 'perferendis'].should.include(item.name))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      it('{"query":{"filters[name__notIn]":["rem","perferendis"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[name__notIn]': ['rem', 'perferendis'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => ['rem', 'perferendis'].should.not.include(item.name))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[name__like]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[name__like]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.name.should.have.string('a'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      it('{"query":{"filters[name__notLike]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({ 'filters[name__notLike]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => item.name.should.not.have.string('a'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      it('{"query":{"filters[name__like]":"a","filters[name__notLike]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({
            'filters[name__like]': 'a',
            'filters[name__notLike]': 'a'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      it('{"query":{"filters[name__notLike]":"a","filters[name__like]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags')
          .query({
            'filters[name__notLike]': 'a',
            'filters[name__like]': 'a'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
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

  describe('/api/v1/tags/all (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/tags/all').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/tags/all')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/tags/all').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(tagsListSchema)
      res.body.data.should.have.lengthOf(5)
    })

    describe('sort', () => {
      it('{"query":{"sort":"id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ sort: 'id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.should.have.nested.property('[0].id', 1)
      })

      it('{"query":{"sort":"-id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ sort: '-id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.should.have.nested.property('[0].id', 5)
      })

      it('{"query":{"sort":"name"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ sort: 'name' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.should.have.nested.property('[0].name', 'aliquam')
      })

      it('{"query":{"sort":"-name"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ sort: '-name' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.should.have.nested.property('[0].name', 'veniam')
      })
    })

    describe('includes', () => {
      it('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [articles]' })
      })

      it('{"query":{"includes":["articles"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsWithArticlesListSchema)
        res.body.data.should.have.lengthOf(5)
      })
    })

    describe('filters', () => {
      it('{"query":{"filters[id__foo]":3}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__foo]': 3 })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[id__gt]":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__gt]': 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.id.should.greaterThan(2))
      })

      it('{"query":{"filters[id__gte]":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__gte]': 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(4)
        res.body.data.forEach(item => item.id.should.greaterThanOrEqual(2))
      })

      it('{"query":{"filters[id__lt]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__lt]': 4 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.id.should.lessThan(4))
      })

      it('{"query":{"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__lte]': 4 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(4)
        res.body.data.forEach(item => item.id.should.lessThanOrEqual(4))
      })

      it('{"query":{"filters[id__gte]":2,"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({
            'filters[id__gte]': 2,
            'filters[id__lte]': 4
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
      })

      it('{"query":{"filters[id__lte]":4,"filters[id__gte]":2}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({
            'filters[id__lte]': 4,
            'filters[id__gte]': 2
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
      })

      it('{"query":{"filters[id__eq]":3}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__eq]': 3 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.id.should.be.equal(3))
      })

      it('{"query":{"filters[id__ne]":3}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__ne]': 3 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(4)
        res.body.data.forEach(item => item.id.should.be.not.equal(3))
      })

      it('{"query":{"filters[id__between]":[2,4]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__between]': [2, 4] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.id.should.be.within(2, 4))
      })

      it('{"query":{"filters[id__notBetween]":[2,4]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__notBetween]': [2, 4] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => item.id.should.be.not.within(2, 4))
      })

      it('{"query":{"filters[id__in]":[2,4]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__in]': [2, 4] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => [2, 4].should.include(item.id))
      })

      it('{"query":{"filters[id__notIn]":[2,4]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[id__notIn]': [2, 4] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => [2, 4].should.not.include(item.id))
      })

      it('{"query":{"filters[name__foo]":"nulla"}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[name__foo]': 'nulla' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[name__eq]":"nulla"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[name__eq]': 'nulla' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.name.should.be.equal('nulla'))
      })

      it('{"query":{"filters[name__ne]":"nulla"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[name__ne]': 'nulla' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(4)
        res.body.data.forEach(item => item.name.should.be.not.equal('nulla'))
      })

      it('{"query":{"filters[name__in]":["rem","perferendis"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[name__in]': ['rem', 'perferendis'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => ['rem', 'perferendis'].should.include(item.name))
      })

      it('{"query":{"filters[name__notIn]":["rem","perferendis"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[name__notIn]': ['rem', 'perferendis'] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => ['rem', 'perferendis'].should.not.include(item.name))
      })

      it('{"query":{"filters[name__like]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[name__like]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => item.name.should.have.string('a'))
      })

      it('{"query":{"filters[name__notLike]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({ 'filters[name__notLike]': 'a' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => item.name.should.not.have.string('a'))
      })

      it('{"query":{"filters[name__like]":"a","filters[name__notLike]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({
            'filters[name__like]': 'a',
            'filters[name__notLike]': 'a'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[name__notLike]":"a","filters[name__like]":"a"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/all')
          .query({
            'filters[name__notLike]': 'a',
            'filters[name__like]': 'a'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagsListSchema)
        res.body.data.should.have.lengthOf(0)
      })
    })
  })

  describe('/api/v1/tags/:id (GET)', () => {
    it('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/tags/1').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"query":{}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server).get('/api/v1/tags/a').query({}).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"query":{}} - 404 error, entity not found', async () => {
      const res = await chai.request(server).get('/api/v1/tags/100').query({}).set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":1},"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/tags/1')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"params":{"id":1},"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/tags/1').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(tagSchema)
      res.body.data.should.have.property('id', 1)
    })

    describe('includes', () => {
      it('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/1')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [articles]' })
      })

      it('{"params":{"id":1},{"query":{"includes":["articles"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/tags/1')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(tagWithArticlesSchema)
        res.body.data.should.have.property('id', 1)
      })
    })
  })

  describe('/api/v1/tags (POST)', () => {
    it('{"body":{"name":"beatae"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'beatae'
      }
      const res = await chai.request(server).post('/api/v1/tags').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"body":{"name":"beatae"}} - success', async () => {
      const body = {
        name: 'beatae'
      }
      const res = await chai.request(server).post('/api/v1/tags').send(body).set('Authorization', authorization)
      res.should.have.status(201)
      res.body.data.should.be.jsonSchema(tagSchema)
      res.body.data.should.deep.match({
        id: 6,
        name: 'beatae'
      })
    })
  })

  describe('/api/v1/tags/:id (PUT)', () => {
    it('{"params":{"id":6},"body":{"name":"labore}} - 401 error, invalid token', async () => {
      const body = {
        name: 'labore'
      }
      const res = await chai.request(server).put('/api/v1/tags/6').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"body":{"name":"labore"}} - 400 error, id param must be a number', async () => {
      const body = {
        name: 'labore'
      }
      const res = await chai.request(server).put('/api/v1/tags/a').send(body).set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"body":{"name":"labore"}} - 404 error, entity not found', async () => {
      const body = {
        name: 'labore'
      }
      const res = await chai.request(server)
        .put('/api/v1/tags/100')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":6},"body":{"name":"labore}} - success', async () => {
      const tag = await createTag()
      const body = {
        name: 'labore'
      }
      const res = await chai.request(server)
        .put(`/api/v1/tags/${tag.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(tagSchema)
      res.body.data.should.deep.match({
        id: tag.id,
        name: 'labore'
      })
    })
  })

  describe('/api/v1/tags/:id (DELETE)', () => {
    it('{"params":{"id":6}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).delete('/api/v1/tags/6')
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server).delete('/api/v1/tags/a').set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100}} - 404 error, entity not found', async () => {
      const res = await chai.request(server).delete('/api/v1/tags/100').set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":6}} - success', async () => {
      const tag = await createTag()
      const res = await chai.request(server).delete(`/api/v1/tags/${tag.id}`).set('Authorization', authorization)
      res.should.have.status(204)
      res.body.should.deep.equal({})
    })
  })
})
