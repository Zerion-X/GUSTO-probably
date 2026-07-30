const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);

const profileSchema = new mongoose.Schema({
    user: {
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 255
        }
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Recipe',
        default: []
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Recipe',
        default: []
    },
    saved: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Recipe',
        default: []
    }
});

const Profile = mongoose.model('Profile', profileSchema);

function validateProfile(profile) {
    const schema = Joi.object({
        userId: Joi.objectId().required(),
        favorites: Joi.array().items(Joi.objectId()),
        posts: Joi.array().items(Joi.objectId()),
        saved: Joi.array().items(Joi.objectId())
    });

    return schema.validate(profile);
}

exports.Profile = Profile;
exports.validate = validateProfile;