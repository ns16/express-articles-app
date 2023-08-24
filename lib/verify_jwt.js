import { to } from 'await-to-js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

import { Admin } from '../app/models/index.js'
import config from '../config.js'

export default route => (req, res, next) => {
  if (!route.auth) return next()
  jwt.verify(req.get('Authorization'), config.jwtKey, async (err, decoded) => {
    if (err || !decoded) return next(new createError.Unauthorized('Invalid token'))
    const [error, user] = await to(Admin.forge({ id: decoded.id, username: decoded.username }).fetch())
    if (error) return next(new createError.InternalServerError(error.message))
    if (!user) return next(new createError.Unauthorized('Invalid token'))
    req.user = user
    next()
  })
}
