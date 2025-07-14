import { ComputingResource } from "../models/ComputingResource";

export class ComputingResourceRepository {
    public async getById(resource_id: string): Promise<ComputingResource | null> {
        return await ComputingResource.findByPk(resource_id);
    }
}
