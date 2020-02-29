import * as chai from "chai";
import { before, describe, it } from "mocha";
import logger from '../../../mongodb-service/src/logger/loggerFactory';
import { DashboardBuilder } from "../../src/elasticsearchEntityJsonBuilders/DashboardBuilder";
import { IDashboard } from "../../src/elasticsearchModels/dashboardModel";
import { IVisualization } from '../../src/elasticsearchModels/visualizationModel';
import { expectedDashboard } from "./elasticsearchEntityJsonBuilderTestResources/dashboardBuilder.spec.resources";

const assert = chai.assert;
let dashboardBuilder: DashboardBuilder;

before(async () => {
    dashboardBuilder = new DashboardBuilder();
});

describe("Dashbaord builder tests", () => {
    describe("create dashboard entity", () => {
        it("create succeeds", (done) => {
            const testVisualization1: IVisualization = {
                id: "test_id1",
                type: "test_type1"
            };

            const testVisualization2: IVisualization = {
                id: "test_id2",
                type: "test_type2"
            };

            const testDashboardSeed: IDashboard = {
                id: "test_id",
                title: "test_title",
                visualizations: [[testVisualization1, testVisualization2], [testVisualization1, testVisualization2]],
                description: "test_description"
            };

            const json = dashboardBuilder.getDashboard(testDashboardSeed);

            logger.info(json);
            logger.info(json.data.references);
            logger.info(json.data.dashboard.kibanaSavedObjectMeta);

            assert.deepEqual(json, expectedDashboard);
            done();
        });
    });
});