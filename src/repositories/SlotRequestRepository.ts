import { Op, Transaction } from "sequelize";
import { SlotRequest } from "../models/SlotRequest";
import { SlotRequestCreationData } from "../utils/schemas";
import { RequestStatus } from "../utils/enums";

export class SlotRequestRepository {
    public async getById(request_id: string): Promise<SlotRequest | null> {
        return await SlotRequest.findByPk(request_id);
    }

    public async getRequestsInPeriod(
    calendar_id: string,
    datetimeStart: Date,
    datetimeEnd: Date,
    status?: RequestStatus // Status is optional
): Promise<SlotRequest[]> {
    const whereClause: any = {
        "calendar": calendar_id,
        [Op.not]: {
            [Op.or]: [
                { "datetimeEnd": { [Op.lte]: datetimeStart } }, // Ends before this slot starts
                { "datetimeStart": { [Op.gte]: datetimeEnd } }, // Starts after this slot ends
            ],
        },
    };

    // Conditionally add status if provided
    if (status !== undefined) {
        whereClause["status"] = status;
    }

    return await SlotRequest.findAll({
        where: whereClause,
    });
}

    public async add(requestData: SlotRequestCreationData, transaction?: Transaction): Promise<SlotRequest> {
        return await SlotRequest.create(requestData, transaction ? { transaction } : {});
    }

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
                "datetimeEnd": { [Op.gte]: datetime }, // Ends after the datetime
            }
        });
    }

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
