const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    summary: { type: String, minlength: 5, maxlength: 40 },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;