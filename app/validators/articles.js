import Joi from 'joi'

const filters = {
  id: Joi.number(),
  user_id: Joi.number(),
  title: Joi.string(),
  description: Joi.string(),
  status: Joi.string(),
  created_at: Joi.date(),
  updated_at: Joi.date()
}

const sorts = [
  'id',
  'user_id',
  'title',
  'description',
  'status',
  'created_at',
  'updated_at'
]

const includes = [
  'user',
  'content',
  'tags'
]

const ArticlesValidator = {
  index: {
    query: Joi.object({
      filters: Joi.object().keys(filters),
      page: Joi.number().integer().positive(),
      pageSize: Joi.number().integer().positive(),
      sort: Joi.string().valid(...sorts),
      includes: Joi.array().items(Joi.string().valid(...includes))
    })
  },
  all: {
    query: Joi.object({
      filters: Joi.object().keys(filters),
      sort: Joi.string().valid(...sorts),
      includes: Joi.array().items(Joi.string().valid(...includes))
    })
  },
  show: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    }),
    query: Joi.object({
      includes: Joi.array().items(Joi.string().valid(...includes))
    })
  },
  create: {
    body: Joi.object({
      user_id: Joi.number().integer().positive().required(),
      title: Joi.string().max(100).required(),
      description: Joi.string().max(500).required(),
      status: Joi.string().valid('published', 'draft').required()
    })
  },
  update: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    }),
    body: Joi.object({
      user_id: Joi.number().integer().positive().required(),
      title: Joi.string().max(100).required(),
      description: Joi.string().max(500).required(),
      status: Joi.string().valid('published', 'draft').required()
    })
  },
  destroy: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    })
  }
}

export default ArticlesValidator
