const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required : true,
        minlength: 5,
        maxlength: 50 
    },
    password:{
        type:String,
        required:true,
        minlength: 5,
        maxlength: 255 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength: 5,
        maxlength: 1024
    }
})

userSchema.methods.generateAuthToken = function (){
    const tokenId = crypto.randomBytes(16).toString('hex');
    return jwt.sign({ _id: this._id, jti: tokenId }, config.get('jwtPrivateKey'), {
        expiresIn: '1h'
    });
}

const User = mongoose.model('User', userSchema);

function validateUser(User){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(User);
}

exports.User = User;
exports.validate = validateUser;