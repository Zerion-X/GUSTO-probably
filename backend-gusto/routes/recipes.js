const express = require('express');
const router = express.Router();
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

router.get('/', async (req, res) => {
  const recipes = await Recipe.find()
    .sort('-likes')
    .limit(10)
    .select('_id name summary likes saves imageURL');
  res.send(recipes);
});

router.post('/', upload.single('image'), async (req, res) => {
  const imageURL = req.file ? `/uploads/${req.file.filename}` : undefined;

  const recipe = new Recipe({
    name: req.body.name,
    summary: req.body.summary,
    likes: Number(req.body.likes) || 0,
    saves: Number(req.body.saves) || 0,
    ingredients: req.body.ingredients,
    imageURL
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