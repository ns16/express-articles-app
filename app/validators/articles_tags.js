import Joi from 'joi'

const ArticlesTagsValidator = {
  create: {
    body: Joi.object({
      article_id: Joi.number().integer().positive().required(),
      tag_id: Joi.number().integer().positive().required()
    })
  },
  destroy: {
    body: Joi.object({
      article_id: Joi.number().integer().positive().required(),
      tag_id: Joi.number().integer().positive().required()
    })
  }
}

export default ArticlesTagsValidator
