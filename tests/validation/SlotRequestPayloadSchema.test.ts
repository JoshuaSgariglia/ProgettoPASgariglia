import { SlotRequestPayloadSchema } from '../../src/utils/validation/schemas';
import { validate } from '../../src/utils/validation/validate';
import { ErrorType } from '../../src/utils/enums';
import { ErrorResponse } from '../../src/utils/responses/errorResponses';
import { formatDateToString } from '../../src/utils/datetimeUtils';

/**
 * This file includes unit tests on validation using SlotRequestPayloadSchema
 */

describe('SlotRequestPayloadSchema Unit Tests', () => {
    const validInput = {
        calendar: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Computer Vision project',
        reason: 'AI training for segmentation',
        datetimeStart: '2025-08-10 12:00',
        datetimeEnd: '2025-08-10 20:00',
    };

    // === Valid payload ===
    test('Should pass because the input is valid', () => {
        const result = validate(SlotRequestPayloadSchema, validInput);
        expect(result.success).toBe(true);
    });

    // === Missing payload ===
    test('Should fail because input is undefined', () => {
        const result = validate(SlotRequestPayloadSchema, undefined);
        expect(result.success).toBe(false);
        expect(result.error).toBe(ErrorType.MissingPayload);
    });

    test('Should fail because input is null', () => {
        const result = validate(SlotRequestPayloadSchema, null);
        expect(result.success).toBe(false);
        expect(result.error).toBe(ErrorType.MissingPayload);
    });

    test('Should fail because input is an empty object', () => {
        const result = validate(SlotRequestPayloadSchema, {});
        expect(result.success).toBe(false);
        expect(result.error).toBe(ErrorType.MissingPayload);
    });

    // === Missing fields ===
    test('Should fail because calendar is missing', () => {
        const { calendar, ...input } = validInput;
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.MissingInputField);
    });

    test('Should fail because title is missing', () => {
        const { title, ...input } = validInput;
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.MissingInputField);
    });

    test('Should fail because reason is missing', () => {
        const { reason, ...input } = validInput;
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.MissingInputField);
    });

    test('Should fail because datetimeStart is missing', () => {
        const { datetimeStart, ...input } = validInput;
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.MissingInputField);
    });

    test('Should fail because datetimeEnd is missing', () => {
        const { datetimeEnd, ...input } = validInput;
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.MissingInputField);
    });

    // === Extra field ===
    test('Should fail because an extra field is present', () => {
        const input = { ...validInput, extra: 'not allowed' };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.UnrecognizedInputField);
    });

    // === Invalid types ===
    test('Should fail because calendar is not a UUID', () => {
        const input = { ...validInput, calendar: 'not-a-uuid' };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputFormat);
    });

    test('Should fail because title is not a string', () => {
        const input = { ...validInput, title: 12345 };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputType);
    });

    test('Should fail because reason is not a string', () => {
        const input = { ...validInput, reason: false };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputType);
    });

    test('Should fail because datetimeStart is not a string', () => {
        const input = { ...validInput, datetimeStart: 123456 };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputType);
    });

    // === Length checks ===
    test('Should fail because title is too short', () => {
        const input = { ...validInput, title: '' };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InputValueTooShort);
    });

    test('Should fail because title is too long', () => {
        const input = { ...validInput, title: 'A'.repeat(300) };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InputValueTooLong);
    });

    test('Should fail because reason is too short', () => {
        const input = { ...validInput, reason: '' };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InputValueTooShort);
    });

    test('Should fail because reason is too long', () => {
        const input = { ...validInput, reason: 'A'.repeat(1000) };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InputValueTooLong);
    });

    // === Invalid datetime format / value ===
    test('Should fail because datetimeEnd has invalid format (missing space)', () => {
        const input = { ...validInput, datetimeEnd: '2025-08-10T12:00' };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputFormat);
    });

    test('Should fail because datetimeStart has invalid format (seconds are present)', () => {
        const input = { ...validInput, datetimeStart: '2025-08-10 09:00:00' };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputFormat);
    });

    test('Should fail because datetimeStart has invalid format (minutes are not zero)', () => {
        const input = { ...validInput, datetimeStart: '2025-08-10 09:30' };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputFormat);
    });

    test('Should fail because datetimeStart is not parseable (invalid values)', () => {
        const input = { ...validInput, datetimeStart: '2025-08-10 25:00' };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputValue);
    });

    // === Additional datetime constraints ===
    test('Should fail because datetimeEnd is before datetimeStart', () => {
        const input = {
            ...validInput,
            datetimeEnd: '2025-08-09 13:00', // < start
        };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputValue);
    });

    test('Should fail because datetimeStart is less than 24h from now', () => {
        const startSoon = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h from now
        const endSoon = new Date(startSoon.getTime() + 60 * 60 * 1000);

        const input = {
            ...validInput,
            datetimeStart: formatDateToString(startSoon),
            datetimeEnd: formatDateToString(endSoon),
        };
        const result = validate(SlotRequestPayloadSchema, input);
        expect(result.success).toBe(false);
        expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputValue);
    });
});