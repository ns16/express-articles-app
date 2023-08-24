import Joi from 'joi'
import createError from 'http-errors'
import { cloneDeep } from 'lodash-es'

const operators = ['gt', 'gte', 'lt', 'lte', 'ne', 'eq', 'between', 'notBetween', 'in', 'notIn', 'like', 'notLike']

export default route => async (req, res, next) => {
  if (!route.validator || !route.validator[route.action]) return next()

  const schema = cloneDeep(route.validator[route.action])

  for (const type in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, type)) {
      if (!['headers', 'params', 'query', 'body', 'files'].includes(type)) continue

      const oldData = cloneDeep(req[type])
      const data = req[type]

      if (type === 'query') {
        if (data.sort !== undefined) {
          const { error } = Joi.object({ sort: Joi.string() }).unknown().validate(data)
          if (error) {
            return next(createError(400, error.message))
          }

          data.sort = data.sort.replace('-', '')
        }

        if (data.filters !== undefined) {
          const { error } = Joi.object({ filters: Joi.object() }).unknown().validate(data)
          if (error) {
            return next(createError(400, error.message))
          }

          const newFilters = {}
          const filtersSchema = schema[type].$_terms.keys.find(item => item.key === 'filters').schema

          for (const filter in data.filters) {
            if (Object.prototype.hasOwnProperty.call(data.filters, filter)) {
              const [field, operator = 'eq'] = filter.split('__')
              const { error } = Joi.string().valid(...operators).validate(operator)
              if (error) {
                return next(createError(400, 'Operator must be gt, gte, lt, lte, ne, eq, between, notBetween, in, notIn, like or notLike'))
              }
              let fieldSchema = filtersSchema.$_terms.keys.find(item => item.key === field)?.schema
              if (fieldSchema) {
                if (['gt', 'gte', 'lt', 'lte'].includes(operator) && ['boolean', 'string'].includes(fieldSchema.type)) {
                  return next(createError(400, 'Operators gt, gte, lt and lte cannot be applied to boolean or string fields'))
                } else if (['between', 'notBetween'].includes(operator)) {
                  if (['boolean', 'string'].includes(fieldSchema.type)) {
                    return next(createError(400, 'Operators between and notBetween cannot be applied to boolean or string fields'))
                  }
                  fieldSchema = Joi.array().items(fieldSchema).length(2)
                } else if (['in', 'notIn'].includes(operator)) {
                  if (fieldSchema.type === 'boolean') {
                    return next(createError(400, 'Operators in and notIn cannot be applied to boolean fields'))
                  }
                  fieldSchema = Joi.array().items(fieldSchema)
                } else if (['like', 'notLike'].includes(operator) && ['boolean', 'date', 'number'].includes(fieldSchema.type)) {
                  return next(createError(400, 'Operators like and notLike cannot be applied to boolean, date or number fields'))
                }
                filtersSchema.$_terms.keys.find(item => item.key === field).schema = fieldSchema
              }
              newFilters[field] = data.filters[filter]
            }
          }

          schema[type].$_terms.keys.find(item => item.key === 'filters').schema = filtersSchema
          data.filters = newFilters
        }
      }

      const { error } = schema[type].validate(data)

      req[type] = oldData

      if (error) {
        return next(createError(400, error.message))
      }
    }
  }

  await next()
}
