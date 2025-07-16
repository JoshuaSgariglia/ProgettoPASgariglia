import { SlotRequest } from "../models/SlotRequest";

/*
 * This file includes interfaces used in the application.
 * The interfaces are used in controllers\services to define
 * the structure of the response data object in some app requests.
*/

export interface SlotRequestCreationInfo {
    request: SlotRequest;
    requestCost: number;
    remainingTokens: number;
};

export interface SlotRequestDeletionInfo {
    request: SlotRequest;
    tokenCostPerHour: number;
    tokenPenalty: number;
    unusedHours: number;
    totalHours: number;
    refundedTokens: number;
    remainingTokens: number;
};

export interface CalendarSlotInfo {
    calendar_id: string;
    datetimeStart: Date;
    datetimeEnd: Date;
    available: boolean;
};

export interface UserTokenUpdateInfo {
    user_id: string;
    oldTokenAmount: number;
    newTokenAmount: number;
};