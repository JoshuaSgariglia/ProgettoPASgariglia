import { UserConfig } from "./config";
import { ErrorType, UserRole } from "./enums";
import { z, ZodType } from 'zod';
import { ErrorResponse } from "./responses/errorResponses";
import { ErrorFactory } from "./factories/errorFactory";



// === Validate ===
export function validate<T>(
  schema: ZodType<T>,
  input: unknown,
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
    const issuePath = firstIssue.path[0] as string

    // Default error
    let message: string = firstIssue.message
    let response: ErrorResponse = ErrorFactory.getError(ErrorType.InvalidPayload, message);

    // Custom error based on first Zod reposted issue
    switch (firstIssue.code) {
      case 'unrecognized_keys':
        message = firstIssue.message;
        response = ErrorFactory.getError(ErrorType.UnrecognizedInputKey, message)
        break;

      case 'invalid_type':
        message = `Invalid "${issuePath}" type: Expected ${firstIssue.expected}, received ${firstIssue.message.split(' ').pop()}`;
        response = ErrorFactory.getError(ErrorType.InvalidInputType, message)
        break;

      case 'invalid_value':
        message = `Invalid "${issuePath}" value: ${firstIssue.message}`;
        response = ErrorFactory.getError(ErrorType.InvalidInputValue, message)
        break;

      case 'invalid_format':
        message = `Invalid "${issuePath}" format: ${firstIssue.message}`;
        response = ErrorFactory.getError(ErrorType.InvalidInputFormat, message)
        break;

      case 'too_big':
        if (firstIssue.message.toLowerCase().includes('characters')) {
          message = `"${issuePath}" is too long: ${firstIssue.message}`;
          response = ErrorFactory.getError(ErrorType.InputValueTooLong, message)
        } else {
          message = `"${issuePath}" value is too big: ${firstIssue.message}`;
          response = ErrorFactory.getError(ErrorType.InputValueTooBig, message)
        }
        break;

      case 'too_small':
        if (firstIssue.message.toLowerCase().includes('characters')) {
          message = `"${issuePath}" is too short: ${firstIssue.message}`;
          response = ErrorFactory.getError(ErrorType.InputValueTooShort, message)
        } else {
          message = `"${issuePath}" value is too small: ${firstIssue.message}`;
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
});

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
});

// Type
export type UserPayload = z.infer<typeof UserPayloadSchema>;