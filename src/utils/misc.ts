import { SlotRequest } from "../models/SlotRequest";

// Calculates the difference in hours between two dates
export function hoursDiff(datetimeStart: Date, datetimeEnd: Date): number {
    const diffInMs = datetimeEnd.getTime() - datetimeStart.getTime(); // Milliseconds
    return diffInMs / (1000 * 60 * 60);    // Convert to hours
}

// Converts a standard API input date string to the date format
export function inputStringToDate(dateString: string): Date {
    return new Date(dateString.replace(" ", "T") + ":00");
}

export function isDateValid(date: Date) {
    return !isNaN(date.getTime());
}


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