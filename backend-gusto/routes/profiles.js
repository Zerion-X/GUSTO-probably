const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Profile, validate } = require('../models/profile');
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');
const {User} = require('../models/user');

router.get('/', async (req, res) => {
    const profiles = await Profile.find().sort('user.name');
    res.send(profiles);
});

router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');

    const profile = await Profile.findById(req.params.id)
        .populate('favorites', 'name likes')
        .populate('saved', 'name saves')
        .populate('posts');

    if (!profile) return res.status(404).send('Profile not found.');

    res.send(profile);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('Invalid user');

    let profile = new Profile({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        favorites: req.body.favorites || [],
        posts: req.body.posts || [],
        saved: req.body.saved || []
    });

    profile = await profile.save();
    res.send(profile);
});

router.put('/:id', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('Invalid user');

    const profile = await Profile.findByIdAndUpdate(
        req.params.id,
        {
            user: {
                _id:user._id,
                name: user.name,
                email: user.email
            }
        },
        { new: true }
    );

    if (!profile) return res.status(404).send('Profile not found.');
    res.send(profile);
});

router.delete('/:id', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');

    const profile = await Profile.findByIdAndRemove(req.params.id);
    if (!profile) return res.status(404).send('Profile not found.');

    res.send(profile);
});

router.patch('/:id/favorites', auth, async (req, res) => {
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

            recipe.likes++;
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

router.delete('/:id/favorites', auth, async (req, res) => {
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
                { $inc: { likes: -1 } },
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

router.patch('/:id/saved', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.recipeId))
        return res.status(400).send('Invalid recipe id.');

    const recipe = await Recipe.findById(req.body.recipeId);
    if (!recipe) return res.status(400).send('Invalid recipe.');

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

router.delete('/:id/saved', auth, async (req, res) => {
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


router.patch('/:id/posts', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');
    if (!mongoose.Types.ObjectId.isValid(req.body.postId))
        return res.status(400).send('Invalid post id.');

    const profile = await Profile.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { posts: req.body.postId } },
        { new: true }
    );

    if (!profile) return res.status(404).send('Profile not found.');
    res.send(profile);
});

router.delete('/:id/posts', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');
    if (!mongoose.Types.ObjectId.isValid(req.body.postId))
        return res.status(400).send('Invalid post id.');

    const profile = await Profile.findByIdAndUpdate(
        req.params.id,
        { $pull: { posts: req.body.postId } },
        { new: true }
    );

    if (!profile) return res.status(404).send('Profile not found.');
    res.send(profile);
});

module.exports = router;