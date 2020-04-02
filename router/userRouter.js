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
const Product = require("../model/product");
//require dotenv
//process.env.STRIPE_KEY
//npm i stripe --save
const stripe =require("stripe")("sk_test_8rmpp0nPtS8mc1ovYHPengwi00tRWejSio")



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

router.get("/wishlist",verifyToken , async (req, res)=>{
  
 const user = await User.findOne({_id: req.body.user._id}).populate("wishlist.productId")
res.render("wishlist.ejs", {user});

})


router.get("/wishlist/:id",verifyToken , async (req, res)=>{
 const product =  await  Product.findOne({_id:req.params.id}) 
const user = await User.findOne({_id: req.body.user._id})   
// mata in ett product id från mongo databas  . Lägg den som string  "51232131231......."
//console.log("product" , product)
 await user.addToWishList(product)
 //console.log("wishlist user " , user)
 res.redirect("/wishlist")
//res.render("wishlist.ejs", {user});

})

router.get("/deleteWishlist/:id", verifyToken, async(req, res)=>{
  const user = await User.findOne({_id: req.body.user._id})
  user.removeFromList(req.params.id)
  res.redirect("/wishlist");
})


router.get("/order", verifyToken,async (req, res)=>{
 const user = await User.findOne({_id: req.body.user._id}).populate("wishlist.productId")
 
 return stripe.checkout.sessions.create({
     payment_method_types: ["card"],
     line_items: user.wishlist.map((product)=>{
         return {
             name: product.productId.name,
             amount:product.productId.price*100, //öre *100 = 1 kronor
             quantity: 1, 
             currency:"sek"
         }
     }),
     success_url:req.protocol +   "://" + req.get("Host") +  "/",
     cancel_url:"http://localhost:8002/products"
     // ":" + process.env.PORT + 

 }).then( (session)=>{
     console.log(session)
 res.render("checkout.ejs", {user, sessionId:session.id})
 })

//// req.protocol + :// + req.get("Host") +"/"
  
  //skicka en session id från här .
  

})

//forEach() — executes a provided function once for each array element.
//map() — creates a new array with the results of calling a provided function on every element in the calling array.

/* <div>

checkout sidan:  <%= user.wishlist[0].productId.name %>

  
    <% products.forEach( product=> { %>
  
          <li> <%= product %></li>

          <a href="/wishlist/<%=product._id %>"> Add to Wishlist</a>
       
  <%  }) %> */


module.exports = router;