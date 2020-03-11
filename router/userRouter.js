const express = require("express");
const User = require("../model/user")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken");
const config = require("../config/config");  
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport")

const router = express.Router();


const transport = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key:config.mail
    }
}))
router.get("/signUp", (req, res) => {
    res.render("signup.ejs")
})

router.post("/signUp", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    //console.log(hashPassword)
    const user =await new User({
        email: req.body.email,
        password: hashPassword
    }).save();
transport.sendMail({
    to: "rraakkiibb@gmail.com",
    from:"<no-reply>Medieintstitutet@frontendare.se", 
    subject:"Login succeeded", 
    html:"<h1> Väkommen " + user.email + "</h1>"

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


router.get("/reset", (req, res)=>{
    res.render("reset")
})
router.post("/reset", async (req, res)=>{

   // req.body.resetMail
 const existUser = await User.findOne({email:req.body.resetMail})
 if(!existUser) return res.redirect("/signup");

  existUser.resetToken = "en reset token"
  existUser.expirationToken = Date.now() + 100000;


})

router.get("/products", verifyToken , (req, res)=>{

res.send("You have authorisation");
})

router.get("/logout", (req, res)=>{
        res.clearCookie("jsonwebtoken").redirect("/login")
})



module.exports = router;