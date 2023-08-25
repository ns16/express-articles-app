import Joi from 'joi'

const AuthValidator = {
  register: {
    body: Joi.object({
      name: Joi.string().max(100).required(),
      username: Joi.string().max(100).required(),
      password: Joi.string().min(6).max(50).required(),
      email: Joi.string().max(100).email().required()
    })
  },
  login: {
    body: Joi.object({
      username: Joi.string().max(100).required(),
      password: Joi.string().min(6).max(50).required()
    })
  },
  me: {}
}

export default AuthValidator
