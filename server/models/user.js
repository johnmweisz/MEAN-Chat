var mongoose = require("mongoose");
var validate = require("mongoose-validator");
var uniqueValidator = require('mongoose-unique-validator');

var nameValidator = [
    validate({
        validator: "isLength",
        arguments: [3, 50],
        message: "Name should be betwee {ARGS[0]} and {ARGS[1]} characters",
    }),
    validate({
        validator: "isAlphanumeric",
        message: "Name should contain alpha-numeric characters only",
    }),
]

var emailValidator = [
    validate({
        validator: "isEmail",
        message: "Not a valid email address",
    }),
]

const UserSchema = new mongoose.Schema({
    first_name: {
        required: [true, "First Name is required"],
        type: String,
        validate: nameValidator,
    },
    last_name: {
        required: [true, "Last Name is required"],
        type: String,
        validate: nameValidator,
    },
    email: {
        required: [true, "Email is required"],
        type: String,
        validate: emailValidator,
        unique: true
    },
    password: {
        required: [true, "Password is required"],
        type: String
        //cannot validate hashed pw, use frontend validation or middleware
    },
}, { timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'Email must be unique.'});
    
module.exports = mongoose.model("User", UserSchema);