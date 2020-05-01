const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(req.user) {
        next();
    }
    else {
        res.redirect('/auth/login');
    }
};
router.get('/', authCheck, (req, res) => {
    res.render('profile', {
        user: req.user
    });
});
module.exports = router;