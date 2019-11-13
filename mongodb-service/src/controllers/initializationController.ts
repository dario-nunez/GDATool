import Job from "../../../common-service/src/models/jobModel";
import User from "../../../common-service/src/models/userModel";
import * as mongoose from "mongoose";
import { DELETE, Path, POST} from "typescript-rest";
import Aggregation from "../models/aggregationModel";

@Path("/ms/database")
export class DatabaseController {
    @Path("createCollections")
    @POST
    public async createCollections(): Promise<any> {
        const errors: Array<string> = [];

        const aggregationInstance = new Aggregation({name: "dummy"});

        await aggregationInstance.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const userInstance = new User({username: "dummy"});

        await userInstance.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const jobInstance = new Job({description: "dummy"});

        await jobInstance.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        if (errors.length === 0) {
            return "Schema instanciated succesfully";
        } else {
            return errors;
        }
    }

    @Path("addTestRecords")
    @POST
    public async addTestRecords(): Promise<any> {
        const errors: Array<string> = [];

        // Ines test records. GB city and analyze price. Odd IDs.
        const testUserInes = new User(
            {
                _id: "111111111111111111111111",
                username: "Inesusername",
                password: "Inespassword",
                dashboards: [],
                name: "Ines"
            }
        );

        await testUserInes.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const testJobInes = new Job(
            {
                _id: "333333333333333333333333",
                description: "Ines' job",
                rawInputDirectory: "raw",
                stagingFileName: "staging",
                userId: "111111111111111111111111"
            }
        );

        await testJobInes.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const testAggregationInes = new Aggregation(
            {
                _id: "555555555555555555555555",
                aggs: ["AVG", "SUM"],
                featureColumns: ["city"],
                metricColumn: "price",
                name: "city_by_price",
                sortColumnName: "city",
                jobId: "333333333333333333333333"
            }
        );

        await testAggregationInes.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        // Rose test records. GB city & GB county and analyze price. 1 and even IDs
        const testUserRose = new User(
            {
                _id: "121212121212121212121212",
                username: "Roseusername",
                password: "Rosepassword",
                dashboards: [],
                name: "Rose"
            }
        );

        await testUserRose.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const testJobRose = new Job(
            {
                _id: "141414141414141414141414",
                description: "Rose's job",
                rawInputDirectory: "raw",
                stagingFileName: "staging",
                userId: "121212121212121212121212"
            }
        );

        await testJobRose.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const testAggregation1Rose = new Aggregation(
            {
                _id: "161616161616161616161616",
                aggs: ["AVG", "SUM", "COUNT", "MIN", "MAX"],
                featureColumns: ["city"],
                metricColumn: "price",
                name: "city_by_price",
                sortColumnName: "city",
                jobId: "141414141414141414141414"
            }
        );

        await testAggregation1Rose.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const testAggregation2Rose = new Aggregation(
            {
                _id: "181818181818181818181818",
                aggs: ["AVG", "SUM", "COUNT", "MIN", "MAX"],
                featureColumns: ["county"],
                metricColumn: "price",
                name: "county_by_price",
                sortColumnName: "county",
                jobId: "141414141414141414141414"
            }
        );

        await testAggregation2Rose.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const testAggregation3Rose = new Aggregation(
            {
                _id: "171717171717171717171717",
                aggs: ["AVG", "SUM", "COUNT", "MIN", "MAX"],
                featureColumns: ["Id"],
                metricColumn: "price",
                name: "Id_by_price",
                sortColumnName: "Id",
                jobId: "141414141414141414141414"
            }
        );

        await testAggregation3Rose.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        // Cary test records. GB county and analyze price. Even IDs.
        const testUserCary = new User(
            {
                _id: "222222222222222222222222",
                username: "Caryusername",
                password: "Carypassword",
                name: "Cary",
                dashboards: []
            }
        );

        await testUserCary.save((err: string) => {
            if (err) {
                errors.push(err);
            }
        });

        const testJobCary = new Job(
            {
                _id: "444444444444444444444444",
                description: "Cary's job",
                rawInputDirectory: "raw",
                stagingFileName: "staging",
                userId: "222222222222222222222222"
            }
        );

        await testJobCary.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        const testAggregationCary = new Aggregation(
            {
                _id: "666666666666666666666666",
                aggs: ["AVG", "SUM", "COUNT", "MIN", "MAX"],
                featureColumns: ["Id", "city", "county"],
                metricColumn: "price",
                name: "county_by_price",
                sortColumnName: "county",
                jobId: "444444444444444444444444"
            }
        );

        await testAggregationCary.save((err) => {
            if (err) {
                errors.push(err);
            }
        });

        if (errors.length === 0) {
            return "Test records added succesfully";
        } else {
            return errors;
        }
    }

    @Path("dropDatabase")
    @DELETE
    public async dropDatabase(): Promise<any> {
        const collections = await mongoose.connection.db.collections();

        collections.forEach((collection) => {
            collection.drop();
        });
    }
}
