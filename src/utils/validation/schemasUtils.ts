import { z } from "zod";
import { isDateValid, inputStringToDate } from "../datetimeUtils";

/**
 * This file includes utility functions and reusable code for Zod schemas defined in "schemas.ts"
 */

// === Custom validation rules for schemas ===

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
			return isDateValid(inputStringToDate(str));
		}, {
			message: "Invalid date (e.g. month > 12, day > 31, etc.)"
		})
		.transform((str) => inputStringToDate(str));
}

// Generate specific schemas for datetimes
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