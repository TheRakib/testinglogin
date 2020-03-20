const express = require("express");
const Product = require("../model/product")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken")

//docker 
//kurbernetes
const router = express.Router();

router.get("/products", async (req, res) => {

    const product_per_page = 4;

    const page = +req.query.page;  //Number(req.query.page)

const countProduct = await Product.find().countDocuments(); 

//console.log(countProduct);




    // localhost:8000/products/?page=1

    const products = await Product.find().populate("user -password")
       
        .skip(product_per_page * (page-1))
        .limit(product_per_page) 

//console.log("products ", products)
//res.send("product has shown")
     res.render("product.ejs", { products,
    //totaltProdukt
     countProduct, 
     product_per_page,
     //current Page 
     currentPage:page, 
     //hasNextPage
      hasNextPage: product_per_page > product_per_page *page, 
      
       //hasPreviousPage 
        hasPreviousPage: page>1, 
          nextPage:page +1,
         previousPage: page-1 ,
         //lastPage
         lastPage: Math.ceil(countProduct/product_per_page) 
        

     }) 
})

router.get("/createProduct", verifyToken, async (req, res) => {
 
 //console.log("Request body ", req.body.user._id)
 
  const product=  await new Product({
        name: "Tesla",
        price: 10000000,
        description: "lite kort beskrivning om product", 
        user: req.body.user._id //req.body.user._id
         // user:
    
      
    }).save()

    
//console.log(product)
    //res.redirect("/products")
    res.send("product is created")
})

module.exports = router;