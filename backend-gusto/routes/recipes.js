const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Recipe,validate} = require('../models/recipe');
const { Profile } = require('../models/profile');
const auth = require('../middleware/auth');
const multer = require('multer');
const _ = require('lodash');

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

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ error: 'Invalid recipe ID' });
  }

  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).send({ error: 'Recipe not found' });
  }

  res.send(recipe);
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  const imageData = req.file
    ? makeBase64DataUri(req.file)
    : typeof req.body.imageData === 'string'
    ? req.body.imageData
    : undefined;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = new Recipe({
    name: req.body.name,
    summary: req.body.summary,
    likes: Number(req.body.likes) || 0,
    saves: Number(req.body.saves) || 0,
    author: req.user?._id,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    imageData,
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

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).send({ error: 'Recipe not found' });
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      if (recipe.likedBy?.length) {
        await Profile.updateMany(
          { _id: { $in: recipe.likedBy } },
          { $pull: { favorites: recipe._id } },
          { session }
        );
      }

      if (recipe.savedBy?.length) {
        await Profile.updateMany(
          { _id: { $in: recipe.savedBy } },
          { $pull: { saved: recipe._id } },
          { session }
        );
      }

      await Recipe.deleteOne({ _id: recipe._id }, { session });
    });

    res.send(recipe);
  } catch (error) {
    res.status(500).send({ error: error.message });
  } finally {
    session.endSession();
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ error: 'Invalid recipe ID' });
  }
  const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
  const allowedFields = ['name', 'summary', 'likes', 'saves', 'ingredients', 'steps', 'imageData'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (req.file) {
    updates.imageData = makeBase64DataUri(req.file);
  } else if (typeof req.body.imageData === 'string') {
    updates.imageData = req.body.imageData;
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