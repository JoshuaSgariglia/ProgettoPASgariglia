import { Op, Transaction } from "sequelize";
import { SlotRequest } from "../models/SlotRequest";
import { SlotRequestCreationData, SlotRequestPayload } from "../utils/schemas";
import { RequestStatus } from "../utils/enums";

export class SlotRequestRepository {
    public async getById(request_id: string): Promise<SlotRequest | null> {
        console.log(request_id);
        return await SlotRequest.findByPk(request_id);
    }

    public async getPeriodIntersectingRequests(
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
                        { "datetimeEnd": { [Op.lte]: datetimeStart } }, // ends before this slot starts
                        { "datetimeStart": { [Op.gte]: datetimeEnd } }, // starts after this slot ends
                    ],
                },
            },
        });
    }

    public async add(requestData: SlotRequestCreationData, transaction?: Transaction): Promise<SlotRequest> {
        return await SlotRequest.create(requestData, transaction ? { transaction } : {});
    }

    public async getDatetimeIntersectingRequests(
        calendar_id: string, 
        status: RequestStatus,
        datetime: Date
    ): Promise<SlotRequest[]> {
        return await SlotRequest.findAll({
            where: {
                "calendar": calendar_id,
                "status": status,
                [Op.and]: [
                        { "datetimeEnd": { [Op.gte]: datetime } }, // ends after the datetime
                        { "datetimeStart": { [Op.lte]: datetime } }, // starts before the datetime
                ],
            },
        });
    }



}
