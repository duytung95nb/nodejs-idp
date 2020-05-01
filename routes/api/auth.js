const authRouter = require('express').Router();

authRouter.route('/auth')
    .get(function (req, res) {
        res.status(200)
            .send('Route is /api/auth'); 
    });

module.exports = authRouter;