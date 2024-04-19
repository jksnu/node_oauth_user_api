// we will use supertest to test HTTP requests/responses
const request = require("supertest");
const app = require("../app");

//Test App is Running
describe.skip("GET /", () => {
    it("It responds with Server Running", async () => {
        await request(app)
            .get("/")
            .timeout(5000)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "status": "Success",
                "message": "Hello world"
            });
    });        
});