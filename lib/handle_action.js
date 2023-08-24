export default route => async (req, res, next) => await (new route.controller())[route.action](req, res, next)
