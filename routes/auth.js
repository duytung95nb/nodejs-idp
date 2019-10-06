const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login', {user: req.user});
});

router.get('/logout', (req, res) => {
    // passport will handle this
    req.logOut();
    res.redirect('/');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: 'auth/google' }),
    (req, res) => {
    res.redirect('/auth/success');
});

router.get('/success', (req, res) => {
    res.render('authSuccess', {message: 'AuthSuccess'});
})
module.exports = router;
