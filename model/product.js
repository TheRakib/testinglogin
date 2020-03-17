
const mongoose = require("mongoose");

const productSchema = {
    name: {type: String},
    price: {type: Number}, 
    description : { type: String}, 
  
}

const product = mongoose.model("Product", productSchema);

module.exports = product;