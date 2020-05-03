const environmentConfig = require('../config/environment');

module.exports = {
    google: {
        clientID: environmentConfig.GOOGLE_CLIENT_ID,
        clientSecret: environmentConfig.GOOGLE_CLIENT_SECRET,
    },
    mongoDb: {
        dbUri: environmentConfig.MONGO_DB_URL
    },
    session: {
        cookieKey: 'johntungdao'
    },
    auth: {
        tokenPrivateKey: environmentConfig.TOKEN_PRIVATE_KEY
    }
}