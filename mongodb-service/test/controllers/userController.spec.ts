import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IUserModel } from "../../src/models/userModel";
import { UserRepository } from "../../src/repositories/userRepository";

chai.use(chaiHttp);
const expect = chai.expect;
let userRepository: UserRepository;

const testUser = {
    password: "test_password",
    email: "test_email",
    name: "test_user"
} as IUserModel;

before(async () => {
    userRepository = new UserRepository();
    const existingUser = await userRepository.getUserByEmail(testUser.email);
    if (existingUser) {
        await userRepository.delete(existingUser._id);
    }
});

describe("User controller tests", () => {
    describe("create user", () => {
        it("create user with a unique email succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/user")
                .send(testUser)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    testUser._id = returnUser._id;            
                    expect(returnUser.name).to.equal(testUser.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create user with a non unique email fails", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/user")
                .send(testUser)
                .end(function (err, res) {        
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });

    describe("get user", () => {
        it("get a user by id with existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/" + testUser._id)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser.name).to.equal(testUser.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get a user by id with non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("get user by email with existing email", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/byEmail/" + testUser.email)
                .end(function (err, res) {        
                    const returnUser: IUserModel = res.body;
                    expect(returnUser.name).to.equal(testUser.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get user by email with non existing email", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/byEmail/wrongId")
                .end(function (err, res) {        
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("get all users returns a list of users", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/getAll")
                .end(function (err, res) {        
                    const returnUsers: Array<IUserModel> = res.body;
                    expect(returnUsers).to.be.an('array');
                    expect(returnUsers[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("authenticate user", () => {
        it("using the correct name and password succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/user/authenticate")
                .send({email: testUser.email, password: testUser.password})
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser._id).to.equal(testUser._id);
                    expect(returnUser.email).to.equal(testUser.email);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("using incorrect name and password fails", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/user/authenticate")
                .send({email: testUser.email, password: "wrong password"})
                .end(function (err, res) {        
                    const returnUser: IUserModel = res.body;
                    expect(returnUser).to.be.an('Object');
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });

    describe("update user", () => {
        it("using correct id updates the user", (done) => {
            const updatedUser = Object.assign({}, testUser);
            updatedUser.name = updatedUser.name + "_updated";

            chai.request("http://localhost:5000")
                .put("/ms/user/" + updatedUser._id)
                .send(updatedUser)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;            
                    expect(returnUser.name).to.equal(testUser.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("using incorrect id does not update the user", (done) => {
            chai.request("http://localhost:5000")
                .put("/ms/user/wrongId")
                .send({email: testUser.email, password: "wrong password"})
                .end(function (err, res) {        
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });

    describe("delete user", () => {
        it("using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/user/wrongId")
                .end(function (err, res) {        
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/user/" + testUser._id)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser._id).to.equal(testUser._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});