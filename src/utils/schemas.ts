import { CalendarConfig, UserConfig } from "./config";
import { ErrorType, UserRole } from "./enums";
import { z, ZodType } from 'zod';
import { ErrorResponse } from "./responses/errorResponses";
import { ErrorFactory } from "./factories/errorFactory";



// === Validate ===
export function validate<T>(
  schema: ZodType<T>,
  input: unknown
) {

  // Check for null, undefined, or empty object - If it is, return error
  const isEmptyObject = typeof input === 'object' && Object.keys(input!).length === 0;
  if (input === null || input === undefined || isEmptyObject) {
    return { success: false, error: ErrorType.MissingPayload };
  }

  // Else, it validates the input according to the schema
  const result = schema.safeParse(input);

  // Check if validation was successful
  if (!result.success) {
    // Extract the ErrorTypes provided in the schema from the first issue
    const firstIssue = result.error.issues[0]
    const issueField = firstIssue.path[0] as string

    // Default error
    let message: string = firstIssue.message
    let response: ErrorResponse = ErrorFactory.getError(ErrorType.InvalidPayload, message);

    // Custom error based on first Zod reposted issue
    switch (firstIssue.code) {
      case 'unrecognized_keys':
        message = firstIssue.message;
        response = ErrorFactory.getError(ErrorType.UnrecognizedInputField, message)
        break;

      case 'invalid_type':
        const receivedType = firstIssue.message.split(' ').pop();
        if (receivedType === "undefined") {
          message = `Missing ${issueField} field`;
          response = ErrorFactory.getError(ErrorType.MissingInputField, message)
        } else {
          message = `Invalid ${issueField} type: Expected ${firstIssue.expected}, received ${receivedType}`;
          response = ErrorFactory.getError(ErrorType.InvalidInputType, message)
        }
        break;

      case 'invalid_value':
        message = `Invalid ${issueField} value - ${firstIssue.message}`;
        response = ErrorFactory.getError(ErrorType.InvalidInputValue, message)
        break;

      case 'invalid_format':
        message = `Invalid ${issueField} format: ${firstIssue.message}`;
        response = ErrorFactory.getError(ErrorType.InvalidInputFormat, message)
        break;

      case 'too_big':
        if (firstIssue.message.toLowerCase().includes('characters')) {
          message = `${issueField} is too long - ${firstIssue.message}`;
          response = ErrorFactory.getError(ErrorType.InputValueTooLong, message)
        } else {
          message = `${issueField} value is too big - ${firstIssue.message}`;
          response = ErrorFactory.getError(ErrorType.InputValueTooBig, message)
        }
        break;

      case 'too_small':
        if (firstIssue.message.toLowerCase().includes('characters')) {
          message = `${issueField} is too short - ${firstIssue.message}`;
          response = ErrorFactory.getError(ErrorType.InputValueTooShort, message)
        } else {
          message = `${issueField} value is too small - ${firstIssue.message}`;
          response = ErrorFactory.getError(ErrorType.InputValueTooSmall, message)
        }
        break;
    }


    return { success: false, error: response };
  }

  return { success: true, data: result.data };
}

// === Schemas ===

// --- Custom Validation Rules ---
const rangedString = (min: number, max: number) => z.string().trim().min(min).max(max);
const rangedInt = (min: number, max: number) => z.int().min(min).max(max);


// --- TokenPayload ---
// Schema
export const TokenPayloadSchema = z.object({
  uuid: z.string(),
  role: z.enum(UserRole),
});

// Type
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;


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
  resource: z.string().trim(),
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