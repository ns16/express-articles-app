import createError from 'http-errors'

export default route => (req, res, next) => {
  if (route.roles && (!req.user || !route.roles.includes(req.user.get('role')))) return next(new createError.Forbidden())
  next()
}
