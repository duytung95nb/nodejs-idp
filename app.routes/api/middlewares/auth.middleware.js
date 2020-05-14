const jwt = require('jsonwebtoken');
const keys = require('../../../app.config/keys');

module.exports = function validateToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({
      error: 'No credentials sent!'
    });
  }
  if (!req.headers.authorization.startsWith("Bearer ")) {
    return res.status(403).json({
      error: 'Authentication method does not supported!'
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, keys.auth.tokenPrivateKey, function (err, decodedUserData) {
    if (err) {
      return res.status(401).send('Unauthorized, token is invalid');
    }
    req.customizedRequestProp = {
      decodedUserData
    };
    next();
  });
}