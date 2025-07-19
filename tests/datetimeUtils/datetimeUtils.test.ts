import { hoursDiff, inputStringToDate, isDateValid, formatDateToString } from '../../src/utils/datetimeUtils';
import { ErrorType } from '../../src/utils/enums';

/**
 * This file includes unit tests on datetimeUtils.ts functions
 */

describe('Datetime Utils Unit Tests', () => {

    // === isDateValid ===
    describe('isDateValid', () => {
        test('Should return true for a valid date', () => {
            const date = new Date('2025-07-17T10:00:00');
            expect(isDateValid(date)).toBe(true);
        });

        test('Should return false for an invalid date', () => {
            const invalid = new Date('invalid');
            expect(isDateValid(invalid)).toBe(false);
        });
    });

    // === hoursDiff ===
    describe('hoursDiff', () => {
        test('Should return 2 hours difference', () => {
            const start = new Date('2025-07-17T10:00:00');
            const end = new Date('2025-07-17T12:00:00');
            expect(hoursDiff(start, end)).toBe(2);
        });

        test('Should return negative if end is before start', () => {
            const start = new Date('2025-07-17T14:00:00');
            const end = new Date('2025-07-17T12:00:00');
            expect(hoursDiff(start, end)).toBe(-2);
        });

        test('Should handle fractional hours', () => {
            const start = new Date('2025-07-17T10:30:00');
            const end = new Date('2025-07-17T12:00:00');
            expect(hoursDiff(start, end)).toBe(1.5);
        });

        test('Should throw InternalServerError if datetimeStart is invalid', () => {
            const invalidStart = new Date('invalid');
            const validEnd = new Date('2025-07-20T12:00:00');
            expect(() => hoursDiff(invalidStart, validEnd)).toThrow(ErrorType.InternalServerError);
        });
    });

    test('Should throw InternalServerError if datetimeEnd is invalid', () => {
        const validStart = new Date('2025-07-17T10:30:00');
        const invalidEnd = new Date('invalid');
        expect(() => hoursDiff(validStart, invalidEnd)).toThrow(ErrorType.InternalServerError);
    });


    test('Should throw InternalServerError if both datetimes are invalid', () => {
        const invalidStart = new Date('invalid');
        const invalidEnd = new Date('invalid');
        expect(() => hoursDiff(invalidStart, invalidEnd)).toThrow(ErrorType.InternalServerError);
    });

    // === inputStringToDate ===
    describe('inputStringToDate', () => {
        test('Should convert "2025-07-17 09:00" to a valid datetime', () => {
            const date = inputStringToDate('2025-07-17 09:00');
            expect(date instanceof Date).toBe(true);
            expect(date.toLocaleString()).toBe('17/07/2025, 09:00:00');
        });

        test('Should add ":00" seconds', () => {
            const date = inputStringToDate('2025-07-17 23:45');
            expect(date.toLocaleString()).toBe('17/07/2025, 23:45:00');
        });
    });

    // === formatDateToString ===
    describe('formatDateToString', () => {
        test('Should format date as "YYYY-MM-DD HH:00"', () => {
            const date = new Date('2025-07-17T09:00:00');
            expect(formatDateToString(date)).toBe('2025-07-17 09:00');
        });

        test('Should throw InternalServerError if date is invalid', () => {
		const invalidDate = new Date('invalid');
		expect(() => formatDateToString(invalidDate)).toThrow(ErrorType.InternalServerError);
	});
    });

    // === inputStringtoDate + formatDateToString combinations ===
    describe('formatDateToString', () => {
        test('Should obtain the initial string', () => {
            const datetimeString = '2025-07-17 09:00';
            expect(formatDateToString(inputStringToDate(datetimeString))).toBe(datetimeString);
        });

        test('Should obtain the initial date', () => {
            const date = new Date('2025-07-17T09:00:00');
            expect(inputStringToDate(formatDateToString(date))).toEqual(date);
        });

        test('Should throw InternalServerError if date is invalid', () => {
		const invalidDate = new Date('invalid');
		expect(() => formatDateToString(invalidDate)).toThrow(ErrorType.InternalServerError);
	});
    });

});