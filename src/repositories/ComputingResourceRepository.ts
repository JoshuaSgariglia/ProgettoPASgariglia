import { ComputingResource } from "../models/ComputingResource";

export class ComputingResourceRepository {
    public async getById(resource_id: string): Promise<ComputingResource | null> {
        console.log(resource_id);
        return await ComputingResource.findByPk(resource_id);
    }
}
