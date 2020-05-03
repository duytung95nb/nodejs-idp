const apiRouter = require('express').Router();
const authRoutes = require('./auth');
const bodyParser = require('body-parser');

apiRouter.use(bodyParser.json({ type: 'application/*+json' }))
apiRouter.use('/', authRoutes)

module.exports = apiRouter;