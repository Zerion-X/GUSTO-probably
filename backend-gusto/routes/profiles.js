const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Profile, validate } = require('../models/profile');
const auth = require('../middleware/auth');
const {User} = require('../models/user');
const { doubleCsrfProtection } = require('../middleware/csrf');

router.get('/', async (req, res) => {
    const profiles = await Profile.find().sort('user.name');
    res.send(profiles);
});

router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');

    const profile = await Profile.findById(req.params.id)
        .populate('favorites', 'name summary')
        .populate('saved', 'name summary')
        .populate('posts','name summary');

    if (!profile) return res.status(404).send('Profile not found.');

    res.send(profile);
});

router.post('/',auth, doubleCsrfProtection, async (req, res) => {
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

router.put('/:id', auth, doubleCsrfProtection, async (req, res) => {
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
        { returnDocument:'after' }
    );

    if (!profile) return res.status(404).send('Profile not found.');
    res.send(profile);
});

router.delete('/:id', auth, doubleCsrfProtection, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid profile id.');

    const profile = await Profile.findByIdAndRemove(req.params.id);
    if (!profile) return res.status(404).send('Profile not found.');

    res.send(profile);
});

module.exports = router;