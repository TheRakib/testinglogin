const jwt = require("jsonwebtoken");


module.exports = (req, res, next)=> {

const token = req.cookies.jsonwebtoken;
console.log(token);
if(!token) return res.redirect("/signin")

try{
    const verified = jwt.verify(token, "privatekey");
    console.log(verified)
    req.user = verified;
    console.log(req.user._id)
    next();
}
catch(err)
{
    res.send("invalid error")
}


}