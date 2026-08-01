const config = require('config');
const { doubleCsrf } = require('csrf-csrf');

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => config.get('csrfSecret'),
    getSessionIdentifier: (req) => req.cookies['csrf_session_id'] || '',
    cookieName: 'csrf_token',
    cookieOptions: {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    }
});

module.exports = { generateCsrfToken, doubleCsrfProtection };