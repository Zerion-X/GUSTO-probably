const express = require('express');
const cors = require("cors");
const home = require('../routes/home');
const recipes = require('../routes/recipes');

module.exports = function(app) {
    app.use(express.json());
    app.use(cors({ origin: "http://localhost:4200" }));
    app.use('/api/recipes', recipes);
    app.use('/', home);
}