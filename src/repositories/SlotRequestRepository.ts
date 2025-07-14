import { Op, Transaction } from "sequelize";
import { SlotRequest } from "../models/SlotRequest";
import { SlotRequestCreationData, SlotRequestPayload } from "../utils/schemas";
import { RequestStatus } from "../utils/enums";

export class SlotRequestRepository {
    public async getById(request_id: string): Promise<SlotRequest | null> {
        console.log(request_id);
        return await SlotRequest.findByPk(request_id);
    }

    public async getActiveRequestsInPeriod(
        calendar_id: string,
        status: RequestStatus,
        datetimeStart: Date,
        datetimeEnd: Date
    ): Promise<SlotRequest[]> {
        return await SlotRequest.findAll({
            where: {
                "calendar": calendar_id,
                "status": status,
                [Op.not]: {
                    [Op.or]: [
                        { "datetimeEnd": { [Op.lte]: datetimeStart } }, // Ends before this slot starts
                        { "datetimeStart": { [Op.gte]: datetimeEnd } }, // Starts after this slot ends
                    ],
                },
            },
        });
    }

    public async add(requestData: SlotRequestCreationData, transaction?: Transaction): Promise<SlotRequest> {
        return await SlotRequest.create(requestData, transaction ? { transaction } : {});
    }

    public async getActiveRequestsAtDatetime(
        calendar_id: string,
        status: RequestStatus,
        datetime: Date
    ): Promise<SlotRequest[]> {
        return await SlotRequest.findAll({
            where: {
                calendar: calendar_id,
                status,
                datetimeStart: { [Op.lte]: datetime }, // Starts before the datetime
                datetimeEnd: { [Op.gte]: datetime }, // Ends after the datetime
            }
        });
    }



}
