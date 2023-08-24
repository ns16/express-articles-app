export default async (error, req, res, next) => {
  if (error.statusCode === 500) console.error(error) // eslint-disable-line no-console
  res.status(error.statusCode).json(error)
  next()
}
