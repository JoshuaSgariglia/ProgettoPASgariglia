import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { CalendarCreationPayload, CalendarUpdatePayload, RequestApprovalPayload, UserPayload, UserRechargePayload } from "../utils/schemas";
import { genSalt, hash } from "bcrypt-ts";
import { ErrorType, RequestStatus } from "../utils/enums";
import { SALT_ROUNDS, UserConfig } from "../utils/config";
import { Calendar } from "../models/Calendar";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { ComputingResourceRepository } from "../repositories/ComputingResourceRepository";
import { ComputingResource } from "../models/ComputingResource";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import { SlotRequest } from "../models/SlotRequest";
import { withTransaction } from "../utils/connector/transactionDecorator";
import { UserTokenUpdateInfo } from "../utils/misc";

/*
 * Service with business logic, orchestrator between controller and repositories.
 * Requires all four repository objects, passed through dependency injection.
 * Throws ErrorType instances in case of domain-specific errors.
 * Used exclusively by AdminController.
*/
export class AdminService {
    constructor(
        private userRepository: UserRepository,
        private calendarRepository: CalendarRepository,
        private slotRequestRepository: SlotRequestRepository,
        private computingResourceRepository: ComputingResourceRepository
    ) { }

    // === Main methods ===

    /*
	 * Creates a new user. 
     * Uses a UserPayload instance to create the user.
	 * If successful, returns the newly created user.
	*/
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

    /*
	 * Creates a new calendar. 
     * Uses a CalendarCreationPayload instance to create the calendar.
	 * If successful, returns the newly created calendar.
	*/
    public async createCalendar(calendarPayload: CalendarCreationPayload): Promise<Calendar> {
        // Throws errors if the resource is nonexistent or unavailable
        await this.checkResourceAvailability(calendarPayload.resource)

        // Create calendar
        return await this.calendarRepository.add(calendarPayload);
    }

    /*
	 * Updates a calendar. 
     * Uses a CalendarUpdatePayload instance to update the calendar.
	 * If successful, returns the updated calendar.
	*/
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

    /*
	 * Retrieves a calendar by its UUID. 
	 * If successful, returns the found calendar.
	*/
    public async getCalendar(calendar_id: string): Promise<Calendar> {
        // Throws an error if the calendar is nonexistent
        return await this.getCalendarIfExists(calendar_id);
    }

    /*
	 * Deletes a calendar by its UUID. 
	 * If successful, returns the deleted calendar.
	*/
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

    /*
	 * Archives a calendar by its UUID. 
	 * If successful, returns the archived calendar.
	*/
    public async archiveCalendar(calendar_id: string): Promise<Calendar> {
        // Throws an error if the calendar is nonexistent
        const calendar: Calendar = await this.getCalendarIfExists(calendar_id);

        // Throws an error if there are ongoing requests
        await this.checkOngoingRequests(calendar_id)

        // Update calendar
        return await calendar.update({ "isArchived": true })
    }

    /*
	 * Updates the status of a request to either Approved or Refused. 
     * Uses a RequestApprovalPayload instance to update the status of the request.
	 * If successful, returns the request whose status was updated.
	*/
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

    /*
	 * Retrieves all the requests by their calendar UUID. 
	 * If successful, returns the list of filtered requests.
	*/
    public async getRequestsByCalendar(calendar_id: string) {
        // Throws an error if the calendar is nonexistent
        await this.getCalendarIfExists(calendar_id);

        // Only filters by calendar_id because all other parameters are undefined
        return await this.slotRequestRepository.getRequestsInPeriod(calendar_id);
    }

    /*
	 * Updates the amount of tokens a user possesses. 
     * Uses a UserRechargePayload instance to update the tokens of the user.
	 * If successful, returns information about the old and new token amounts.
	*/
    public async updateUserTokens(user_id: string, userRechargePayload: UserRechargePayload): Promise<UserTokenUpdateInfo> {
        // Throws an error if the user is nonexistent
        const user: User = await this.getUserIfExists(user_id);

        // Get current token amount
        const oldTokenAmount: number = user.tokenAmount;

        // Determine new token amount
        const newTokenAmount: number = userRechargePayload.newTokenAmount ?? UserConfig.INITIAL_TOKEN_AMOUNT;

        // Update tokenAmount
        await user.update({ "tokenAmount": newTokenAmount });

        return { user_id, oldTokenAmount, newTokenAmount };
    }


    // === Helper methods ===

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

    // Retrieve a user by its UUID, if it exists
    private async getUserIfExists(user_id: string): Promise<User> {
        // Search user by id
        const user: User | null = await this.userRepository.getById(user_id);

        // User does not exist
        if (user === null)
            throw ErrorType.UserNotFound;

        return user;
    }

    // Retrieve a calendar by its UUID, if it exists
    private async getCalendarIfExists(calendar_id: string): Promise<Calendar> {
        // Search calendar by id
        const calendar: Calendar | null = await this.calendarRepository.getById(calendar_id);

        // Calendar does not exist
        if (calendar === null)
            throw ErrorType.CalendarNotFound;

        return calendar;
    }

    // Retrieve a request by its UUID, if it exists
    private async getRequestIfExists(request_id: string): Promise<SlotRequest> {
        // Search request by id
        const request: SlotRequest | null = await this.slotRequestRepository.getById(request_id);

        // Request does not exist
        if (request === null)
            throw ErrorType.SlotRequestNotFound;

        return request;
    }

    // Retrieve a Resource by its UUID, if it exists
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
