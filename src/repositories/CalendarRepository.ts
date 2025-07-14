import { Transaction } from "sequelize";
import { Calendar } from "../models/Calendar";
import { CalendarCreationPayload } from "../utils/schemas";

export class CalendarRepository {
    public async add(calendarPayload: CalendarCreationPayload): Promise<Calendar> {
        return await Calendar.create(calendarPayload);
    }

    public async getById(calendar_id: string): Promise<Calendar | null> {
        return await Calendar.findByPk(calendar_id);
    }

    public async getByResourceId(resource_id: string): Promise<Calendar | null> {
        return await Calendar.findOne({ where: { "resource": resource_id, "isArchived": false } });
    }

    public async getByName(name: string): Promise<Calendar | null> {
        return await Calendar.findOne({ where: { "name": name, "isArchived": false } });
    }
}
