
/**
 * This file includes some utility functions for datetime usage\formatting.
*/

// Calculates the difference in hours between two dates
export function hoursDiff(datetimeStart: Date, datetimeEnd: Date): number {
    const diffInMs = datetimeEnd.getTime() - datetimeStart.getTime(); // Milliseconds
    return diffInMs / (1000 * 60 * 60); // Convert to hours
}
// Converts a standard API input date string to the date format

export function inputStringToDate(dateString: string): Date {
    return new Date(dateString.replace(" ", "T") + ":00");
}
// Checks whether a Date instance is valid

export function isDateValid(date: Date): boolean {
    return !isNaN(date.getTime());
}
