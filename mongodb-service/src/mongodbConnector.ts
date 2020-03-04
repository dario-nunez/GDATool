import { config } from "dotenv";
import * as mongoose from "mongoose";
import { Connection, ConnectionOptions } from "mongoose";
import logger from "./logger/loggerFactory";

/**
 * Handles the connection with Mongodb.
 */
export class MongoConnector {
    private mongoConnection: Connection;

    /**
     * Load environment variables from .env file, where API keys and passwords are configured.
     */
    constructor() {
        const envFile: string = process.env.ENVFILE || ".env";
        config({ path: envFile });
        (mongoose as any).Promise = global.Promise;
    }

    /**
     * Initiate connection to MongoDB.
     * @returns {Promise<any>}
     */
    public connect(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const options: ConnectionOptions = {
                keepAlive: true,
                useNewUrlParser: true
            };
            this.mongoConnection = mongoose.connection;
            mongoose.connect(process.env.MONGODB_URI, options).then(() => {
                const indexOfA = process.env.MONGODB_URI.indexOf("@");
                const db = indexOfA !== -1 ?
                    process.env.MONGODB_URI.substring(0, 10) + "!_:_!" + process.env.MONGODB_URI.substring(indexOfA) :
                    process.env.MONGODB_URI;
                logger.info("MongoDB connected [%s]", db);
                resolve();
            }).catch(reject);
        });
    }

    /**
     * Disconnects from MongoDB.
     * @returns {Promise<any>}
     */
    public disconnect(): Promise<any> {
        return this.mongoConnection.close();
    }
}