const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies['auth_token'];
    if (!token) return res.status(401).send('Access Denied, Token not provided...');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send(`Invalid token: ${ex.message}`);
    }
}

module.exports = auth;