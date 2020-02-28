import { Repository } from "../src/repositories/repository";

export async function deleteIfPresent(model: any, repository: Repository<any> ) {
    const existingModel = await repository.getById(model._id);
    if (existingModel) {
        await repository.delete(existingModel._id);
    }
}