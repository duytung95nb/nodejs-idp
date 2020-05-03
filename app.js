const express = require('express');
const app = express();
const authPageRoutes = require('./app.routes/mvc/auth.page');
const profilePageRoutes = require('./app.routes/mvc/profile.page');
const apiRoutes = require('./app.routes/api/_api');
const passportSetup = require('./app.config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./app.config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');

// view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    keys: [keys.session.cookieKey]
}))
// initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
// connect to mongodb
mongoose.connect(keys.mongoDb.dbUri, (err, db) => {
    if (err) {
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
    res.render('home', { user: req.user });
});
const port = 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});