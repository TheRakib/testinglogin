const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const userSchema = new Schema({
    email:{ type:String, required: true, unique:true}, 
    password: {type:String, required:true}, 
    resetToken:String,
    expirationToken: Date, 
    wishlist:[{

        productId: {type: mongoose.Schema.Types.ObjectId,
        //mongoose.Schema.Types.ObjectId, 
        ref:"Product"
        }
    }]  
})
//sigle responsibility principer

//när vi ska anropa addToWishList(product). Vi ska anropa i userRouter där vi skapar en wishlist route.
//product kommer från product modellen. 
userSchema.methods.addToWishList = function(product){
    this.wishlist.push({productId: product._id})
    return this.save();
}
//user.addToWishList(product)

userSchema.methods.remove = function(productId){
   //splice metod 
   //filter 
    
   /* const restOftheProducts=  this.wishlist.filter( function (product){
            this.wishlist.productId.toString() != productId.toString()
    })

    this.wishlist = restOftheProducts; */
  
// vilken index som productId har 
 // vi tar bort produkten från wishlist array

   const indexOfProductId = this.wishlist.indexOf(productId)
   console.log(indexOfProductId)
   this.wishlist.splice(indexOfProductId, 1)


    return this.save();
}




 

//hur vi ska sparar 
//mongoose har egna metoder för att kunna spara data i modellen.





const User = mongoose.model("User", userSchema);

module.exports = User;