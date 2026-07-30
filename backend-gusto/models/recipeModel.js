const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {type: String, required: true},

    summary: {type: String, min: 5, max: 40},

    likes: {type: Number},

    saves: {type: Number}
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;