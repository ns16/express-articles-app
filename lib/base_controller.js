import { to } from 'await-to-js'
import createError from 'http-errors'

class BaseController {
  constructor() {
    this.model = null
    this.mustBeExists = []
    this.mustBeUnique = []
  }

  static operatorsMap = {
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    ne: '!=',
    eq: '=',
    between: 'between',
    notBetween: 'not between',
    in: 'in',
    notIn: 'not in',
    like: 'like',
    notLike: 'not like'
  }

  async index(req, res, next) {
    const { filters = {}, page = 1, pageSize = 10, sort = 'id', includes = [] } = req.query
    const [error, { models, pagination } = {}] = await to(
      this.model
        .query(this.constructor.preFilter(req))
        .query(this.constructor.filter(filters))
        .query(this.constructor.sort(sort))
        .fetchPage({ page, pageSize, withRelated: includes })
    )
    if (error) return next(new createError.InternalServerError(error.message))
    res.json({ data: models.map(model => model.toJSON({ omitPivot: true })), pagination })
  }

  async all(req, res, next) {
    const { filters = {}, sort = 'id', includes = [] } = req.query
    const [error, models] = await to(
      this.model
        .query(this.constructor.preFilter(req))
        .query(this.constructor.filter(filters))
        .query(this.constructor.sort(sort))
        .fetchAll({ withRelated: includes })
    )
    if (error) return next(new createError.InternalServerError(error.message))
    res.json({ data: models.map(model => model.toJSON({ omitPivot: true })) })
  }

  async show(req, res, next) {
    const id = this.constructor.id(req)
    const { includes = [] } = req.query
    const [error, model] = await to(this.model.forge({ id }).query(this.constructor.preFilter(req)).fetch({ withRelated: includes }))
    if (error) return next(new createError.InternalServerError(error.message))
    if (!model) return next(new createError.NotFound())
    res.json({ data: model.toJSON({ omitPivot: true }) })
  }

  async create(req, res, next) {
    const body = this.constructor.body(req)
    for (const other of this.mustBeExists) {
      if (body[other.field] == null) continue
      const [error, otherModel] = await to(other.model.forge({ id: body[other.field] }).fetch())
      if (error) return next(new createError.InternalServerError(error.message))
      if (!otherModel) return next(new createError.BadRequest(`${other.modelName} model with id ${body[other.field]} must be exists`))
    }
    for (const field of this.mustBeUnique) {
      const fields = !Array.isArray(field) ? [field] : field
      if (fields.every(field => body[field] == null)) continue
      const [error, otherModel] = await to(this.model.forge(fields.reduce((res, field) => ({ ...res, [field]: body[field] }), {})).fetch())
      if (error) return next(new createError.InternalServerError(error.message))
      if (otherModel) {
        return next(new createError.BadRequest(`${
          fields.length > 1 ? [fields.slice(0, -1).join(', '), fields[fields.length - 1]].join(' and ') : fields[0]
        } field${
          fields.length > 1 ? 's' : ''
        } must be unique`))
      }
    }
    const [error, model] = await to(this.model.forge().save(body))
    if (error) return next(new createError.InternalServerError(error.message))
    res.status(201).json({ data: model })
  }

  async update(req, res, next) {
    const id = this.constructor.id(req)
    const [error1, model] = await to(this.model.forge({ id }).query(this.constructor.preFilter(req)).fetch())
    if (error1) return next(new createError.InternalServerError(error1.message))
    if (!model) return next(new createError.NotFound())
    const body = this.constructor.body(req)
    for (const other of this.mustBeExists) {
      if (model.get(other.field) === body[other.field] || body[other.field] == null) continue
      const [error, otherModel] = await to(other.model.forge({ id: body[other.field] }).fetch())
      if (error) return next(new createError.InternalServerError(error.message))
      if (!otherModel) return next(new createError.BadRequest(`${other.modelName} model with id ${body[other.field]} must be exists`))
    }
    for (const field of this.mustBeUnique) {
      const fields = !Array.isArray(field) ? [field] : field
      if (fields.every(field => model.get(field) === body[field] || body[field] == null)) continue
      const [error, otherModel] = await to(this.model.forge(fields.reduce((res, field) => ({ ...res, [field]: body[field] }), {})).fetch())
      if (error) return next(new createError.InternalServerError(error.message))
      if (otherModel) {
        if (otherModel.get('id') === model.get('id')) continue
        return next(new createError.BadRequest(`${
          fields.length > 1 ? [fields.slice(0, -1).join(', '), fields[fields.length - 1]].join(' and ') : fields[0]
        } field${
          fields.length > 1 ? 's' : ''
        } must be unique`))
      }
    }
    const [error2] = await to(model.save(body))
    if (error2) return next(new createError.InternalServerError(error2.message))
    res.json({ data: model })
  }

  async destroy(req, res, next) {
    const id = this.constructor.id(req)
    const [error1, model] = await to(this.model.forge({ id }).query(this.constructor.preFilter(req)).fetch())
    if (error1) return next(new createError.InternalServerError(error1.message))
    if (!model) return next(new createError.NotFound())
    const [error2] = await to(model.destroy())
    if (error2) return next(new createError.InternalServerError(error2.message))
    res.status(204).json()
  }

  static filter(filters) {
    return qb => {
      for (const [key, value] of Object.entries(filters)) {
        const [field, operator = 'eq'] = key.split('__')
        if (['between', 'notBetween'].includes(operator)) {
          qb.whereRaw(`${field} ${BaseController.operatorsMap[operator]} ? and ?`, [value[0], value[1]])
        } else if (['in', 'notIn'].includes(operator)) {
          qb.whereRaw(`${field} ${BaseController.operatorsMap[operator]}(?)`, [value])
        } else if (['eq', 'ne'].includes(operator) && ['true', 'false'].includes(value)) {
          qb.whereRaw(`${field} ${operator === 'eq' ? 'is' : 'is not'} ${value}`)
        } else {
          qb.whereRaw(`${field} ${BaseController.operatorsMap[operator]} ?`, ['like', 'notLike'].includes(operator) ? [`%${value}%`] : [value])
        }
      }
      return qb
    }
  }

  static sort(sort) {
    const field = sort.replace('-', '')
    const direction = sort.startsWith('-') ? 'desc' : 'asc'
    return qb => qb.orderBy(field, direction)
  }

  static id(req) {
    return req.params.id
  }

  static preFilter() {
    return {}
  }

  static body(req) {
    return req.body
  }
}

export default BaseController
