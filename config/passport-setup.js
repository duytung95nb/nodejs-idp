const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user.model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        });
});

passport.use(
    new GoogleStrategy({
        // option for google strat
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,

    }, (accessToken, refreshToken, profile, done) => {
        // passport callback func
        console.log('passport callback function fired');
        User.findOne({googleId: profile.id})
            .then((currentUser) => {
                if(currentUser) {
                    // aready have user
                    console.log('user is:', currentUser);
                    done(null, currentUser)
                }
                else {
                    // if not, create new user
                    new User({
                        username: profile.displayName,
                        googleId: profile.id
                    }).save()
                    .then((newUser) => {
                        console.log('new created user: ', newUser);
                        done(null, currentUser)
                    });
                }
            });
    })
);