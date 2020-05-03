const router = require('express').Router();
const passport = require('passport');
const clients = require('../../app.config/clients');
const jwt = require('jsonwebtoken');
const keys = require('../../app.config/keys');

router.get('/login', (req, res) => {
    var requestingClient = clients.find(client => client.id === req.query.client_id);
    if (requestingClient === undefined) {
        res.status(401).send('Unauthorized client');
    }
    if (req.user) {
        const token = jwt.sign({
            sub: req.user.id,
            img: req.user.thumbnailUrl,
            fullName: req.user.username
        }, keys.auth.tokenPrivateKey, { expiresIn: 3600 });
        
        res.render('login', {user: req.user,
            accessToken: token,
            clientRedirectUri: requestingClient.redirectUri
        });

    } else {
        res.render('login', {user: req.user, accessToken: '', clientRedirectUri: ''});
    }
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
    res.render('authSuccess', { message: 'AuthSuccess' });
})
module.exports = router;
