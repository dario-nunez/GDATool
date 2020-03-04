import { Repository } from "../../mongodb-service/src/repositories/repository";

/**
 * Delete a document in Mongodb if it exists.
 * @param model 
 * @param repository 
 */
export async function deleteIfPresent(model: any, repository: Repository<any> ) {
    const existingModel = await repository.getById(model._id);
    if (existingModel) {
        await repository.delete(existingModel._id);
    }
}