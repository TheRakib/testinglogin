
const request = require("supertest"),
    productRouter = require("../router/productRouter");

//https://jestjs.io/docs/uk/next/expect
//https://www.npmjs.com/package/supertest


describe("Product router testing", ()=>{
    it("testing create product router", (done)=>{
      
        request(productRouter).get("/createProduct")
        .send({})
        .expect(200)

        //
        done()
    })

    it("post request product create testing", (done)=>{

        request(productRouter).get("/createProduct")
        .then( res=>{
            const body = res.body
            
             expect(res.status).toEqual(200);
             expect(body).toHaveProperty("name", "tesla")
             expect(body).to.contain.property("name");
        })

        .catch( err=> done(err))
          done();
    })
})
 
/*  describe(" home router testing ", function () {
    it("tests home router", function (done) {

        request(productRouter).get("/createProduct")
            .send({})
            .expect(200)
           // .expect({}, done)
       done()
    })



    describe("post request testing" , ()=>{
        it("Tests post request for product creation", done=>{
            request(productRouter).get("/createProduct")
            .expect(200)
            .then( res =>{
                expect(res.status).toEquel(200);
                expect(res.body).toHaveProperty("name", "tesla")
            })
            done()
        })
    }) 
}) */
 

