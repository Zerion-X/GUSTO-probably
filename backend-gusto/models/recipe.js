const mongoose = require('mongoose');
const Joi = require('joi');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    summary: { type: String, minlength: 5, maxlength: 250 },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    imageData: { type: String }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

function validateRecipe(recipe) {
    const schema = Joi.object({
        name: Joi.string().required(),
        summary: Joi.string().min(5).max(250),
        likes: Joi.number().default(0),
        saves: Joi.number().default(0),
        ingredients: Joi.array().items(Joi.string()),
        steps: Joi.array().items(Joi.string()).minlength(1),
        imageData: Joi.string()
    });

    return schema.validate(recipe);
}

module.exports = Recipe;