var mongoose = require("mongoose");
var validate = require("mongoose-validator");
// var UserModel = require('./user');

const MessageSchema = new mongoose.Schema(
    {
        user: [] //[UserModel.schema]
        ,
        message: {
            type: String
        },
    },
        {timestamps: true}
    );
    
module.exports =  mongoose.model("Message", MessageSchema);