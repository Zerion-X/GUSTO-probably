const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional limit
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|png|gif|webp)$/.test(file.mimetype);
    cb(allowed ? null : new Error('Only image files are allowed'), allowed);
  }
});

function deleteUploadedFile(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, () => {});
}

router.get('/', async (req, res) => {
  const recipes = await Recipe.find()
    .sort('-likes')
    .limit(10);
  res.send(recipes);
});

router.post('/', upload.single('image'), async (req, res) => {
  const imageURL = req.file ? `/uploads/${req.file.filename}` : undefined;
  const uploadedFilePath = req.file ? path.join(uploadDir, req.file.filename) : null;

  const recipe = new Recipe({
    name: req.body.name,
    summary: req.body.summary,
    likes: Number(req.body.likes) || 0,
    saves: Number(req.body.saves) || 0,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    imageURL
  });

  try {
    const savedRecipe = await recipe.save();
    res.status(201).send(savedRecipe);
  } catch (error) {
    deleteUploadedFile(uploadedFilePath);
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
  const uploadedFilePath = req.file ? path.join(uploadDir, req.file.filename) : null;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    deleteUploadedFile(uploadedFilePath);
    return res.status(400).send({ error: 'Invalid recipe ID' });
  }

  const allowedFields = ['name', 'summary', 'likes', 'saves', 'ingredients', 'steps', 'imageURL'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (req.file) {
    updates.imageURL = `/uploads/${req.file.filename}`;
  }

  if (Object.keys(updates).length === 0) {
    deleteUploadedFile(uploadedFilePath);
    return res.status(400).send({ error: 'No valid fields to update' });
  }

  try {
    const oldRecipe = await Recipe.findById(req.params.id);
    if (!oldRecipe) {
      deleteUploadedFile(uploadedFilePath);
      return res.status(404).send({ error: 'Recipe not found' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    if (req.file && oldRecipe.imageURL && oldRecipe.imageURL.startsWith('/uploads/')) {
      const oldImagePath = path.join(uploadDir, path.basename(oldRecipe.imageURL));
      fs.unlink(oldImagePath, () => {});
    }

    res.send(updatedRecipe);
  } catch (error) {
    deleteUploadedFile(uploadedFilePath);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;