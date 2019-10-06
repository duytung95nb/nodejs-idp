const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    clientID: String,
    redirectUri: String,
    grantType: Array,
    postLogoutRedirectUri: String,
    allowedScope: String
});
const Client = mongoose.Schema('client', clientSchema);
module.exports = Client;