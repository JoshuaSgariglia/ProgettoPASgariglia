import { ComputingResource } from "../models/ComputingResource";

/**
 * Repository class for the ComputingResource model.
 * Provides higher-level methods to interact with the ComputingResource model.
 */
export class ComputingResourceRepository {
    
    // Retrieves a computing resource by its UUID
    public async getById(resource_id: string): Promise<ComputingResource | null> {
        return await ComputingResource.findByPk(resource_id);
    }
}
