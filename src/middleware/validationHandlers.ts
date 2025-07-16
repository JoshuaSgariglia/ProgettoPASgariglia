import { ZodType } from "zod";
import { InputSource } from "../utils/enums";
import {
    CalendarCreationPayloadSchema,
    CalendarUpdatePayloadSchema,
    CheckSlotPayloadSchema,
    LoginPayloadSchema,
    RequestApprovalPayloadSchema,
    RequestStatusAndCreationPayloadSchema,
    RequestStatusAndPeriodPayloadSchema,
    SlotRequestPayloadSchema,
    UserPayloadSchema,
    UserRechargePayloadSchema,
    UUIDParameterSchema} from "../utils/validation/schemas";
import { validate } from "../utils/validation/validate";
import { Request, Response, NextFunction } from "express";

/**
 * This file includes the middleware handlers for the validation of URL params and body payloads.
*/

// --- Validation handler generator ---

/**
 * Generator of handlers that validate input data from a specified source using a Zod schema.
 * It is possible to validate the input data only if present (set "payloadOptional" to true).
 * If validation fails, it passes the error to the error handlers.
 */
const validationHandlerGenerator = <T>(
    schema: ZodType<T>,
    source: InputSource = InputSource.BODY,
    payloadOptional: boolean = false
) => (req: Request, res: Response, next: NextFunction): void => {
    console.log("Entering validation middleware");

    // Validate the input data based on the schema
    const result = validate(schema, req[source], payloadOptional);
    
    console.log("Exiting validation middleware")
    
    if (result.success) {
        // Attach validated data to "res.locals"
        res.locals.validated = result.data;
        next();

    } else {
        next(result.error);
    }
};

// --- Generated handlers ---

// Validates UUID parameters in URL paths (e.g. "/calendar/:id", used in many routes)
export const uuidParameterHandler = validationHandlerGenerator(UUIDParameterSchema, InputSource.PARAMS);

// Validates login payload structure (route /login POST in publicRoutes.ts)
export const loginPayloadHandler = validationHandlerGenerator(LoginPayloadSchema);

// Validates user registration payload (route /user POST in adminRoutes.ts)
export const userPayloadHandler = validationHandlerGenerator(UserPayloadSchema);

// Validates calendar creation payload (route /calendar POST in adminRoutes.ts)
export const calendarCreationPayloadHandler = validationHandlerGenerator(CalendarCreationPayloadSchema);

// Validates calendar update payload (route /calendar/:id PUT in adminRoutes.ts)
export const calendarUpdatePayloadHandler = validationHandlerGenerator(CalendarUpdatePayloadSchema);

// Validates slot request creation payload (route /request POST in userRoutes.ts)
export const slotRequestPayloadHandler = validationHandlerGenerator(SlotRequestPayloadSchema);

// Validates request status and creation date range filters (route /requests-status GET in userRoutes.ts)
export const requestStatusAndCreationPayloadHandler = validationHandlerGenerator(
  RequestStatusAndCreationPayloadSchema,
  InputSource.BODY,
  true
);

// Validates request approval payload (route /request-status/:id PATCH in adminRoutes.ts)
export const requestApprovalPayloadHandler = validationHandlerGenerator(RequestApprovalPayloadSchema);

// Validates input for checking calendar slot availability (route /calendar-slot GET in userRoutes.ts)
export const checkSlotPayloadHandler = validationHandlerGenerator(CheckSlotPayloadSchema);

// Validates request calendar, status and period filters (route /requests GET in userRoutes.ts)
export const requestStatusAndPeriodPayloadHandler = validationHandlerGenerator(
  RequestStatusAndPeriodPayloadSchema,
  InputSource.BODY,
  true
);

// Validates user token recharge payload (e.g., PATCH /user/:id/tokens in adminRoutes.ts)
export const userRechargePayloadHandler = validationHandlerGenerator(
  UserRechargePayloadSchema,
  InputSource.BODY,
  true
);