const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const userRouter = require("./router/userRouter");
const productRouter = require("./router/productRouter")
const cookieParser = require("cookie-parser");
require('dotenv').config()
//const env??



const app = express();

app.use(cookieParser())

app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs");


app.get("/", (req, res)=>{

    res.send("Välkommnar användare")
})




app.use(userRouter);
app.use(productRouter)

const options = {
      useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true
}
const port = process.env.PORT || 8002;
mongoose.connect(config.databaseURL, options).then(()=>{
    app.listen(port);
})

module.exports = app