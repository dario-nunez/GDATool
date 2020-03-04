import * as chai from "chai";
import { describe, it } from "mocha";
import { HttpMethod, Server } from "typescript-rest";

const expect = chai.expect;

/**
 * API Server tests ensure that all the expected endpoints are exposed at runtime. It also ensures that their paths have the expected types (GET, POST, PUT, DELETE, ...)
 */
describe("Rest Server Tests", () => {
    // A single test checking all exposed routes of the API
    describe("Check the exposed routes", () => {
        it("Contains all paths and they are of the correct type", (done) => {
            expect(Server.getPaths()).to.include.members([
                '/es/dashboardBuilder/status',
                '/es/dashboardBuilder/basic/:id'
            ]);

            // Checking types of filter endpoints
            expect(Server.getHttpMethods("/es/dashboardBuilder/status")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/es/dashboardBuilder/basic/:id")).to.have.members([HttpMethod.GET]);
            
            done();
        });
    });
});