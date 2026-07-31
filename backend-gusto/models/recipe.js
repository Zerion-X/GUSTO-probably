const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    summary: { type: String, minlength: 5, maxlength: 40 },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    ingredients: [{ type: String }]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

function validateRecipe(recipe) {
    const schema = Joi.object({
        name: Joi.string().required(),
        summary: Joi.string().min(5).max(40),
        likes: Joi.number().default(0),
        saves: Joi.number().default(0),
        ingredients: Joi.array().items(Joi.string())
    });

    return schema.validate(recipe);
}

module.exports = Recipe;