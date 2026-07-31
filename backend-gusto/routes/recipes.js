const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

router.get('/', async (req, res) => {
  const recipes = await Recipe.find()
                      .sort('-likes')
                      .limit(10)
                      .select('_id name summary likes saves');
  res.send(recipes);
});

router.post('/', async (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    summary: req.body.summary,
    likes: req.body.likes,
    saves: req.body.saves,
    ingredients: req.body.ingredients,
  });

  try {
    const savedRecipe = await recipe.save();
    res.status(201).send(savedRecipe);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete('/', async(req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.body.id);
  if (!recipe) {
    return res.status(404).send({ error: 'Recipe not found' });
  }
  res.send(recipe);
});

module.exports = router;