import { Transaction } from "sequelize";
import { Calendar } from "../models/Calendar";
import { SlotRequest } from "../models/SlotRequest";
import { User } from "../models/User";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import { UserRepository } from "../repositories/UserRepository";
import { withTransaction } from "../utils/connector/transactionDecorator";
import { ErrorType, RequestStatus } from "../utils/enums";
import { CheckSlotPayload, RequestStatusAndCreationPayload, RequestStatusAndPeriodPayload, SlotRequestCreationData, SlotRequestPayload } from "../utils/validation/schemas";
import { CalendarSlotInfo, RequestStatusInfo, SlotRequestCreationInfo, SlotRequestDeletionInfo } from "../utils/interfaces";
import { hoursDiff } from "../utils/datetimeUtils";
import { SlotRequestConfig } from "../utils/config";

/**
 * Service with business logic, orchestrator between controller and repositories.
 * Requires all repository objects except ComputingResourceRepository, passed through dependency injection.
 * Throws ErrorType instances in case of domain-specific errors.
 * Used exclusively by UserController.
*/
export class UserService {
	constructor(
		private userRepository: UserRepository,
		private calendarRepository: CalendarRepository,
		private slotRequestRepository: SlotRequestRepository
	) { }

	// === Main methods ===

	/**
	 * Creates a new slot request. 
	 * Uses a SlotRequestPayload instance to create the request.
	 * If successful, returns the newly created request.
	*/
	public async createSlotRequest(user_id: string, slotRequestPayload: SlotRequestPayload): Promise<SlotRequestCreationInfo> {
		// Throws error if calendar does not exist or if it is archived
		const calendar: Calendar = await this.getCalendarIfExistsAndNotArchived(slotRequestPayload.calendar);

		// Get intersecting requests
		const requests: SlotRequest[] = await this.slotRequestRepository.getRequestsInPeriod(
			slotRequestPayload.calendar,
			RequestStatus.Approved,
			slotRequestPayload.datetimeStart,
			slotRequestPayload.datetimeEnd,
		);

		// Check that there are no approved intersecting requests
		if (requests.length !== 0)
			throw ErrorType.CalendarSlotUnavailable;

		// Calculate cost
		const requestCost: number = hoursDiff(
			slotRequestPayload.datetimeStart, slotRequestPayload.datetimeEnd) * calendar.tokenCostPerHour;

		// Get user
		const user: User | null = await this.userRepository.getById(user_id);

		let slotRequest: SlotRequest;

		// The request will be pending if the user has enough tokens...
		if (user!.tokenAmount >= requestCost) {
			slotRequest = await withTransaction(async (transaction: Transaction) => {
				// Initialize SlotRequest creation data
				const slotRequestCreationData: SlotRequestCreationData = {
					...slotRequestPayload,
					user: user!.uuid,
					status: RequestStatus.Pending,
				};

				// Create SlotRequest
				slotRequest = await this.slotRequestRepository.add(slotRequestCreationData, transaction);

				// Decrement User tokenAmount
				await user!.decrement("tokenAmount", { by: requestCost, transaction })
				await user!.reload()

				return slotRequest;
			});

		} else { // ...otherwise it will be invalid
			// Initialize SlotRequest creation data
			const slotRequestCreationData: SlotRequestCreationData = {
				...slotRequestPayload,
				user: user!.uuid,
				status: RequestStatus.Invalid,
			};

			// Create SlotRequest
			slotRequest = await this.slotRequestRepository.add(slotRequestCreationData);
		}

		return { "request": slotRequest, "requestCost": requestCost, "remainingTokens": user!.tokenAmount }
	}

	/**
	 * Retrieves a list of information about the status of slot requests created by the user, 
	 * filtered by status and creation datetime. 
	 * Uses a RequestStatusAndCreationPayload instance to filter the requests.
	 * Returns the the filtered list of information about slot requests status.
	*/
	public async getRequestsByStatusAndCreation(user_id: string, slotRequestPayload: RequestStatusAndCreationPayload): Promise<RequestStatusInfo[]> {
		// Get list of requests that match the filters
		const requests: SlotRequest[] = await this.slotRequestRepository.getRequestsByStatusAndCreationPeriod(
			user_id,
			slotRequestPayload.status,
			slotRequestPayload.datetimeCreatedFrom,
			slotRequestPayload.datetimeCreatedTo
		);

		// Map the requests in a list of RequestStatusInfo
		const requestsStatusInfo: RequestStatusInfo[] = requests.map((r) => ({
			uuid: r.uuid,
			status: r.status,
			datetimeCreated: r.datetimeCreated,
			datetimeStart: r.datetimeStart,
		}));

		return requestsStatusInfo;
	}

