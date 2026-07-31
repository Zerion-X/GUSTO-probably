const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    summary: { type: String, minlength: 5, maxlength: 40 },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    ingredients: [{ type: String }],
    imageURL: { type: String, default: 'https://via.placeholder.com/150' }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

function validateRecipe(recipe) {
    const schema = Joi.object({
        name: Joi.string().required(),
        summary: Joi.string().min(5).max(40),
        likes: Joi.number().default(0),
        saves: Joi.number().default(0),
        ingredients: Joi.array().items(Joi.string()),
        imageURL: Joi.string().uri().default('https://via.placeholder.com/150')
    });

    return schema.validate(recipe);
}

module.exports = Recipe;