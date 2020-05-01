const apiRouter = require('express').Router();
const authRoutes = require('./auth');

apiRouter.use('/', authRoutes)

module.exports = apiRouter;