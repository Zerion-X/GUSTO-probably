const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const { Profile } = require('../models/profile');
const { Recipe } = require('../models/recipe');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');

    const profile = await Profile.findById(req.params.id)
        .populate('favorites', 'name summary imageData likes saves');

    if (!profile) return res.status(404).send('Profile not found.');

    res.send(profile.favorites);
});

router.patch('/', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.recipeId))
        return res.status(400).send('Invalid recipe id.');

    const recipe = await Recipe.findById(req.body.recipeId);
    if (!recipe) return res.status(400).send('Invalid recipe.');

    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).send('Profile not found.');

    const alreadyFavorited = profile.favorites.some(
        (id) => id.toString() === recipe._id.toString()
    );
    if (alreadyFavorited) return res.send(profile);

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            profile.favorites.push(recipe._id);
            await profile.save({ session });

            if (!recipe.likedBy?.some((id) => id.toString() === profile._id.toString())) {
                recipe.likedBy.push(profile._id);
            }

            recipe.likes++;
            await recipe.save({ session });
        });

        res.send(profile);
    }
    catch (ex) {
        res.status(500).send(`Something failed: ${ex.message}`);
    }
    finally {
        session.endSession();
    }
});

router.delete('/', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.recipeId))
        return res.status(400).send('Invalid recipe id.');

    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).send('Profile not found.');

    const wasFavorited = profile.favorites.some(
        (id) => id.toString() === req.body.recipeId
    );
    if (!wasFavorited) return res.send(profile);

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await Profile.updateOne(
                { _id: profile._id },
                { $pull: { favorites: req.body.recipeId } },
                { session }
            );

            await Recipe.updateOne(
                { _id: req.body.recipeId },
                { $pull: { likedBy: profile._id } },
                { session }
            );

            await Recipe.updateOne(
                { _id: req.body.recipeId },
                { $inc: { likes: -1 } },
                { session }
            );
        });

        const updated = await Profile.findById(req.params.id);
        res.send(updated);
    }
    catch (ex) {
        res.status(500).send(`something failed: ${ex.message}`);
    }
    finally {
        session.endSession();
    }
});

module.exports = router;