import { UserConfig } from "./config";
import { ErrorType, UserRole } from "./enums";
import { z, ZodType } from 'zod';

// --- Validate ---
function validate(schema: ZodType, input: unknown, defaultError: ErrorType) {
  const result = schema.safeParse(input);

  if (!result.success) {
    const errors = result.error.issues.map((err: { message: any; path: any[]; }) => {
      const isCustomError = Object.values(ErrorType).includes(err.message as ErrorType);
      return isCustomError ? err.message : defaultError;
    });

    return { success: false, errors: errors };
  }

  return { success: true, data: result.data };
}

// --- Schemas ---

// TokenPayload

// Schema
export const TokenPayloadSchema = z.object({
  uuid: z.string(),
  role: z.enum(UserRole),
});

// Type
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;


// LoginPayload

// Schema
export const LoginPayloadSchema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
});

// Type
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;