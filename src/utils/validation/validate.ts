import { ZodType } from "zod";
import { ErrorType } from "../enums";
import { ErrorFactory } from "../factories/errorFactory";
import { ErrorResponse } from "../responses/errorResponses";

/**
 * This file includes the validate function, which uses a Zod schema to validate some input data.
 * First, it checks if the input is present (unless marked optional), then validates and parses the data.
 * If the validation fails, it returns an error based on the issue type.
 * On success, it returns the validated and parsed data.
 */


// === Validate function ===
export function validate<T>(
	schema: ZodType<T>,
	input: unknown,
	payloadOptional: boolean = false
) {

	// If payload is optional...
	if (!payloadOptional) {
		// ...check for null, undefined, or empty object - If it is, return error
		const isEmptyObject = typeof input === 'object' && Object.keys(input!).length === 0;
		if (input === null || input === undefined || isEmptyObject) {
			return { success: false, error: ErrorType.MissingPayload };
		}
	}

	// Validate the input according to the schema
	const result = schema.safeParse(input);

	// Check if validation was successful
	if (!result.success) {
		// Extract the ErrorTypes provided in the schema from the first issue
		const firstIssue = result.error.issues[0];
		const issueField = firstIssue.path[0] as string;

		console.log(firstIssue);

		// Default error
		let message: string = firstIssue.message;
		let response: ErrorResponse = ErrorFactory.getError(ErrorType.InvalidPayload, message);

		// Custom error based on first Zod reposted issue (factory pattern)
		switch (firstIssue.code) {
			case 'unrecognized_keys':
				message = firstIssue.message;
				response = ErrorFactory.getError(ErrorType.UnrecognizedInputField, message);
				break;

			case 'invalid_type':
				const receivedType = firstIssue.message.split(' ').pop();
				if (receivedType === "undefined") {
					message = `Missing ${issueField} field`;
					response = ErrorFactory.getError(ErrorType.MissingInputField, message);
				} else {
					message = `Invalid ${issueField} type: Expected ${firstIssue.expected}, received ${receivedType}`;
					response = ErrorFactory.getError(ErrorType.InvalidInputType, message);
				}
				break;

			case 'invalid_value':
				message = `Invalid ${issueField} value - ${firstIssue.message}`;
				response = ErrorFactory.getError(ErrorType.InvalidInputValue, message);
				break;

			case 'invalid_format':
				message = `Invalid ${issueField} format: ${firstIssue.message}`;
				response = ErrorFactory.getError(ErrorType.InvalidInputFormat, message);
				break;

			case 'too_big':
				if (firstIssue.message.toLowerCase().includes('characters')) {
					message = `${issueField} is too long - ${firstIssue.message}`;
					response = ErrorFactory.getError(ErrorType.InputValueTooLong, message);
				} else {
					message = `${issueField} value is too big - ${firstIssue.message}`;
					response = ErrorFactory.getError(ErrorType.InputValueTooBig, message);
				}
				break;

			case 'too_small':
				if (firstIssue.message.toLowerCase().includes('characters')) {
					message = `${issueField} is too short - ${firstIssue.message}`;
					response = ErrorFactory.getError(ErrorType.InputValueTooShort, message);
				} else {
					message = `${issueField} value is too small - ${firstIssue.message}`;
					response = ErrorFactory.getError(ErrorType.InputValueTooSmall, message);
				}
				break;

			case 'custom':
				message = firstIssue.message;
				response = ErrorFactory.getError(ErrorType.InvalidInputValue, message);
				break;
		}


		return { success: false, error: response };
	}

	return { success: true, data: result.data };
}
