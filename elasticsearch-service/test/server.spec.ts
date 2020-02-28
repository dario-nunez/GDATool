import * as chai from "chai";
import { describe, it } from "mocha";
import { HttpMethod, Server } from "typescript-rest";

const expect = chai.expect;

// For the test to run, MongoDb must be available
describe("Rest Server Tests", () => {
    // A single test checking all exposed routes of the API
    describe("Check the exposed routes", () => {
        it("Contains all paths and they are of the correct type", (done) => {
            expect(Server.getPaths()).to.include.members([
                '/es/dashboardBuilder/test/:name',
                '/es/dashboardBuilder/basic/:id'
            ]);

            // Checking types of filter endpoints
            expect(Server.getHttpMethods("/es/dashboardBuilder/test/:name")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/es/dashboardBuilder/basic/:id")).to.have.members([HttpMethod.GET]);
            
            done();
        });
    });
});