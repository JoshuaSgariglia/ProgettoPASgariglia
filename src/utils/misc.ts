import { SlotRequest } from "../models/SlotRequest";

// Calculates the difference in hours between two dates
export function hoursDiff(datetimeStart: Date, datetimeEnd: Date): number {
    const diffInMs = datetimeEnd.getTime() - datetimeStart.getTime(); // Milliseconds
    return diffInMs / (1000 * 60 * 60);    // Convert to hours
}

export interface SlotRequestCreationInfo {
    request: SlotRequest;
    requestCost: number;
    remainingTokens: number;
};