//connection string from mongodb.
// glöm ej npm i --save dotenv   // dotenv läser env variabler
//if(process.env.NODE_ENV !=="production")
require('dotenv').config()

//process.env.varnamnet

const config = {
    databaseURL:process.env.DATABASE, 
    mail:process.env.MAIL
    
}

//NODE_ENV ÄR I PRODUCTION ELLER DEV ENVIRONMENT

    

//trejeparts stripe api, klarna , paypal

//api nyckel 
//aktivera konto 
module.exports = config;