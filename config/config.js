//connection string from mongodb.
// glöm ej npm i --save-dev dotenv   // dotenv läser env variabler
require('dotenv').config()

//process.env.varnamnet

const config = {
    databaseURL:process.env.DATABASE, 
    mail:process.env.MAIL
    
}


    

module.exports = config;