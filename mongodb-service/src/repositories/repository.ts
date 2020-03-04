import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";
import logger from "../logger/loggerFactory";

/**
 * Define common CRUD method headers.
 */
export interface IRepository<T extends Document> {
    create(o: any): Promise<T>;
    update(id: any, o: any): Promise<T>;
    delete(id: string): Promise<T>;
    getById(id: string): Promise<T>;
    getAll(): Promise<Array<T>>;
}

/**
 * A typed base Repository class containing implementations for all common CRUD methods and 
 * some others. T extends Document so this class can be used by any declared Mongooose 
 * Document type. Mongoose interacts with Mongodb by calling methods from defined models.
 */
export class Repository<T extends Document> implements IRepository<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    public create(o: any): Promise<T> {
        return new this.model(o).save();
    }

    public delete(id: string): Promise<T> {
        mongoose.set("useFindAndModify", false);
        return this.model.findByIdAndRemove(id).exec();
    }

    public getAll(): Promise<Array<T>> {
        return this.model.find().lean(true).exec();
    }

    public getById(id: string, projection?: string): Promise<T> {
        return this.model.findById(id).select(projection).lean(true).exec();
    }

    public update(id: any, o: any): Promise<T> {
        mongoose.set("useFindAndModify", false);
        return this.model.findByIdAndUpdate(id, o).lean(true).exec();
    }

    public getByFields(conditions: any, projection?: string): Promise<Array<T>> {
        return this.model.find(conditions, (err, obj) => {
            if (err) {
                logger.error(err);
            }
        }).select(projection).lean().exec();
    }
}
