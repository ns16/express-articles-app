import express from 'express'
import fileUpload from 'express-fileupload'

import routes from '../app/routes/index.js'

import handleAction from './handle_action.js'
import validateReq from './validate_req.js'
import verifyJwt from './verify_jwt.js'
import verifyRoles from './verify_roles.js'

const uploadFiles = route => (req, res, next) => (route.uploading ? fileUpload()(req, res, next) : next())

export default () => {
  const router = express.Router()

  routes.forEach(route => {
    router[route.method](route.path, verifyJwt(route), verifyRoles(route), uploadFiles(route), validateReq(route), handleAction(route))
  })

  return router
}
