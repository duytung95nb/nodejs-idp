const authRouter = require('express').Router();
const clients = require('../../app.config/clients');
const UserModel = require('../../app.models/user.model');
const jwt = require('jsonwebtoken');
const keys = require('../../app.config/keys');
const validateTokenMiddleware = require('./middlewares/auth.middleware');

authRouter.route('/auth')
    .get(validateTokenMiddleware,
        function (req, res) {
        UserModel.findOne({ id: req.decodedUserData.id },
            (err, userFromDatabase) => {
                if(err) {
                    return res.status(404)
                        .send('User does not exist');
                }
                return res.status(200).json(userFromDatabase);
            });
    });

authRouter.route('/login').post((req, res) => {
    var origin = req.get('origin');
    const requestingClient = clients.find(client => client.id === req.query.client_id);
    if (requestingClient.origin !== origin) {
        res.status(401)
            .send('Client app origin is unauthorized');
        return;
    }
    res.status(200)
        .send(`Welcome ${req.body.username}`);
});

authRouter.route('/register').post(
    validateCreatingUserModel,
    (req, res) => {
        const reqBody = req.body;
        UserModel.findOne({ username: reqBody.username },
            (err, userFromDatabase) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                if (!userFromDatabase) {
                    // Validate user model & create user
                    UserModel.create({
                        username: reqBody.username,
                        password: reqBody.password,
                    }).then(u => {
                        let createdUser = Object.assign({},
                            { id: u._doc._id.toString(), username: u._doc.username });
                            
                        const token = jwt.sign({
                            sub: createdUser.id,
                            img: createdUser.thumbnailUrl,
                            fullName: createdUser.username
                        }, keys.auth.tokenPrivateKey, { expiresIn: 3600 });
                        res.status(201)
                            .json({accessToken: token});
                    }).catch(error => {
                        res.status(500)
                            .send(`Created user with ${reqBody.username} or returned access token failed!`
                                + error.toString());
                    });
                    return;
                }
                res.status(409)
                    .send(`User with ${reqBody.username} already existed`);
            });
    });

function validateCreatingUserModel(req, res, next) {
    const reqBody = req.body;
    const trimmedUsername = reqBody.username.trim();
    const validUsername = trimmedUsername.match(/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/);
    if (validUsername == null) {
        res.status(400)
            .send(`Username ${trimmedUsername} is invalid`);
        return;
    }
    const trimmedPassword = reqBody.password.trim();
    const validPassword = trimmedPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
    // should contain at least one lower case
    // should contain at least one upper case
    // should contain at least 8 from the mentioned characters
    // No symbol
    if (validPassword == null) {
        res.status(400)
            .send(`Password ${trimmedPassword} is invalid`);
        return;
    }

    if (trimmedUsername.length < 8
        || trimmedPassword.length < 8) {
        res.status(400)
            .send(`Username and password should be more than 8 characters`);
    }
    next();
}

module.exports = authRouter;