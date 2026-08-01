const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const { Profile } = require('../models/profile');
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');

    const profile = await Profile.findById(req.params.id)
        .populate('saved', 'name summary');

    if (!profile) return res.status(404).send('Profile not found.');

    res.send(profile.saved);
});

router.patch('/', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.recipeId))
        return res.status(400).send('Invalid recipe id.');

    const recipe = await Recipe.findById(req.body.recipeId);
    if (!recipe) return res.status(400).send('Invalid recipe.');

    console.log(req.params.id)
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).send('Profile not found.');

    const alreadySaved = profile.saved.some(
        (id) => id.toString() === recipe._id.toString()
    );
    if (alreadySaved) return res.send(profile);

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            profile.saved.push(recipe._id);
            await profile.save({ session });

            recipe.saves++;
            await recipe.save({ session });
        });

        res.send(profile);
    }
    catch (ex) {
        res.status(500).send('Something failed.');
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

    const wasSaved = profile.saved.some(
        (id) => id.toString() === req.body.recipeId
    );
    if (!wasSaved) return res.send(profile);

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await Profile.updateOne(
                { _id: profile._id },
                { $pull: { saved: req.body.recipeId } },
                { session }
            );

            await Recipe.updateOne(
                { _id: req.body.recipeId },
                { $inc: { saves: -1 } },
                { session }
            );
        });

        const updated = await Profile.findById(req.params.id);
        res.send(updated);
    }
    catch (ex) {
        res.status(500).send('Something failed.');
    }
    finally {
        session.endSession();
    }
});

module.exports = router;