import Joi from 'joi'

const filters = {
  id: Joi.number(),
  name: Joi.string(),
  created_at: Joi.date(),
  updated_at: Joi.date()
}

const sorts = [
  'id',
  'name',
  'created_at',
  'updated_at'
]

const includes = [
  'articles'
]

const TagsValidator = {
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
      name: Joi.string().max(100).required()
    })
  },
  update: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    }),
    body: Joi.object({
      name: Joi.string().max(100).required()
    })
  },
  destroy: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    })
  }
}

export default TagsValidator
