const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { generateCsrfToken } = require('../middleware/csrf');

router.get('/', (req, res) => {
    if (!req.cookies['csrf_session_id']) {
        const sessionId = crypto.randomBytes(32).toString('hex');
        res.cookie('csrf_session_id', sessionId, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });
        req.cookies['csrf_session_id'] = sessionId;
    }
    const token = generateCsrfToken(req, res);
    res.send({ csrfToken: token });
});

module.exports = router;