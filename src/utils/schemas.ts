import { UserRole } from "./enums";
import { z } from 'zod';

// TokenPayload

// Schema
export const TokenPayloadSchema = z.object({
  uuid: z.string(),
  role: z.enum(UserRole),
});

// Type
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;