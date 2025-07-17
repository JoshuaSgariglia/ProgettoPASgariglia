
/**
 * This file includes some utility functions for datetime usage\formatting.
*/

import { ErrorType } from "./enums";
import logger from "./logger";

// Checks whether a Date instance is valid
export function isDateValid(date: Date): boolean {
    return !isNaN(date.getTime());
}

// Calculates the difference in hours between two dates
export function hoursDiff(datetimeStart: Date, datetimeEnd: Date): number {
    if (!isDateValid(datetimeStart) || !isDateValid(datetimeEnd))
        throw ErrorType.InternalServerError;

    const diffInMs = datetimeEnd.getTime() - datetimeStart.getTime(); // Milliseconds
    return diffInMs / (1000 * 60 * 60); // Convert to hours
}

// Converts a standard API input date string to the date format
export function inputStringToDate(dateString: string): Date {
    return new Date(dateString.replace(" ", "T") + ":00");
}

// Converts a Date object to the a standard API input date string
export const formatDateToString = (date: Date): string => {
    if (!isDateValid(date))
        throw ErrorType.InternalServerError;

	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:00`;
};


logger.info('Datetime utility functions loaded successfully');


