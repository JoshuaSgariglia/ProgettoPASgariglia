import { CalendarConfig, SlotRequestConfig, UserConfig } from "./config";
import { ErrorType, RequestStatus, UserRole } from "./enums";
import { z, ZodType } from 'zod';
import { ErrorResponse } from "./responses/errorResponses";
import { ErrorFactory } from "./factories/errorFactory";
import { inputStringToDate, isDateValid } from "./misc";



// === Validate ===
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
		const firstIssue = result.error.issues[0]
		const issueField = firstIssue.path[0] as string

		console.log(firstIssue)

		// Default error
		let message: string = firstIssue.message
		let response: ErrorResponse = ErrorFactory.getError(ErrorType.InvalidPayload, message);

		// Custom error based on first Zod reposted issue
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

// === Schemas ===

// Custom validation rules

// Datetime that forces minutes and seconds to zero
// Reusable factory for datetime schemas
function createDatetimeSchema({ format, regex, errorMessage }: {
	format: string;
	regex: RegExp;
	errorMessage: string;
}) {
	return z
		.string()
		.regex(regex, { message: `Datetime must be in format ${format} (${errorMessage})` })
		.refine((str) => {
			return isDateValid(inputStringToDate(str))
		}, {
			message: "Invalid date (e.g. month > 12, day > 31, etc.)"
		})
		.transform((str) => inputStringToDate(str));
}

// Define specific schemas
export const datetimeHourStringSchema = createDatetimeSchema({
	format: "YYYY-MM-DD HH:00",
	regex: /^\d{4}-\d{2}-\d{2} \d{2}:00$/,
	errorMessage: "minutes and seconds must be zero"
});

export const datetimeStringSchema = createDatetimeSchema({
	format: "YYYY-MM-DD HH:mm",
	regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
	errorMessage: "seconds must be zero"
});


// --- TokenPayload ---
// Schema
export const TokenPayloadSchema = z.object({
	uuid: z.string(),
	role: z.enum(UserRole),
});

// Type
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

// --- UUIDParameter ---
export const UUIDParameterSchema = z.object({
	id: z.uuid(),
}).strict();

// --- LoginPayload ---
// Schema
export const LoginPayloadSchema = z.object({
	username: z.string().trim(),
	password: z.string().trim(),
}).strict();

// Type
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;


// --- UserPayload ---
// Schema
export const UserPayloadSchema = z.object({
	username: z.string().trim().min(UserConfig.MIN_USERNAME_LENGTH).max(UserConfig.MAX_USERNAME_LENGTH),
	password: z.string().trim().min(UserConfig.MIN_PASSWORD_LENGTH).max(UserConfig.MAX_PASSWORD_LENGTH),
	email: z.string().trim().check(z.email()).max(UserConfig.MAX_EMAIL_LENGTH).toLowerCase(),
	name: z.string().trim().min(UserConfig.MIN_NAME_LENGTH).max(UserConfig.MAX_NAME_LENGTH),
	surname: z.string().trim().min(UserConfig.MIN_SURNAME_LENGTH).max(UserConfig.MAX_SURNAME_LENGTH),
	role: z.enum(UserRole).optional(),
	tokenAmount: z.int().min(UserConfig.MIN_TOKEN_AMOUNT).max(UserConfig.MAX_TOKEN_AMOUNT).optional()
}).strict();

// Type
export type UserPayload = z.infer<typeof UserPayloadSchema>;


// --- CalendarCreationPayload ---
// Schema
export const CalendarCreationPayloadSchema = z.object({
	resource: z.uuid(),
	name: z.string().trim().min(CalendarConfig.MIN_NAME_LENGTH).max(CalendarConfig.MAX_NAME_LENGTH),
	tokenCostPerHour: z.int().min(CalendarConfig.MIN_TOKEN_COST_PER_HOUR).max(CalendarConfig.MAX_TOKEN_COST_PER_HOUR).optional()
}).strict();

// Type
export type CalendarCreationPayload = z.infer<typeof CalendarCreationPayloadSchema>;


// --- CalendarUpdatePayload ---
// Schema
export const CalendarUpdatePayloadSchema = CalendarCreationPayloadSchema.partial();

// Type
export type CalendarUpdatePayload = z.infer<typeof CalendarUpdatePayloadSchema>;


