// we will use supertest to test HTTP requests/responses
const request = require("supertest");
const app = require("../app");

//Test App is Running
describe("GET /", () => {
    test("It responds with Server Running", async () => {
        try {
            await request(app)
                .get("/")
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({
                    "status": "Success",
                    "message": "App is running"
                })
        }catch(err){
            throw new Error(err)
        }
    });
        
});