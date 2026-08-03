const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // optional limit
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|png|gif|webp)$/.test(file.mimetype);
    cb(allowed ? null : new Error('Only image files are allowed'), allowed);
  }
});

function makeBase64DataUri(file) {
  if (!file || !file.buffer) return undefined;
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

router.get('/', async (req, res) => {
  const recipes = await Recipe.find()
    .sort('-likes')
    .limit(10);
  res.send(recipes);
});

router.post('/', upload.single('image'), async (req, res) => {
  const imageData = req.file ? makeBase64DataUri(req.file) : undefined;

  const recipe = new Recipe({
    name: req.body.name,
    summary: req.body.summary,
    likes: Number(req.body.likes) || 0,
    saves: Number(req.body.saves) || 0,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    imageData
  });

  try {
    const savedRecipe = await recipe.save();
    res.status(201).send(savedRecipe);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete('/:id', async(req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ error: 'Invalid recipe ID' });
  }
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe) {
    return res.status(404).send({ error: 'Recipe not found' });
  }
  res.send(recipe);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ error: 'Invalid recipe ID' });
  }

  const allowedFields = ['name', 'summary', 'likes', 'saves', 'ingredients', 'steps', 'imageData'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (req.file) {
    updates.imageData = makeBase64DataUri(req.file);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ error: 'No valid fields to update' });
  }

  try {
    const oldRecipe = await Recipe.findById(req.params.id);
    if (!oldRecipe) {
      return res.status(404).send({ error: 'Recipe not found' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    res.send(updatedRecipe);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;