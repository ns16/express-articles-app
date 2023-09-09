import chai from 'chai'

import server from '../index.js'

import { getAuthorization, attachTagToArticle } from './_tools/helpers.js'
import { articleWithTagsSchema } from './_tools/schemas.js'

let authorization = null

describe('ArticlesTagsController (e2e)', () => {
  before(async () => {
    authorization = await getAuthorization()
  })

  describe('/api/v1/articles-tags (POST)', () => {
    it('{"body":{"article_id":1,"tag_id":1}} - 401 error, invalid token', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await chai.request(server).post('/api/v1/articles-tags').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"body":{"article_id":100,"tag_id":1}} - 400 error, article model with id 100 must be exists', async () => {
      const body = {
        article_id: 100,
        tag_id: 1
      }
      const res = await chai.request(server)
        .post('/api/v1/articles-tags')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'Article model with id 100 must be exists' })
    })

    it('{"body":{"article_id":1,"tag_id":100}} - 400 error, tag model with id 100 must be exists', async () => {
      const body = {
        article_id: 1,
        tag_id: 100
      }
      const res = await chai.request(server)
        .post('/api/v1/articles-tags')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'Tag model with id 100 must be exists' })
    })

    it('{"body":{"article_id":1,"tag_id":1}} - success', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await chai.request(server)
        .post('/api/v1/articles-tags')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(201)
      res.body.data.should.be.jsonSchema(articleWithTagsSchema)
      res.body.data.id.should.be.equal(body.article_id)
      res.body.data.tags.some(tag => tag.id === body.tag_id).should.be.equal(true)
      res.body.data.tags.filter(tag => tag.id === body.tag_id).should.have.lengthOf(1)
    })

    it('{"body":{"article_id":1,"tag_id":1}} - success, tags relation already exists', async () => {
      await attachTagToArticle()
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await chai.request(server)
        .post('/api/v1/articles-tags')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(201)
      res.body.data.should.be.jsonSchema(articleWithTagsSchema)
      res.body.data.id.should.be.equal(body.article_id)
      res.body.data.tags.some(tag => tag.id === body.tag_id).should.be.equal(true)
      res.body.data.tags.filter(tag => tag.id === body.tag_id).should.have.lengthOf(1)
    })
  })

  describe('/api/v1/articles-tags (DELETE)', () => {
    it('{"body":{"article_id":1,"tag_id":1}} - 401 error, invalid token', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await chai.request(server).delete('/api/v1/articles-tags').send(body)
      res.should.have.status(401)
      res.body.should.deep.equal({ message: 'Invalid token' })
    })

    it('{"body":{"article_id":100,"tag_id":1}} - 400 error, article model with id 100 must be exists', async () => {
      const body = {
        article_id: 100,
        tag_id: 1
      }
      const res = await chai.request(server)
        .delete('/api/v1/articles-tags')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'Article model with id 100 must be exists' })
    })

    it('{"body":{"article_id":1,"tag_id":100}} - 400 error, tag model with id 100 must be exists', async () => {
      const body = {
        article_id: 1,
        tag_id: 100
      }
      const res = await chai.request(server)
        .delete('/api/v1/articles-tags')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(400)
      res.body.should.deep.equal({ message: 'Tag model with id 100 must be exists' })
    })

    it('{"body":{"article_id":1,"tag_id":1}} - success', async () => {
      await attachTagToArticle()
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await chai.request(server)
        .delete('/api/v1/articles-tags')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(articleWithTagsSchema)
      res.body.data.id.should.be.equal(body.article_id)
      res.body.data.tags.some(tag => tag.id === body.tag_id).should.be.not.equal(true)
    })

    it('{"body":{"article_id":1,"tag_id":1}} - success, tags relation does not exist', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await chai.request(server)
        .delete('/api/v1/articles-tags')
        .send(body)
        .set('Authorization', authorization)
      res.should.have.status(200)
      res.body.data.should.be.jsonSchema(articleWithTagsSchema)
      res.body.data.id.should.be.equal(body.article_id)
      res.body.data.tags.some(tag => tag.id === body.tag_id).should.be.not.equal(true)
    })
  })
})
