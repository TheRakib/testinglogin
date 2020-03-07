const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const user = require("./router/userRouter")

const app = express();

app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs");


app.use(user);

const options = {
      useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true
}
const port = process.env.PORT || 8002;
mongoose.connect(config.databaseURL, options).then(()=>{
    app.listen(port);
})