import { UserConfig } from "./config";
import { ErrorType, UserRole } from "./enums";
import { z, ZodType } from 'zod';



// === Validate ===
export function validate<T>(
  schema: ZodType<T>, 
  input: unknown, 
  defaultInvalidError: ErrorType = ErrorType.InvalidPayload, 
  defaultMissingError: ErrorType = ErrorType.MissingPayload
) {

  // Check for null, undefined, or empty object - If it is, return error
  const isEmptyObject = typeof input === 'object' && Object.keys(input!).length === 0;
  if (input === null || input === undefined || isEmptyObject) {
    return { success: false, error: defaultMissingError };
  }

  // Else, it validates the input according to the schema
  const result = schema.safeParse(input);

  // Check if validation was successful
  if (!result.success) {
    // Extract the ErrorTypes provided in the schema from the first issue
    const firstIssueMessage = result.error.issues[0].message
    const isCustomError = Object.values(ErrorType).includes(firstIssueMessage as ErrorType);
    const error = isCustomError ? firstIssueMessage as ErrorType : defaultInvalidError;

    return { success: false, error: error };
  }

  return { success: true, data: result.data };
}

// === Schemas ===

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