// we will use supertest to test HTTP requests/responses
const request = require("supertest");
const app = require("../app");

//Register User
describe("POST /user/registerUser", () => {
    test("It responds with registerUser", async () => {
        try {
            await request(app)
                .post("/user/registerUser")
                .send({
                    username: "admin_new",
                    password: "admin_new"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({
                    "message": "User is registered successfully"
                });
        }catch(err){
            throw new Error(err)
        }
    });

    test("It responds with registerUser", async () => {
        try {
            await request(app)
                .post("/user/registerUser")
                .send({
                    username: "admin1",
                    password: "admin1"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({
                    "message": "User is registered successfully"
                });
        }catch(err){
            throw new Error(err)
        }
    });

    test("It responds with User Already exist for duplicate user registration", async () => {
        try {
            await request(app)
                .post("/user/registerUser")
                .send({
                    username: "admin",
                    password: "admin"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({
                    status: 400,
                    message: "User Already exist"
                  });
        }catch(err){
            throw new Error(err)
        }
    });
        
});


// Login User Success
describe("POST /user/login", () => {
    test("It responds with login", async () => {
        try {
            await request(app)
                .post("/user/login")
                .send({
                    username: "admin1",
                    password: "admin1"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({
                    status: 200,
                    message: "User Successfully Logged in"
                  });
        }catch(err){
            throw new Error(err)
        }
    });

    //Login fails
    test("It responds with login failure", async () => {
        try {
            await request(app)
                .post("/user/login")
                .send({
                    username: "admin",
                    password: "admins"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({
                    status: 400,
                    message: "Invalid Username or Password"
                  });
        }catch(err){
            throw new Error(err)
        }
    });
        
});

//Get Logged In User
describe("GET /user/users", () => {
    test("It responds with List Users", async () => {
        try {
            await request(app)
                .get("/user/users")
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.length).toBeGreaterThanOrEqual(1)
                })
        }catch(err){
            throw new Error(err)
        }
    });
        
});

//Delete User
describe("DELETE /user/delete", () => {
    test("It responds with Deleting Users", async () => {
        try {
            const username="admin_new"
            await request(app)
                .delete(`/user/delete/${username}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": "User is deleted successfully" })
        }catch(err){
            throw new Error(err)
        }
    });

    //Deleting user that is not present
    test("It responds with Deleting Users not found", async () => {
        try {
            const username="ars"
            await request(app)
                .delete(`/user/delete/${username}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .expect({
                    status: 404,
                    message: "User not found"
                })
        }catch(err){
            throw new Error(err)
        }
    });
        
});

// Logout User
describe("POST /user/logout", () => {
    test("It responds with logout", async () => {
        try {
            await request(app)
                .post("/user/logout")
                .send({
                    username: "admin1",
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": "User has logged out successfully" })
        }catch(err){
            throw new Error(err)
        }
    });
        
});
