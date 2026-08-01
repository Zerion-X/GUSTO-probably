const config = require('config');
const jwt = require('jsonwebtoken');

const revokedTokens = new Set();

function auth(req, res, next) {
    const token = req.cookies['auth_token'];
    if (!token) return res.status(401).send('Access Denied, Token not provided...');

    try {
        if (revokedTokens.has(token)) {
            return res.status(401).send('Access Denied, Token revoked.');
        }

        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send(`Invalid token: ${ex.message}`);
    }
}

function revokeToken(token) {
    if (token) {
        revokedTokens.add(token);
    }
}

auth.revokeToken = revokeToken;
module.exports = auth;