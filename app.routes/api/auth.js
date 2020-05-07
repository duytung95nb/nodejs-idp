const authRouter = require('express').Router();
const clients = require('../../app.config/clients');
const UserModel = require('../../app.models/user.model');

authRouter.route('/auth')
    .get(function (req, res) {
        res.status(200)
            .send('Route is /api/auth');
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
                        {id: u._doc._id, username: u._doc.username });
                    res.status(201)
                        .json(createdUser);
                }).catch(error => {
                    res.status(500)
                        .send(`Created user with ${reqBody.username} failed`
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
    const validUsername = trimmedUsername.match(/^[a-zA-Z\-]+$/);
    if(validUsername == null) {
        res.status(400)
            .send(`Username ${trimmedUsername} is invalid`);
        return;
    }
    const trimmedPassword = reqBody.password.trim();
    const validPassword = trimmedPassword.match(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/);
    // should contain at least one lower case
    // should contain at least one upper case
    // should contain at least 8 from the mentioned characters
    if(validPassword == null) {
        res.status(400)
            .send(`Password ${trimmedPassword} is invalid`);
        return;
    }
    next();
}

module.exports = authRouter;