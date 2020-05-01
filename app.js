const express = require('express');
const app = express();
const authPageRoutes = require('./routes/auth.page');
const profilePageRoutes = require('./routes/profile.page');
const apiRoutes = require('./routes/api/_api');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
// view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    keys: [keys.session.cookieKey]
}))
// initialize passport
app.use(passport.initialize());
app.use(passport.session());
// connect to mongodb
mongoose.connect(keys.mongoDb.dbUri, (err, db) => {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        console.log('Connected to mongodb');
    }
});
// setup routes
app.use('/auth', authPageRoutes);
app.use('/profile', profilePageRoutes);
app.use('/api', apiRoutes);
app.get('/', (req, res) => {
    res.render('home', {user: req.user});
});
const port = 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});