const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const { Profile} = require('../models/profile');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');

    const profile = await Profile.findById(req.params.id)
        .populate('posts', 'name summary');

    if (!profile) return res.status(404).send('Profile not found.');

    res.send(profile.posts);
});

router.patch('/', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');
    if (!mongoose.Types.ObjectId.isValid(req.body.recipeId))
        return res.status(400).send('Invalid recipe id.');

    const profile = await Profile.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { posts: req.body.recipeId } },
        { returnDocument:'after' }
    );

    if (!profile) return res.status(404).send('Profile not found.');
    res.send(profile);
});

router.delete('/', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');
    if (!mongoose.Types.ObjectId.isValid(req.body.recipeId))
        return res.status(400).send('Invalid recipe id.');

    const profile = await Profile.findByIdAndUpdate(
        req.params.id,
        { $pull: { posts: req.body.recipeId } },
        { returnDocument: 'after' }
    );

    if (!profile) return res.status(404).send('Profile not found.');
    res.send(profile);
});


module.exports = router;