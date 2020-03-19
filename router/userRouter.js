const express = require("express");
const User = require("../model/user")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport")
const crypto = require("crypto");
const router = express.Router();
const Product = require("../model/product")


const transport = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: config.mail
    }
}))
router.get("/signUp", (req, res) => {
    res.render("signup.ejs")
})

router.post("/signUp", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    //console.log(hashPassword)
    const user = await new User({
        email: req.body.email,
        password: hashPassword
    }).save();
    //user.save()
    console.log(user)
    transport.sendMail({
        to: user.email,
        from: "<no-reply>Medieintstitutet@frontendare.se",
        subject: "Login succeeded",
        html: "<h1> Väkommen " + user.email + "</h1>"

    })

    //const user = await User.findOne({email:req.body.email});
    //console.log(user)
    //res.redirect("/userProfile" );
    res.send("You have been registered")
})

router.route("/login")

    .get((req, res) => {
        //användarens info
        res.render("login.ejs")
        // jämföra med databas info.
    })

    .post(async (req, res) => {
        const user = await User.findOne({ email: req.body.loginEmail });
        if (!user) return res.redirect("/signup")

        const validUser = await bcrypt.compare(req.body.loginPassword, user.password)
        //console.log(validUser)
        if (!validUser) return res.redirect("/login")

        jwt.sign({ user }, "secretkey", (err, token) => {
            if (err) res.redirect("/login")
            //console.log(token)
            if (token) {
                //Use localstorage
                //console.log("hej")
                // const cookie = req.cookies.jwtToken;
                //cookie-parser måste finnas för att kunna läsa jwt Token

                const cookie = req.cookies.jsonwebtoken;
                if (!cookie) {

                    //res.header("auth")
                    res.cookie('jsonwebtoken', token, { maxAge: 3600000, httpOnly: true });
                }

                res.render("userProfile", { user })
            }
            res.redirect("/login")

        })


    })


router.get("/reset", (req, res) => {
    res.render("reset")
})
router.post("/reset", async (req, res) => {

    // req.body.resetMail
    const user = await User.findOne({ email: req.body.resetMail })
    if (!user) return res.redirect("/signup");

    crypto.randomBytes(32, async (err, token) => {
        if (err) return res.redirect("/signup");
        //12131231
        const resetToken = token.toString("hex");
        //"ef945...""  (0-f)  
        user.resetToken = resetToken;
        user.expirationToken = Date.now() + 100000;
        await user.save();

        await transport.sendMail({
            to: user.email,
            from: "<no-reply>Medieintstitutet@frontendare.se",
            subject: "reset  password",
            html: `  Reset password link:  http://localhost:8002/reset/${resetToken} `
            //http://localhost:8000/reset/resettoken
        })

        res.redirect("/login")
 })
})
router.get("/reset/:token", async (req, res) => {
    // om användare har token 
    //och den token är giltig då kan användare kan få ett förmulär 
    //req.params.token
    const user = await User.findOne({ resetToken: req.params.token, expirationToken: { $gt: Date.now() } })
     console.log(user);
    if (!user) return res.redirect("/signUp");

    res.render("resetForm.ejs" , {user})

})
//const nodemailer = require("nodemailer");
//const sendGridTransport = require("nodemailer-sendgrid-transport")

router.post("/reset/:token", async(req, res)=>{
    //req.body.userId
    //req.body.password

    const user = await User.findOne({_id:req.body.userId})

    user.password = await bcrypt.hash(req.body.password, 10) ;
    user.resetToken= undefined;
    user.expirationToken= undefined;
     await user.save();

res.redirect("/login"); 
//aws ses
})


router.get("/logout", (req, res) => {
    res.clearCookie("jsonwebtoken").redirect("/login")
})

router.get("/wishlist/:id",verifyToken , async (req, res)=>{
  
       //req.params.id

    const product =  await  Product.findOne({_id:req.params.id}).populate("user")
      
      // {}

   //console.log("product with user population" , product)

   // req.user ska ha user inf
     //req.body.user._id
     //verifyToken
       
       //hård kodat user id från user collection
    const user = await User.findOne({_id: req.body.user._id}).populate("wishlist.productId")
     //user hämtar bara ett objekt. 
     //User.find() hämtar array of object 
   //console.log(user)
    // req.body.user.addToWishList(product)

// mata in ett product id från mongo databas  . Lägg den som string  "51232131231......."
 await user.addToWishList(product)

 //populate user with product model.
 //console.log("added" ,user)
 
  

res.render("wishlist.ejs", {user});

})


router.get("/deleteWishlist/:id", (req, res)=>{

   //req.params.id

   res.redirect("/wishlist/:id")



})



/* <div>
    <% products.forEach( product=> { %>
  
          <li> <%= product %></li>

          <a href="/wishlist/<%=product._id %>"> Add to Wishlist</a>
       
  <%  }) %> */


module.exports = router;