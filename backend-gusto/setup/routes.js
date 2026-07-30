const express = require('express');
const cors = require("cors");
const home = require('../routes/home');
const recipes = require('../routes/recipes');
const users = require('../routes/users');
const auth = require('../routes/auth');
const profiles = require('../routes/profiles');

module.exports = function(app) {
    app.use(express.json());
    app.use(cors({ origin: "http://localhost:4200" }));
    app.use('/api/recipes', recipes);
    app.use('/', home);
    app.use('/api/users',users);
    app.use('/api/auth',auth);
    app.use('/api/profiles',profiles);
}