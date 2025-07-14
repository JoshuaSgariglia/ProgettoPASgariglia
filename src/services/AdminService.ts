import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { CalendarCreationPayload, CalendarUpdatePayload, UserPayload } from "../utils/schemas";
import { genSalt, hash } from "bcrypt-ts";
import { ErrorType, RequestStatus } from "../utils/enums";
import { SALT_ROUNDS } from "../utils/config";
import { Calendar } from "../models/Calendar";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { ComputingResourceRepository } from "../repositories/ComputingResourceRepository";
import { ComputingResource } from "../models/ComputingResource";
import { Transaction } from "sequelize";
import { withTransaction } from "../utils/connector/transactionDecorator";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import { SlotRequest } from "../models/SlotRequest";

export class AdminService {
    constructor(
        private userRepository: UserRepository, 
        private calendarRepository: CalendarRepository, 
        private slotRequestRepository: SlotRequestRepository,
        private computingResourceRepository: ComputingResourceRepository
    ) { }

    public async createUser(userPayload: UserPayload): Promise<User> {
        // Search user by username or email
        const user: User | null = await this.userRepository.getByUsernameOrEmail(userPayload.username, userPayload.email);

        // User does not exist
        if (user === null) {
            // Generate salt
            const salt = await genSalt(SALT_ROUNDS);

            console.log("Generated salt")

            // Hash and salt password
            userPayload.password = await hash(userPayload.password, salt);

            console.log("Hashed password")

            // Create new User
            return await this.userRepository.add(userPayload);

        // User already exists
        } else if (user.username === userPayload.username) {
            throw ErrorType.UsernameAlreadyInUse;

        } else {
            throw ErrorType.EmailAlreadyInUse;
        }
    }

    public async createCalendar(calendarPayload: CalendarCreationPayload): Promise<Calendar> {
        // Throws errors if the resource is nonexistent or unavailable
        await this.checkResourceAvailability(calendarPayload.resource)

        // Create calendar
        return await this.calendarRepository.add(calendarPayload);
    }

    public async updateCalendar(calendar_id: string, calendarPayload: CalendarUpdatePayload): Promise<Calendar> {
        // Throws an error if the calendar is nonexistent
        const calendar: Calendar = await this.getCalendarIfExists(calendar_id)

        // Check also that the calendar is not archived
        if (calendar.isArchived)
            throw ErrorType.CalendarArchived;

        // Check if resource needs updating
        if (calendarPayload.resource !== undefined && calendarPayload.resource !== calendar.resource) {
            // Throws errors if the resource is nonexistent or unavailable
            await this.checkResourceAvailability(calendarPayload.resource)
        }

        // Check if name needs updating
        if (calendarPayload.name !== undefined && calendarPayload.name !== calendar.name) {
            // Throw error if the name is already taken
            const calendar: Calendar | null = await this.calendarRepository.getByName(calendarPayload.name)

            // Calendar with that name already exists
            if (calendar !== null)
                throw ErrorType.CalendarNameAlreadyInUse;
        }

        // Update calendar
        return await calendar.update(calendarPayload)
    }

    public async getCalendar(calendar_id: string): Promise<Calendar> {
        // Throws an error if the calendar is nonexistent
        return await this.getCalendarIfExists(calendar_id);
    }

    public async deleteCalendar(calendar_id: string): Promise<Calendar> {
        // Throws an error if the calendar is nonexistent
        const calendar: Calendar = await this.getCalendarIfExists(calendar_id);
      
        // Throws an error if there are ongoing requests
        await this.checkOngoingRequests(calendar_id)

        // Delete calendar
        await calendar.destroy();

        return calendar;
    }

    public async archiveCalendar(calendar_id: string): Promise<Calendar> {
        // Throws an error if the calendar is nonexistent
        const calendar: Calendar = await this.getCalendarIfExists(calendar_id);

        // Throws an error if there are ongoing requests
        await this.checkOngoingRequests(calendar_id)

        // Update calendar
        return await calendar.update({ "isArchived": true })
    }


    // === Helper functions ===

    // Checks ongoing requests
    private async checkOngoingRequests(calendar_id: string): Promise<void> {
        // Search for active requests
        const requests: SlotRequest[] = await this.slotRequestRepository.getDatetimeIntersectingRequests(
            calendar_id,
            RequestStatus.Approved,
            new Date()
        );

        // There are active ongoing requests
        if (requests.length !== 0)
            throw ErrorType.OngoingRequests;
    }

    private async getCalendarIfExists(calendar_id: string): Promise<Calendar> {
        // Search calendar by id
        const calendar: Calendar | null = await this.calendarRepository.getById(calendar_id);

        // Calendar does not exist
        if (calendar === null)
            throw ErrorType.CalendarNotFound;

        return calendar;
    }

    private async getResourceIfExists(resource_id: string): Promise<ComputingResource> {
        // Search resource by id
        const resource: ComputingResource | null = await this.computingResourceRepository.getById(resource_id);

        // Resource does not exist
        if (resource === null)
            throw ErrorType.ComputingResourceNotFound;

        return resource;
    }

    // Checks if the resource is existent and available
    private async checkResourceAvailability(resource_id: string): Promise<ComputingResource> {
        // Check if the resource exists
        const resource: ComputingResource = await this.getResourceIfExists(resource_id);

        // Check if resource is already being used by a calendar that is not archived
        const calendar: Calendar | null = await this.calendarRepository.getByResourceId(resource_id);

        // Resource is already in use
        if (calendar !== null)
            throw ErrorType.ComputingResourceUnavailable;

        return resource;
    }

}