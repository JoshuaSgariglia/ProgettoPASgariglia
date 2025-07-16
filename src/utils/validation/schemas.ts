import { CalendarConfig, SlotRequestConfig, UserConfig } from "../config";
import { RequestStatus, UserRole } from "../enums";
import { z } from 'zod';
import { datetimeHourStringSchema, datetimeStringSchema } from "./schemasUtils";
import logger from "../logger";

/**
 * This file defines validation schemas and corresponding inferred types
 * for all payloads used in the application. It ensures that input data
 * is structured correctly, with clear constraints and custom error messages.
 */

// === Schemas and inferred types ===

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


// --- UserRechargePayload ---
// Schema
export const UserRechargePayloadSchema = z.object({
	newTokenAmount: z.int().min(UserConfig.MIN_TOKEN_AMOUNT).max(UserConfig.MAX_TOKEN_AMOUNT).optional()
}).strict();

// Type
export type UserRechargePayload = z.infer<typeof UserRechargePayloadSchema>;

logger.info('Schemas and inferred types loaded successfully');