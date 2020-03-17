
const mongoose = require("mongoose");


const productSchema = {
    name: {type: String, required:true},
    price: {type: Number, required:true}, 
    description : { type: String}, 
    user:{
        type: mongoose.Schema.Types.ObjectId,
         //  mongoose.Schema.Types.ObjectId, //någon valid mongoose id 
        ref:"User",  //ref refererar från vilken model den skulle leta objektId
        required:true
    }
  
}

const product = mongoose.model("Product", productSchema);

module.exports = product;