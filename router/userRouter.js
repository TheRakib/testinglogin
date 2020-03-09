const express = require("express");
const User = require("../model/user")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken")


const router = express.Router();





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


router.get("/products", verifyToken , (req, res)=>{

res.send("You have authorisation");
})


module.exports = router;