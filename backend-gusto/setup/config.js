const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
    if (!config.get('csrfSecret')) {
        throw new Error('FATAL ERROR: csrfSecret is not defined.');
    }

    console.log(`Running in ${process.env.NODE_ENV} mode`);
};