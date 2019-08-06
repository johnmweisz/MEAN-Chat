var mongoose = require("mongoose");
var validate = require("mongoose-validator");
var uniqueValidator = require('mongoose-unique-validator');
// var UserModel = require('./user');
// var MessageModel = require('./message');

const RoomSchema = new mongoose.Schema(
    {
        name: {
            required: [true, "name is required"],
            type: String,
            minlength: 3,
            unique: true
        },
        admins: [] //[UserModel.schema]
        ,
        messages: [] //[MessageModel.schema]
    }, 
        {timestamps: true}
    );
    
RoomSchema.plugin(uniqueValidator, {message: 'Room name must be unique.'});

module.exports = mongoose.model("Room", RoomSchema);