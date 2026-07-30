const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const jwt = require('jsonwebtoken');

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
    return  jwt.sign({_id:this._id},config.get('jwtPrivateKey'));
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