import Joi from 'joi'

const filters = {
  id: Joi.number(),
  name: Joi.string(),
  username: Joi.string(),
  email: Joi.string(),
  created_at: Joi.date(),
  updated_at: Joi.date()
}

const sorts = [
  'id',
  'name',
  'username',
  'email',
  'created_at',
  'updated_at'
]

const AdminsValidator = {
  index: {
    query: Joi.object({
      filters: Joi.object().keys(filters),
      page: Joi.number().integer().positive(),
      pageSize: Joi.number().integer().positive(),
      sort: Joi.string().valid(...sorts),
      includes: Joi.array().items(Joi.any().forbidden())
    })
  },
  all: {
    query: Joi.object({
      filters: Joi.object().keys(filters),
      sort: Joi.string().valid(...sorts),
      includes: Joi.array().items(Joi.any().forbidden())
    })
  },
  show: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    }),
    query: Joi.object({
      includes: Joi.array().items(Joi.any().forbidden())
    })
  },
  create: {
    body: Joi.object({
      name: Joi.string().max(100).required(),
      username: Joi.string().max(100).required(),
      password: Joi.string().min(6).max(50).required(),
      email: Joi.string().max(100).email().required()
    })
  },
  update: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    }),
    body: Joi.object({
      name: Joi.string().max(100).required(),
      username: Joi.string().max(100).required(),
      password: Joi.string().min(6).max(50),
      email: Joi.string().max(100).email().required()
    })
  },
  destroy: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    })
  }
}

export default AdminsValidator
