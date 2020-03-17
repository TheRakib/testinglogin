const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;

const userSchema = {
    email:{ type:String, required: true, unique:true}, 
    password: {type:String, required:true}, 
    resetToken:String,
    expirationToken: Date
    
    
}






const User = mongoose.model("User", userSchema);

module.exports = User;