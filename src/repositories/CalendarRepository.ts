import { Transaction } from "sequelize";
import { Calendar } from "../models/Calendar";
import { CalendarCreationPayload } from "../utils/validation/schemas";

/**
 * Repository class for the Calendar model.
 * Provides higher-level methods to interact with the Calendar model.
 */
export class CalendarRepository {
    
    // Creates and saves a new calendar record to the database
    public async add(calendarPayload: CalendarCreationPayload): Promise<Calendar> {
        return await Calendar.create(calendarPayload);
    }

    // Retrieves a calendar by its UUID
    public async getById(calendar_id: string): Promise<Calendar | null> {
        return await Calendar.findByPk(calendar_id);
    }

    // Retrieves an active (not archived) calendar by its resource UUID
    public async getByResourceId(resource_id: string): Promise<Calendar | null> {
        return await Calendar.findOne({
            where: {
                resource: resource_id,
                isArchived: false,
            }
        });
    }

    // Retrieves an active (not archived) calendar by its NAME
    public async getByName(name: string): Promise<Calendar | null> {
        return await Calendar.findOne({
            where: {
                name: name,
                isArchived: false,
            }
        });
    }
}

