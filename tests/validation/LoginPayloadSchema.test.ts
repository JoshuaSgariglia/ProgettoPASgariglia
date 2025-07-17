import { LoginPayloadSchema } from '../../src/utils/validation/schemas';
import { validate } from '../../src/utils/validation/validate';
import { ErrorType } from '../../src/utils/enums'; 
import { ErrorResponse } from '../../src/utils/responses/errorResponses';

/**
 * This file includes unit tests on validation using LoginPayloadSchema
 */

describe('LoginPayloadSchema Unit Tests', () => {
    
    // === Valid payload ===
	test('Should pass because the input is valid', () => {
		const input = { username: 'user123', password: 'password' };
		const result = validate(LoginPayloadSchema, input);
		expect(result.success).toBe(true);
	});

	// === Missing payload ===
	test('Should fail because input is undefined', () => {
		const result = validate(LoginPayloadSchema, undefined);
		expect(result.success).toBe(false);
		expect(result.error).toBe(ErrorType.MissingPayload);
	});

	test('Should fail because input is null', () => {
		const result = validate(LoginPayloadSchema, null);
		expect(result.success).toBe(false);
		expect(result.error).toBe(ErrorType.MissingPayload);
	});

	test('Should fail because input is an empty object', () => {
		const result = validate(LoginPayloadSchema, {});
		expect(result.success).toBe(false);
		expect(result.error).toBe(ErrorType.MissingPayload);
	});

	// === Missing fields ===
	test('Should fail because username is missing', () => {
		const input = { password: 'password' };
		const result = validate(LoginPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.MissingInputField);
	});

	test('Should fail because password is missing', () => {
		const input = { username: 'user123' };
		const result = validate(LoginPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.MissingInputField);
	});

	// === Extra field ===
	test('Should fail because an extra field is present', () => {
		const input = { username: 'user123', password: 'password', extra: 'notAllowed' };
		const result = validate(LoginPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.UnrecognizedInputField);
	});

	// === Invalid types ===
	test('Should fail because username is not a string', () => {
		const input = { username: 12345, password: 'password' };
		const result = validate(LoginPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputType);
	});

	test('Should fail because password is not a string', () => {
		const input = { username: 'user123', password: true };
		const result = validate(LoginPayloadSchema, input);
		expect(result.success).toBe(false);
		expect((result.error as ErrorResponse).getErrorType()).toBe(ErrorType.InvalidInputType);
	});
});