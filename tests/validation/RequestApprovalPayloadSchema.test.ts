import { RequestApprovalPayloadSchema } from '../../src/utils/validation/schemas';
import { validate } from '../../src/utils/validation/validate';
import { ErrorType } from '../../src/utils/enums'; 
import { ErrorResponse } from '../../src/utils/responses/errorResponses';
import { SlotRequestConfig } from '../../src/utils/config';

/**
 * This file includes unit tests on validation using RequestApprovedPayloadSchema
 */

describe('RequestApprovalPayloadSchema Unit Tests', () => {
	const validApproval = { approved: true };
	const validRefusal = {
		approved: false,
		refusalReason: 'Not enough available resources',
	};

	// === Valid cases ===
	test('Should pass because the input is valid (approval)', () => {
		const result = validate(RequestApprovalPayloadSchema, validApproval);
		expect(result.success).toBe(true);
	});

	test('Should pass because the input is valid (refusal)', () => {
		const result = validate(RequestApprovalPayloadSchema, validRefusal);
		expect(result.success).toBe(true);
	});

	// === Missing payload ===
	test('Should fail because input is undefined', () => {
		const result = validate(RequestApprovalPayloadSchema, undefined);
		expect(result.success).toBe(false);
		expect(result.error).toBe(ErrorType.MissingPayload);
	});

	test('Should fail because input is null', () => {
		const result = validate(RequestApprovalPayloadSchema, null);
		expect(result.success).toBe(false);
		expect(result.error).toBe(ErrorType.MissingPayload);
	});

	test('Should fail because input is an empty object', () => {
		const result = validate(RequestApprovalPayloadSchema, {});
		expect(result.success).toBe(false);
		expect(result.error).toBe(ErrorType.MissingPayload);
	});

    // === Extra field ===
	test('Should fail because an extra field is present', () => {
		const input = { ...validApproval, extra: 'notAllowed' };
		const result = validate(RequestApprovalPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.UnrecognizedInputField);
	});

	// === Type errors ===
	test('Should fail because approved is not a boolean', () => {
		const input = { approved: 'yes' };
		const result = validate(RequestApprovalPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputType);
	});

	test('Should fail because refusal reason is not a string', () => {
		const input = { approved: false, refusalReason: 123 };
		const result = validate(RequestApprovalPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputType);
	});

	// === Length validation for refusalReason ===
	test('Should fail because refusal reason is too short', () => {
		const input = { approved: false, refusalReason: '' };
		const result = validate(RequestApprovalPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InputValueTooShort);
	});

	test('Should fail because refusal reason is too long', () => {
		const input = {
			approved: false,
			refusalReason: 'A'.repeat(SlotRequestConfig.MAX_REFUSAL_REASON_LENGTH + 1),
		};
		const result = validate(RequestApprovalPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InputValueTooLong);
	});

    // === Additional constraints ===
	test('Should fail because refusal reason is missing when refused in false', () => {
		const input = { approved: false };
		const result = validate(RequestApprovalPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputValue);
	});

	test('Should fail because refusal reason is present when approved is true', () => {
		const input = { approved: true, refusalReason: 'Not needed' };
		const result = validate(RequestApprovalPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputValue);
	});
});