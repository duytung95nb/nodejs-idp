const router = require('express').Router();
const passport = require('passport');
const clients = require('../config/clients');

router.get('/login', (req, res) => {
    var requestingClient = clients.find(client => client.clientID === req.query.client_id);
    if(requestingClient === undefined) {
        res.status(401).send('Unauthorized client');
    }

    res.render('login', {user: req.user, clientRedirectUri: requestingClient.redirectUri});
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
