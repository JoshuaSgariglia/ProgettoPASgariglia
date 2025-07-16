import { Op, Transaction } from "sequelize";
import { SlotRequest } from "../models/SlotRequest";
import { SlotRequestCreationData } from "../utils/schemas";
import { RequestStatus } from "../utils/enums";

/*
 * Repository class for the SlotRequest model.
 * Provides higher-level methods to interact with the SlotRequest model.
 */
export class SlotRequestRepository {

    // Retrieves a slot request by its UUID
    public async getById(request_id: string): Promise<SlotRequest | null> {
        return await SlotRequest.findByPk(request_id);
    }

    // Retrieves slot requests that match optional filters:
    // calendar ID, status, time range (start and end), and user ID
    public async getRequestsInPeriod(
        calendar_id?: string,
        status?: RequestStatus,
        datetimeStart?: Date,
        datetimeEnd?: Date,
        user_id?: string
    ): Promise<SlotRequest[]> {
        const whereClause: any = {};

        // Filter by calendar if provided
        if (calendar_id) {
            whereClause.calendar = calendar_id;
        }

        // Filter by status if provided
        if (status) {
            whereClause.status = status;
        }

        // Filter by user if provided
        if (user_id) {
            whereClause.user = user_id;
        }

        // Apply datetime filtering based on provided values
        if (datetimeStart && datetimeEnd) {
            // Overlapping condition: exclude requests that end before start or start after end
            whereClause[Op.not] = {
                [Op.or]: [
                    { datetimeEnd: { [Op.lte]: datetimeStart } }, // Ends before this slot starts
                    { datetimeStart: { [Op.gte]: datetimeEnd } }, // Starts after this slot ends
                ],
            };
        } else if (datetimeStart) {
            // Only filter requests that end after the provided start
            whereClause.datetimeEnd = { [Op.gt]: datetimeStart };
        } else if (datetimeEnd) {
            // Only filter requests that start before the provided end
            whereClause.datetimeStart = { [Op.lt]: datetimeEnd };
        }

        return await SlotRequest.findAll({
            where: whereClause,
        });
    }

    // Creates a new slot request in the database, optionally within a transaction
    public async add(requestData: SlotRequestCreationData, transaction?: Transaction): Promise<SlotRequest> {
        return await SlotRequest.create(requestData, transaction ? { transaction } : {});
    }

    // Retrieves all requests for a calendar by status and datetime
    public async getRequestsAtDatetime(
        calendar_id: string,
        status: RequestStatus,
        datetime: Date
    ): Promise<SlotRequest[]> {
        return await SlotRequest.findAll({
            where: {
                "calendar": calendar_id,
                "status": status,
                "datetimeStart": { [Op.lte]: datetime }, // Starts before the datetime
                "datetimeEnd": { [Op.gte]: datetime },   // Ends after the datetime
            }
        });
    }

    // Retrieves all requests for a user that match optional status and creation date range
    public async getRequestsByStatusAndCreationPeriod(
        user_id: string,
        status?: RequestStatus,
        datetimeCreatedFrom?: Date,
        datetimeCreatedTo?: Date
    ): Promise<SlotRequest[]> {
        const whereClause: any = {
            "user": user_id
        };

        // Status filter
        if (status) {
            whereClause.status = status;
        }

        // Creation time period filter
        if (datetimeCreatedFrom || datetimeCreatedTo) {
            whereClause.datetimeCreated = {};
            if (datetimeCreatedFrom) {
                // Get requests created after datetimeCreatedFrom
                whereClause.datetimeCreated[Op.gte] = datetimeCreatedFrom;
            }
            if (datetimeCreatedTo) {
                // Get requests created before datetimeCreatedTo
                whereClause.datetimeCreated[Op.lte] = datetimeCreatedTo;
            }
        }

        return await SlotRequest.findAll({
            where: whereClause,
        });
    }
}
