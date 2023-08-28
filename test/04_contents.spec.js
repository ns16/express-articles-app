import chai from 'chai'
import { getAuthorization, createArticle, createContent } from './_tools/helpers.js'
import {
  contentSchema,
  contentsListSchema,
  contentsWithArticleListSchema,
  contentWithArticleSchema,
  paginationSchema
} from './_tools/schemas.js'
import server from '../index.js'

let authorization = null

describe('ContentsController (e2e)', () => {
  before(async () => authorization = await getAuthorization())

  describe('/api/v1/contents (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/contents').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/contents')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server).get('/api/v1/contents').query({}).set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ page: 1 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ page: 2 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ page: 3 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ pageSize: 20 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ pageSize: 30 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ sort: 'id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ sort: '-id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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

      it('{"query":{"sort":"body"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({ sort: 'body' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property(
          '[0].body',
          'Ab eum hic occaecati nisi magnam. Iusto inventore vero ea laborum libero exercitationem nam. Repudiandae nobis quis aspernatur.\n' +
          'Corporis libero autem odio in hic nostrum. Inventore molestias dicta molestias esse. Officiis optio inventore vero tempore error quasi aperiam earum tenetur.\n' +
          'Quae temporibus totam et molestias quas incidunt. Harum incidunt quo veniam aliquam neque ab ab possimus expedita. Quaerat non quod tempore.'
        )
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      it('{"query":{"sort:"-body"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({ sort: '-body' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.should.have.nested.property(
          '[0].body',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        )
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
          .get('/api/v1/contents')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [article]' })
      })

      it('{"query":{"includes":["article"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({ 'includes[]': 'article' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsWithArticleListSchema)
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
          .get('/api/v1/contents')
          .query({ 'filters[id__foo]': 5 })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[id__gt]":15}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({ 'filters[id__gt]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ 'filters[id__gte]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ 'filters[id__lt]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ 'filters[id__lte]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({
            'filters[id__gte]': 17,
            'filters[id__lte]': 4
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({
            'filters[id__lte]': 4,
            'filters[id__gte]': 17
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ 'filters[id__eq]': 10 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.id.should.be.equal(10))
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
          .get('/api/v1/contents')
          .query({ 'filters[id__ne]': 10 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => item.id.should.be.not.equal(10))
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
          .get('/api/v1/contents')
          .query({ 'filters[id__between]': [8, 13] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ 'filters[id__notBetween]': [8, 13] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ 'filters[id__in]': [2, 10, 18] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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
          .get('/api/v1/contents')
          .query({ 'filters[id__notIn]': [2, 10, 18] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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

      it('{"query":{"filters[body__foo]":"..."}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({
            'filters[body__foo]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[body__eq]":"..."}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({
            'filters[body__eq]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.body.should.be.equal(
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
        ))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      it('{"query":{"filters[body__ne]":"..."}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({
            'filters[body__ne]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => item.body.should.be.not.equal(
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
        ))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 19,
          pageCount: 2
        })
      })

      it('{"query":{"filters[body__in]":["...","..."]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({
            'filters[body__in]': [
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
              'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
              'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
              'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
            ]
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => [
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        ].should.include(item.body))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      it('{"query":{"filters[body__notIn]":["...","..."]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({
            'filters[body__notIn]': [
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
              'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
              'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
              'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
            ]
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => [
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        ].should.not.include(item.body))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 18,
          pageCount: 2
        })
      })

      it('{"query":{"filters[body__like]":"ab"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({ 'filters[body__like]': 'ab' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(10)
        res.body.data.forEach(item => item.body.should.have.string('ab'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 15,
          pageCount: 2
        })
      })

      it('{"query":{"filters[body__notLike]":"ab"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({ 'filters[body__notLike]': 'ab' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.body.should.not.have.string('ab'))
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      it('{"query":{"filters[body__like]":"ab","filters[body__notLike]":"ab"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({
            'filters[body__like]': 'ab',
            'filters[body__notLike]': 'ab'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(0)
        res.body.pagination.should.be.jsonSchema(paginationSchema)
        res.body.pagination.should.deep.equal({
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      it('{"query":{"filters[body__notLike]":"ab","filters[body__like]":"ab"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents')
          .query({
            'filters[body__notLike]': 'ab',
            'filters[body__like]': 'ab'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
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

  describe('/api/v1/contents/all (GET)', () => {
    it('{"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/contents/all').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/contents/all')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"query":{}} - success', async () => {
      const res = await chai.request(server)
        .get('/api/v1/contents/all')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(contentsListSchema)
      res.body.data.should.have.lengthOf(20)
    })

    describe('sort', () => {
      it('{"query":{"sort":"id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ sort: 'id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.data.should.have.nested.property('[0].id', 1)
      })

      it('{"query":{"sort":"-id"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ sort: '-id' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.data.should.have.nested.property('[0].id', 20)
      })

      it('{"query":{"sort":"body"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ sort: 'body' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.data.should.have.nested.property(
          '[0].body',
          'Ab eum hic occaecati nisi magnam. Iusto inventore vero ea laborum libero exercitationem nam. Repudiandae nobis quis aspernatur.\n' +
          'Corporis libero autem odio in hic nostrum. Inventore molestias dicta molestias esse. Officiis optio inventore vero tempore error quasi aperiam earum tenetur.\n' +
          'Quae temporibus totam et molestias quas incidunt. Harum incidunt quo veniam aliquam neque ab ab possimus expedita. Quaerat non quod tempore.'
        )
      })

      it('{"query":{"sort":"-body"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ sort: '-body' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(20)
        res.body.data.should.have.nested.property(
          '[0].body',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        )
      })
    })

    describe('includes', () => {
      it('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [article]' })
      })

      it('{"query":{"includes":["article"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'includes[]': 'article' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsWithArticleListSchema)
        res.body.data.should.have.lengthOf(20)
      })
    })

    describe('filters', () => {
      it('{"query":{"filters[id__foo]":15}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__foo]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[id__gt]":15}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__gt]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.greaterThan(15))
      })

      it('{"query":{"filters[id__gte]":15}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__gte]': 15 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.greaterThanOrEqual(15))
      })

      it('{"query":{"filters[id__lt]":6}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__lt]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.id.should.lessThan(6))
      })

      it('{"query":{"filters[id__lte]":6}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__lte]': 6 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.lessThanOrEqual(6))
      })

      it('{"query":{"filters[id__gte]":17,"filters[id__lte]":4}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[id__gte]': 17,
            'filters[id__lte]': 4
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[id__lte]":4,"filters[id__gte]":17}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[id__lte]': 4,
            'filters[id__gte]': 17
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[id__eq]":10}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__eq]': 10 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.id.should.be.equal(10))
      })

      it('{"query":{"filters[id__ne]":10}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__ne]': 10 })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(19)
        res.body.data.forEach(item => item.id.should.be.not.equal(10))
      })

      it('{"query":{"filters[id__between]":[8,13]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__between]': [8, 13] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(6)
        res.body.data.forEach(item => item.id.should.be.within(8, 13))
      })

      it('{"query":{"filters[id__notBetween]":[8,13]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__notBetween]': [8, 13] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(14)
        res.body.data.forEach(item => item.id.should.be.not.within(8, 13))
      })

      it('{"query":{"filters[id__in]":[2,10,18]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__in]': [2, 10, 18] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(3)
        res.body.data.forEach(item => [2, 10, 18].should.include(item.id))
      })

      it('{"query":{"filters[id__notIn]":[2,5,8]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[id__notIn]': [2, 10, 18] })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(17)
        res.body.data.forEach(item => [2, 10, 18].should.not.include(item.id))
      })

      it('{"query":{"filters[body__foo]":"..."}} - 400 error, invalid filter operator', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[body__foo]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({
          message: 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'
        })
      })

      it('{"query":{"filters[body__eq]":"..."}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[body__eq]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(1)
        res.body.data.forEach(item => item.body.should.be.equal(
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
        ))
      })

      it('{"query":{"filters[body__ne]":"..."}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[body__ne]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(19)
        res.body.data.forEach(item => item.body.should.be.not.equal(
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
        ))
      })

      it('{"query":{"filters[body__in]":["...","..."]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[body__in]': [
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
              'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
              'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
              'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
            ]
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(2)
        res.body.data.forEach(item => [
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        ].should.include(item.body))
      })

      it('{"query":{"filters[body__notIn]":["...","..."]}} - 400 error, invalid filter value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[body__notIn]': [
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
              'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
              'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
              'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
            ]
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(18)
        res.body.data.forEach(item => [
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        ].should.not.include(item.body))
      })

      it('{"query":{"filters[body__like]":"ab"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[body__like]': 'ab' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(15)
        res.body.data.forEach(item => item.body.should.have.string('ab'))
      })

      it('{"query":{"filters[body__notLike]":"ab"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({ 'filters[body__notLike]': 'ab' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(5)
        res.body.data.forEach(item => item.body.should.not.have.string('ab'))
      })

      it('{"query":{"filters[body__like]":"ab","filters[body__notLike]":"ab"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[body__like]': 'ab',
            'filters[body__notLike]': 'ab'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(0)
      })

      it('{"query":{"filters[body__notLike]":"ab","filters[body__like]":"ab"}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/all')
          .query({
            'filters[body__notLike]': 'ab',
            'filters[body__like]': 'ab'
          })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentsListSchema)
        res.body.data.should.have.lengthOf(0)
      })
    })
  })

  describe('/api/v1/contents/:id (GET)', () => {
    it('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).get('/api/v1/contents/1').query({})
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"query":{}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server)
        .get('/api/v1/contents/a')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"query":{}} - 404 error, entity not found', async () => {
      const res = await chai.request(server)
        .get('/api/v1/contents/100')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":1},"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await chai.request(server)
        .get('/api/v1/contents/1')
        .query({ foo: 'bar' })
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"foo" is not allowed' })
    })

    it('{"params":{"id":1},"query":{}} - success', async () => {
      const res = await chai.request(server)
        .get('/api/v1/contents/1')
        .query({})
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(contentSchema)
      res.body.data.should.have.property('id', 1)
    })

    describe('includes', () => {
      it('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/1')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization)
        res.should.have.status(400)
        res.body.should.deep.equal({ message: '"includes[0]" must be [article]' })
      })

      it('{"params":{"id":1},{"query":{"includes":["article"]}} - success', async () => {
        const res = await chai.request(server)
          .get('/api/v1/contents/1')
          .query({ 'includes[]': 'article' })
          .set('Authorization', authorization)
        res.should.have.status(200)
        res.body.data.should.be.jsonSchema(contentWithArticleSchema)
        res.body.data.should.have.property('id', 1)
      })
    })
  })

  describe('/api/v1/contents (POST)', () => {
    it('{"body":{"article_id":21,"body":"..."}} - 401 error, invalid token', async () => {
      const body = {
        article_id: 21,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server).post('/api/v1/contents').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"body":{"article_id":100,"body":"..."}} - 400 error, article model with id 100 must be exists', async () => {
      const body = {
        article_id: 100,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server)
        .post('/api/v1/contents')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'Article model with id 100 must be exists' })
    })

    it('{"body":{"article_id":1,"body":"..."}} - 400 error, article_id field must be unique', async () => {
      const body = {
        article_id: 1,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server)
        .post('/api/v1/contents')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'article_id field must be unique' })
    })

    it('{"body":{"article_id":21,"body":"..."}} - success', async () => {
      const article = await createArticle()
      const body = {
        article_id: article.id,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server)
        .post('/api/v1/contents')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(201)
      res.body.data.should.be.jsonSchema(contentSchema)
      res.body.data.should.deep.match({
        id: 21,
        article_id: article.id,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      })
    })
  })

  describe('/api/v1/contents/:id (PUT)', () => {
    it('{"params":{"id":21},"body":{"article_id":21,"body":"..."}} - 401 error, invalid token', async () => {
      const body = {
        article_id: 21,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server).put('/api/v1/contents/21').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"},"body":{"article_id":21,"body":"..."}} - 400 error, id param must be a number', async () => {
      const body = {
        article_id: 21,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server)
        .put('/api/v1/contents/a')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100},"body":{"article_id":21,"body":"..."}} - 404 error, entity not found', async () => {
      const body = {
        article_id: 21,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server)
        .put('/api/v1/contents/100')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":21},"body":{"article_id":100,"body":"..."}} - 400 error, article model with id 100 must be exists', async () => {
      const content = await createContent()
      const body = {
        article_id: 100,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server)
        .put(`/api/v1/contents/${content.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'Article model with id 100 must be exists' })
    })

    it('{"params":{"id":21},"body":{"article_id":1,"body":"..."}} - 400 error, article_id field must be unique', async () => {
      const content = await createContent()
      const body = {
        article_id: 1,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server)
        .put(`/api/v1/contents/${content.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'article_id field must be unique' })
    })

    it('{"params":{"id":21},"body":{"article_id":21,"body":"..."}} - success', async () => {
      const content = await createContent()
      const body = {
        article_id: content.get('article_id'),
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await chai.request(server)
        .put(`/api/v1/contents/${content.id}`)
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(contentSchema)
      res.body.data.should.deep.match({
        id: content.id,
        article_id: content.get('article_id'),
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      })
    })
  })

  describe('/api/v1/contents/:id (DELETE)', () => {
    it('{"params":{"id":21}} - 401 error, invalid token', async () => {
      const res = await chai.request(server).delete('/api/v1/contents/21')
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await chai.request(server).delete('/api/v1/contents/a').set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: '"id" must be a number' })
    })

    it('{"params":{"id":100}} - 404 error, entity not found', async () => {
      const res = await chai.request(server).delete('/api/v1/contents/100').set('Authorization', authorization)
      res.should.have.status(404)
      res.body.should.deep.equal({ message: 'Not Found' })
    })

    it('{"params":{"id":21}} - success', async () => {
      const content = await createContent()
      const res = await chai.request(server).delete(`/api/v1/contents/${content.id}`).set('Authorization', authorization)
      res.should.have.status(204)
      res.body.should.deep.equal({})
    })
  })
})
