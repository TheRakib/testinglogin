const express = require("express");
const User = require("../model/user")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const verify = require("./verifyToken")


const router = express.Router();



router.get("/", verify, (req, res) => {
    res.send("hej, du lyckades att registrera i")
})

router.get("/signUp", (req, res) => {
    res.render("signup.ejs")
})

router.post("/signUp", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    //console.log(hashPassword)
    await new User({
        email: req.body.email,
        password: hashPassword
    }).save();


    //const user = await User.findOne({email:req.body.email});
    //console.log(user)
    //res.redirect("/userProfile" );
    res.redirect("/")
})



router.get("/login", (req, res) => {



    //användarens info
    res.render("login.ejs")
    // jämföra med databas info.



})



router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.loginEmail });
    if (!user) return res.redirect("/signup")

    const validUser = await bcrypt.compare(req.body.loginPassword, user.password)
    //console.log(validUser)
    if (!validUser) return res.redirect("/login")
    else {
        jwt.sign({ user }, "secretkey", (err, token) => {

            if (err) return res.redirect("/login")
           if (!req.cookies) {
                res.cookie("jsonwebtoken", token, { maxAge: 3600000, httpOnly: true })

            } 
            //exp.
            //node js kör i servern och localStorage är Browser api
            //localStorage.setItem("JSONWEBTOKEN", JSON.stringify(token))

            res.render("userProfile", { user })
        })
    }
})


module.exports = router;