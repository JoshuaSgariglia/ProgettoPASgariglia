import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { CalendarCreationPayload, CalendarUpdatePayload, RequestApprovalPayload, UserPayload } from "../utils/schemas";
import { genSalt, hash } from "bcrypt-ts";
import { ErrorType, RequestStatus } from "../utils/enums";
import { SALT_ROUNDS } from "../utils/config";
import { Calendar } from "../models/Calendar";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { ComputingResourceRepository } from "../repositories/ComputingResourceRepository";
import { ComputingResource } from "../models/ComputingResource";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import { SlotRequest } from "../models/SlotRequest";
import { getTransaction, withTransaction } from "../utils/connector/transactionDecorator";

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

        // Delete calendar - transaction is for cascading soft delete
        await withTransaction(async (transaction) => {
            await calendar.destroy({ transaction });
        });

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


    public async updateRequestStatus(request_id: string, requestApprovalPayload: RequestApprovalPayload): Promise<SlotRequest> {
        // Throws an error if the calendar is nonexistent
        const request: SlotRequest = await this.getRequestIfExists(request_id);

        if (requestApprovalPayload.approved) {
            if (request.status === RequestStatus.Approved)
                return request;

            // Need to check if there are already approved requests in the same calendar and time period
            // Get intersecting approved requests in the same calendar
            const requests: SlotRequest[] = await this.slotRequestRepository.getRequestsInPeriod(
                request.calendar,
                RequestStatus.Approved,
                request.datetimeStart,
                request.datetimeEnd,
            );

            // Throw an error if there are approved intersecting requests
            if (requests.length !== 0)
                throw ErrorType.IntersectingRequests;

            // Update Request status to Approved
            return await request.update({ "status": RequestStatus.Approved, "refusalReason": null })

        } else {
            if (request.status === RequestStatus.Refused)
                return request
                
            // Update Request status to Refused
            return await request.update({ "status": RequestStatus.Refused, "refusalReason":  requestApprovalPayload.refusalReason })
        }
    }

    // Get the satus of all requests by calendar
    public async getRequestsByCalendar(calendar_id: string) {
        // Throws an error if the calendar is nonexistent
        await this.getCalendarIfExists(calendar_id);

        return await this.slotRequestRepository.getRequestsInPeriod(calendar_id);
    }


    // === Helper functions ===

    // Checks ongoing requests
    private async checkOngoingRequests(calendar_id: string): Promise<void> {
        // Search for active requests
        const requests: SlotRequest[] = await this.slotRequestRepository.getRequestsAtDatetime(
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

    private async getRequestIfExists(request_id: string): Promise<SlotRequest> {
        // Search request by id
        const request: SlotRequest | null = await this.slotRequestRepository.getById(request_id);

        // Request does not exist
        if (request === null)
            throw ErrorType.SlotRequestNotFound;

        return request;
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