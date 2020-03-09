const express = require("express");
const Product = require("../model/product")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken")


const router = express.Router();

router.get("/products", async (req, res) => {
    const products = await Product.find()

    res.render("product.ejs", { products })
})

router.get("/createProduct", async (req, res) => {
    await new Product({
        name: "Adidas",
        price: 1000,
        description: "lite kort beskrivning om product"
    }).save();

    //res.redirect("/products")
    res.send("product is created")
})

module.exports = router;