// --- SlotRequestPayload ---
// Schema
export const SlotRequestPayloadSchema = z.object({
	calendar: z.uuid(),
	title: z.string().trim().min(SlotRequestConfig.MIN_TITLE_LENGTH).max(SlotRequestConfig.MAX_TITLE_LENGTH),
	reason: z.string().trim().min(SlotRequestConfig.MIN_REASON_LENGTH).max(SlotRequestConfig.MAX_REASON_LENGTH),
	datetimeStart: datetimeHourStringSchema,
	datetimeEnd: datetimeHourStringSchema,
}).strict()
	// Ensure datetimeEnd is after datetimeStart
	.refine((data) => data.datetimeEnd > data.datetimeStart, {
		message: "datetimeEnd must be after datetimeStart",
		path: ["datetimeEnd"],
	})
	// Ensure datetimeStart is at least 24 hours in the future
	.refine((data) => {
		const now = new Date();
		const minStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
		return data.datetimeStart >= minStart;
	}, {
		message: "datetimeStart must be at least 24 hours from now",
		path: ["datetimeStart"],
	});

// Types
export type SlotRequestPayload = z.infer<typeof SlotRequestPayloadSchema>;

export type SlotRequestCreationData = SlotRequestPayload & {
	user: string;
	status: RequestStatus;
};


// --- RequestStatusAndCreationPayload ---
// Schema
export const RequestStatusAndCreationPayloadSchema = z.object({
	status: z.enum(RequestStatus).optional(),
	datetimeCreatedFrom: datetimeStringSchema.optional(),
	datetimeCreatedTo: datetimeStringSchema.optional()
}).strict()
	// Ensure datetimeCreatedTo is after datetimeCreatedFrom
	.refine((data) => {
		if (data.datetimeCreatedFrom && data.datetimeCreatedTo) {
			return data.datetimeCreatedTo > data.datetimeCreatedFrom;
		}
		return true; // Skip validation if either is missing
	}, {
		message: "datetimeCreatedTo must be after datetimeCreatedFrom",
		path: ["datetimeCreatedTo"],
	});

// Type
export type RequestStatusAndCreationPayload = z.infer<typeof RequestStatusAndCreationPayloadSchema>;


// --- RequestApprovalPayload ---
// Schema
export const RequestApprovalPayloadSchema = z
	.object({
		approved: z.boolean(),
		refusalReason: z
			.string()
			.trim()
			.min(SlotRequestConfig.MIN_REFUSAL_REASON_LENGTH)
			.max(SlotRequestConfig.MAX_REFUSAL_REASON_LENGTH)
			.optional(),
	}).strict()
	// Ensure that refusal is present when approved === false
	.refine(
		(data) => {
			return data.approved || data.refusalReason !== undefined;
		},
		{
			message: "refusalReason is required when approved is false",
			path: ["refusalReason"],
		}
	)
	// Ensure that refusal is omitted when approved === true
	.refine(
		(data) => {
			return !data.approved || data.refusalReason === undefined;
		},
		{
			message: "refusalReason must be omitted when approved is true",
			path: ["refusalReason"],
		}
	)

// Type
export type RequestApprovalPayload = z.infer<typeof RequestApprovalPayloadSchema>;


// --- CheckSlotPayload ---
// Schema
export const CheckSlotPayloadSchema = z.object({
	calendar: z.uuid(),
	datetimeStart: datetimeHourStringSchema,
	datetimeEnd: datetimeHourStringSchema,
}).strict()
	// Ensure datetimeEnd is after datetimeStart
	.refine((data) => data.datetimeEnd > data.datetimeStart, {
		message: "datetimeEnd must be after datetimeStart",
		path: ["datetimeEnd"],
	});

// Type
export type CheckSlotPayload = z.infer<typeof CheckSlotPayloadSchema>;


// --- RequestStatusAndCreationPayload ---
// Schema
export const RequestStatusAndPeriodPayloadSchema = z.object({
	calendar: z.uuid().optional(),
	status: z.enum(RequestStatus).optional(),
	datetimeStart: datetimeHourStringSchema.optional(),
	datetimeEnd: datetimeHourStringSchema.optional()
}).strict()
	// Ensure datetimeEnd is after datetimeStart
	.refine((data) => {
		if (data.datetimeStart && data.datetimeEnd) {
			return data.datetimeEnd > data.datetimeStart;
		}
		return true; // Skip validation if either is missing
	}, {
		message: "datetimeEnd must be after datetimeStart",
		path: ["datetimeEnd"],
	});

// Type
export type RequestStatusAndPeriodPayload = z.infer<typeof RequestStatusAndPeriodPayloadSchema>;
