const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: String,
    expirationToken: Date,
    wishlist: [{

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            //mongoose.Schema.Types.ObjectId, 
            ref: "Product", 
            //unique:true
            
        }
    }]
})
//sigle responsibility principer

//när vi ska anropa addToWishList(product). Vi ska anropa i userRouter där vi skapar en wishlist route.
//product kommer från product modellen. 
userSchema.methods.addToWishList = function (product) {
this.wishlist.push({ productId: product._id })
const newWishlist = this.wishlist.filter( function( {productId} ) {
 
 //if(!this.add(`${productId}`)) { this.add(`${productId}`)}
  return !this.has(`${productId}`) && this.add(`${productId}`)
},new Set)
console.log(newWishlist)
//kopierar array,  passing by value
this.wishlist = [...newWishlist]
//this.wishlist = newWishlist
return this.save();

/* Copy an array
const arr = [1, 2, 3];
const arr2 = [...arr]; // like arr.slice()

arr2.push(4);
//  arr2 becomes [1, 2, 3, 4]
//  arr remains unaffected
 */
//passing by value and by reference 
// console.log("value of wishlist" , this.wishlist) 
//object destructuring , array destructuring 
 
}

userSchema.methods.removeFromList = function (productId) {
    //splice metod 
    //filter 
    //console.log(productId)
    const restOftheProducts = this.wishlist.filter((product) => {
        return product.productId.toString()
            !==productId.toString()
    })

    this.wishlist = restOftheProducts;
    return this.save();

    //  ***alternative
    // // vilken index som productId har 
    //  // vi tar bort produkten från wishlist array

    //    const indexOfProductId = this.wishlist.indexOf(productId)
    //    console.log(indexOfProductId)
    //    this.wishlist.splice(indexOfProductId, 1)
    //   return this.save();

}

//hur vi ska sparar 
//mongoose har egna metoder för att kunna spara data i modellen.

const User = mongoose.model("User", userSchema);

module.exports = User;

//env file 
//config vs env . Skriva om config filen 
//env sample file
//production and test environment
//https://www.npmjs.com/package/dotenv
//cross env


//https://mongoosejs.com/docs/jest.html
//https://www.npmjs.com/package/mockgoose