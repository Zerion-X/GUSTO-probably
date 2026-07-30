const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipeModel');

router.get('/', async (req, res) => {
  const recipes = await Recipe.find()
                      .sort('-likes')
                      .limit(10)
  res.send(recipes);
});

router.post('/', async (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    summary: req.body.summary,
    likes: req.body.likes,
    saves: req.body.saves
  });

  try {
    const savedRecipe = await recipe.save();
    res.status(201).send(savedRecipe);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;