import { to } from 'await-to-js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

import config from '../config.js'

class BaseAuthController {
  constructor() {
    this.model = null
    this.mustBeExists = []
    this.mustBeUnique = []
  }

  async register(req, res, next) {
    for (const other of this.mustBeExists) {
      if (req.body[other.field] == null) continue
      const [error, otherModel] = await to(other.model.forge({ id: req.body[other.field] }).fetch())
      if (error) return next(new createError.InternalServerError(error.message))
      if (!otherModel) return next(new createError.BadRequest(`${other.modelName} model with id ${req.body[other.field]} must be exists`))
    }
    for (const field of this.mustBeUnique) {
      const fields = !Array.isArray(field) ? [field] : field
      if (fields.every(field => req.body[field] == null)) continue
      const [error, otherModel] = await to(this.model.forge(fields.reduce((res, field) => ({ ...res, [field]: req.body[field] }), {})).fetch())
      if (error) return next(new createError.InternalServerError(error.message))
      if (otherModel) {
        return next(new createError.BadRequest(`${
          fields.length > 1 ? [fields.slice(0, -1).join(', '), fields[fields.length - 1]].join(' and ') : fields[0]
        } field${
          fields.length > 1 ? 's' : ''
        } must be unique`))
      }
    }
    const [error1, model] = await to(this.model.forge().save(req.body))
    if (error1) return next(new createError.InternalServerError(error1.message))
    const token = jwt.sign(model.toJSON(), config.jwtKey)
    res.status(201).set('Token', token).json({ data: model })
  }

  async login(req, res, next) {
    const { username, password } = req.body
    const [error1, model] = await to(this.model.forge({ username }).fetch())
    if (error1) return next(new createError.InternalServerError(error1.message))
    if (!model) return next(new createError.Unauthorized('Invalid username or password'))
    const [error2, isValid] = await to(model.compare(password))
    if (error2) return next(new createError.InternalServerError(error2.message))
    if (!isValid) return next(new createError.Unauthorized('Invalid username or password'))
    const token = jwt.sign(model.toJSON(), config.jwtKey)
    res.set('Token', token).json({ data: model })
  }

  async me(req, res) { // eslint-disable-line class-methods-use-this
    res.json({ data: req.user })
  }
}

export default BaseAuthController
