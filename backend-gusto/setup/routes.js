const express = require('express');
const cors = require("cors");
const home = require('../routes/home');
const recipes = require('../routes/recipes');
const users = require('../routes/users');
const auth = require('../routes/auth');
const profiles = require('../routes/profiles');
const favorites = require('../routes/favorites');
const saved = require('../routes/saved');
const posts = require('../routes/posts')

module.exports = function(app) {
    app.use(express.json());
    app.use(cors({ origin: "http://localhost:4200" }));
    app.use('/api/recipes', recipes);
    app.use('/', home);
    app.use('/api/users',users);
    app.use('/api/auth',auth);
    app.use('/api/profiles',profiles);
    app.use('/api/profiles/:id/favorites',favorites);
    app.use('/api/profiles/:id/posts',posts);
    app.use('/api/profiles/:id/saved',saved);
}