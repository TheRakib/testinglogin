const express = require("express");
const User = require("../model/user")
const bcrypt = require("bcryptjs")


const router = express.Router();





router.get("/signUp", (req, res) => {
    res.render("signup.ejs")
})

router.post("/signUp", async (req, res) => {
const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(req.body.password, salt);
//console.log(hashPassword)
  await  new User({
        email: req.body.email,
        password: hashPassword
    }).save();
  
 const user = await User.find({email:req.body.email});
 //console.log(user)
  res.render("userProfile.ejs", {user} );
})


router.get("/login", (req, res)=>{
    //användarens info
    res.render("login.ejs")
    // jämföra med databas info.


    
})
router.post("/login", async(req, res)=>{
const user = await User.findOne({ email:req.body.loginEmail});
 if(!user) res.redirect("/signup")
 
const validUser = await bcrypt.compare(req.body.loginPassword, user.password)
console.log(validUser)
if(!validUser) return res.redirect("/login");
res.send("hej du har loggat in")

})


module.exports = router;