	/*
	 * Deletes a slot request by its UUID, eventually refunding the user. 
	 * If successful, returns the deleted request and information on the refund and the remaining tokens.
	*/
	public async deleteSlotRequest(user_id: string, request_id: string): Promise<SlotRequestDeletionInfo> {
		// Throws error if request does not exist or if it is not owned by the user
		const request: SlotRequest = await this.getRequestIfExistsAndOwnedByUser(request_id, user_id);

		// Deny deletion if request is refused
		if (request.status === RequestStatus.Refused)
			throw ErrorType.RefusedRequestDeletion;

		// Get calendar
		const calendar: Calendar | null = await this.calendarRepository.getById(request.calendar);

		// Deny deletion if calendar is archived
		if (calendar!.isArchived)
			throw ErrorType.ArchivedRequestDeletion;

		// Get user
		const user: User | null = await this.userRepository.getById(user_id);

		// Calculate total request hours
		const totalHours: number = hoursDiff(request.datetimeStart, request.datetimeEnd)

		// No refund for invalid request, just deletion (because no tokens were paid in that case)
		if (request.status == RequestStatus.Invalid) {
			await withTransaction(async (transaction) => {
				await request.destroy({ transaction })
			})

			return {
				"request": request,
				"tokenCostPerHour": calendar!.tokenCostPerHour,
				"tokenPenalty": 0,
				"unusedHours": totalHours,
				"totalHours": totalHours,
				"refundedTokens": 0,
				"remainingTokens": user!.tokenAmount
			};

		} else { // Request is pending or approved

			// Get current datetime
			const now = new Date();

			// Determine number of unused hours and value of penalty
			let unusedHours: number;
			let penalty: number;

			if (now < request.datetimeStart) {
				// Entire request is unused
				unusedHours = totalHours;
				penalty = SlotRequestConfig.UNUSED_DELETION_PENALTY;
			} else if (now < request.datetimeEnd) {
				// Partially used
				unusedHours = Math.floor(hoursDiff(now, request.datetimeEnd));
				penalty = SlotRequestConfig.PARTIAL_USE_DELETION_PENALTY;
			} else {
				// Fully used
				throw ErrorType.FullyUsedRequestDeletion
			}

			// Calculate refund
			const refund = Math.max(0, unusedHours * calendar!.tokenCostPerHour - penalty);

			// Calculate new token amount
			const remainingTokens = user!.tokenAmount + refund

			// Transaction
			await withTransaction(async (transaction: Transaction) => {

				// Update user tokens
				await user!.increment("tokenAmount", { by: refund, transaction });
				await user!.reload()

				// Soft delete the request
				await request.destroy({ transaction });
			});

			return {
				"request": request,
				"tokenCostPerHour": calendar!.tokenCostPerHour,
				"tokenPenalty": penalty,
				"unusedHours": unusedHours,
				"totalHours": totalHours,
				"refundedTokens": refund,
				"remainingTokens": remainingTokens
			};
		}
	}

	/**
	 * Provides information on the availability of a certain time slot in a calendar. 
	 * Uses a CheckSlotPayload instance to verify the availability.
	 * If successful, returns information on the calendar slot availability.
	*/
	public async checkCalendarSlot(checkSlotPayload: CheckSlotPayload): Promise<CalendarSlotInfo> {
		// Throws error if calendar does not exist or if it is archived
		const calendar: Calendar = await this.getCalendarIfExistsAndNotArchived(checkSlotPayload.calendar);

		// Get intersecting requests
		const requests: SlotRequest[] = await this.slotRequestRepository.getRequestsInPeriod(
			calendar.uuid,
			RequestStatus.Approved,
			checkSlotPayload.datetimeStart,
			checkSlotPayload.datetimeEnd,
		);

		// Return info about the availability of the slot
		return {
			"calendar_id": calendar.uuid,
			"datetimeStart": checkSlotPayload.datetimeStart,
			"datetimeEnd": checkSlotPayload.datetimeEnd,
			"available": requests.length === 0
		}
	}

	/**
	 * Retrieves a list of requests created by the user, filtered by calendar, status and period. 
	 * Uses a RequestStatusAndPeriodPayload instance to filter the requests.
	 * If successful, returns the list of filtered requests.
	*/
	public async getRequestsByStatusAndPeriod(user_id: string, slotRequestPayload: RequestStatusAndPeriodPayload): Promise<SlotRequest[]> {
		if (slotRequestPayload.calendar)
			// Throws error if calendar does not exist or if it is archived
			await this.getCalendarIfExists(slotRequestPayload.calendar);

		// Return list of requests that match the filters
		return await this.slotRequestRepository.getRequestsInPeriod(
			slotRequestPayload.calendar,
			slotRequestPayload.status,
			slotRequestPayload.datetimeStart,
			slotRequestPayload.datetimeEnd,
			user_id
		);
	}

	// === Helper methods ===

	// Retrieve a Request by its UUID and by the user that created it, if it exists
	private async getRequestIfExistsAndOwnedByUser(request_id: string, user_id: string): Promise<SlotRequest> {
		// Search request by id
		const request: SlotRequest | null = await this.slotRequestRepository.getById(request_id);

		// Request does not exist or belongs to another user
		if (request === null || request.user !== user_id)
			throw ErrorType.SlotRequestNotFound; // Choosing not to let user know of other users' requests

		return request;
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

	// Retrieve a calendar by its UUID, if it exists and it's not archived
	private async getCalendarIfExistsAndNotArchived(calendar_id: string): Promise<Calendar> {
		// Search calendar by id
		const calendar: Calendar | null = await this.calendarRepository.getById(calendar_id);

		// Calendar does not exist or is archived
		if (calendar === null || calendar.isArchived)
			throw ErrorType.CalendarNotFound; // Choosing not to let user know the calendar is archived

		return calendar;
	}
}
