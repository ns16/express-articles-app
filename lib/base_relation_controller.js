import { to } from 'await-to-js'
import createError from 'http-errors'

class BaseRelationController {
  constructor() {
    this.main = { model: null, modelName: null, field: null }
    this.relation = { modelName: null, field: null }
    this.relationship = null
  }

  async create(req, res, next) {
    const mainId = this.mainId(req)
    const relationId = this.relationId(req)
    const [error1, model] = await to(this.main.model.forge({ id: mainId }).fetch({ withRelated: this.relationship }))
    if (error1) return next(new createError.InternalServerError(error1.message))
    if (!model) return next(new createError.BadRequest(`${this.main.modelName} model with id ${mainId} must be exists`))
    const [error2, relatedModel] = await to(this.relation.model.forge({ id: relationId }).fetch())
    if (error2) return next(new createError.InternalServerError(error2.message))
    if (!relatedModel) return next(new createError.BadRequest(`${this.relation.modelName} model with id ${relationId} must be exists`))
    if (model.relations[this.relationship].get(relationId)) return res.status(201).json({ data: model.toJSON({ omitPivot: true }) })
    const [error3] = await to(model[this.relationship]().attach(relatedModel))
    if (error3) return next(new createError.InternalServerError(error3.message))
    const [error4, newModel] = await to(this.main.model.forge({ id: mainId }).fetch({ withRelated: this.relationship }))
    if (error4) return next(new createError.InternalServerError(error1.message))
    res.status(201).json({ data: newModel.toJSON({ omitPivot: true }) })
  }

  async destroy(req, res, next) {
    const mainId = this.mainId(req)
    const relationId = this.relationId(req)
    const [error1, model] = await to(this.main.model.forge({ id: mainId }).fetch({ withRelated: this.relationship }))
    if (error1) return next(new createError.InternalServerError(error1.message))
    if (!model) return next(new createError.BadRequest(`${this.main.modelName} model with id ${mainId} must be exists`))
    const [error2, relatedModel] = await to(this.relation.model.forge({ id: relationId }).fetch())
    if (error2) return next(new createError.InternalServerError(error2.message))
    if (!relatedModel) return next(new createError.BadRequest(`${this.relation.modelName} model with id ${relationId} must be exists`))
    if (!model.relations[this.relationship].get(relationId)) return res.json({ data: model.toJSON({ omitPivot: true }) })
    const [error3] = await to(model[this.relationship]().detach(relatedModel))
    if (error3) return next(new createError.InternalServerError(error3.message))
    const [error4, newModel] = await to(this.main.model.forge({ id: mainId }).fetch({ withRelated: this.relationship }))
    if (error4) return next(new createError.InternalServerError(error1.message))
    res.json({ data: newModel.toJSON({ omitPivot: true }) })
  }

  mainId(req) {
    return req.body[this.main.field]
  }

  relationId(req) {
    return req.body[this.relation.field]
  }
}

export default BaseRelationController
