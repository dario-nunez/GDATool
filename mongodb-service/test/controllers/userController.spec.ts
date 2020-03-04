import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IUserModel } from "../../src/models/userModel";
import { UserRepository } from "../../src/repositories/userRepository";

/**
 * User Controller tests.
 */
chai.use(chaiHttp);
const expect = chai.expect;
let userRepository: UserRepository;

const testUser: IUserModel = {
    password: "test_password",
    email: "test_email",
    name: "test_user"
};

before(async () => {
    userRepository = new UserRepository();
    const existingUser = await userRepository.getUserByEmail(testUser.email);
    if (existingUser) {
        await userRepository.delete(existingUser._id);
    }
});

describe("User Controller tests", () => {
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
        it("get a user with existing user id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/" + testUser._id)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser.name).to.equal(testUser.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get a user with non existing user id fails", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("get user with existing email succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/byEmail/" + testUser.email)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser.name).to.equal(testUser.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get user with non existing email fails", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/user/byEmail/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("get all users succeeds", (done) => {
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
        it("authenticate with correct name and password succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/user/authenticate")
                .send({ email: testUser.email, password: testUser.password })
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser._id).to.equal(testUser._id);
                    expect(returnUser.email).to.equal(testUser.email);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("authenticate with incorrect name and password returns empty user and succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/user/authenticate")
                .send({ email: testUser.email, password: "wrong password" })
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser._id).to.equal("");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("update user", () => {
        it("update with correct userid succeeds", (done) => {
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

        it("update with incorrect user id fails", (done) => {
            chai.request("http://localhost:5000")
                .put("/ms/user/wrongId")
                .send({ email: testUser.email, password: "wrong password" })
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });

    describe("delete user", () => {
        it("delete with non existing user id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/user/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("delete with existing user id succeeds", (done) => {
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