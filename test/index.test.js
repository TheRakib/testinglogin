
const request = require("supertest")
const app= require("../index");


//jest   (mocha och chai)
//npm i --save-dev jest

//assertion checking expected value chai 
//execute test: mocha 
// både assertion och execute :: jest


//integretion test :: supertest 
//npm i --save-dev supertest
// kan ta router som arguement och läsa olika endpoints data 
// kan också test async funktioner

//testa inte tredje parts module/biblan osv.

describe("home router testing " , ()=>{
  
    it("tests home router", (done)=>{
  
      request(app).get("/")
      .expect(200)
      .expect(/Välkommnar användare/, done )

    })
})
