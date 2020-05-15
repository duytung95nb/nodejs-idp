
module.exports = [
    {
        id: 'angular_practice',
        origin: 'http://localhost:4200', 
        grantType: ['authorization_code'],
        redirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'http://localhost:4200',
        allowedScope: 'profile'
    },
    {
        id: 'template_app',
        origin: 'http://localhost:8100', 
        grantType: [],
        redirectUri: null,
        postLogoutRedirectUri: null,
        allowedScope: null
    },
];