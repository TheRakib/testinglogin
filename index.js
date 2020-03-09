const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const userRouter = require("./router/userRouter");
const cookieParser = require("cookie-parser");




const app = express();

app.use(cookieParser())

app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs");



app.use(userRouter);

const options = {
      useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true
}
const port = process.env.PORT || 8002;
mongoose.connect(config.databaseURL, options).then(()=>{
    app.listen(port);
})