import { ZodType } from "zod";
import { InputSource } from "../utils/enums";
import {
    CalendarCreationPayloadSchema,
    CalendarUpdatePayloadSchema,
    CheckSlotPayloadSchema,
    LoginPayloadSchema,
    RequestApprovalPayloadSchema,
    RequestStatusAndCreationPayloadSchema,
    SlotRequestPayloadSchema,
    UserPayloadSchema,
    UUIDParameterSchema,
    validate
} from "../utils/schemas";
import { Request, Response, NextFunction } from "express";

/**
 * Creates an Express middleware that validates input from a specified request part
 * using a Zod schema. If validation fails, it passes the error to next().
 */
const validationHandlerGenerator = <T>(
    schema: ZodType<T>,
    source: InputSource = InputSource.BODY,
    payloadOptional: boolean = false
) => (req: Request, res: Response, next: NextFunction): void => {
    console.log("Entering validation middleware");
    const result = validate(schema, req[source], payloadOptional);

    console.log("Exiting validation middleware")
    if (result.success) {
        // Attach validated data to reponse.locals
        res.locals.validated = result.data;
        next();
    } else {
        next(result.error);
    }
};

// Generated handlers
export const uuidParameterHandler = validationHandlerGenerator(UUIDParameterSchema, InputSource.PARAMS);
export const loginPayloadHandler = validationHandlerGenerator(LoginPayloadSchema);
export const userPayloadHandler = validationHandlerGenerator(UserPayloadSchema);
export const calendarCreationPayloadHandler = validationHandlerGenerator(CalendarCreationPayloadSchema);
export const calendarUpdatePayloadHandler = validationHandlerGenerator(CalendarUpdatePayloadSchema);
export const slotRequestPayloadHandler = validationHandlerGenerator(SlotRequestPayloadSchema);
export const requestStatusAndCreationPayloadHandler = validationHandlerGenerator(RequestStatusAndCreationPayloadSchema, InputSource.BODY, true);
export const requestApprovalPayloadHandler = validationHandlerGenerator(RequestApprovalPayloadSchema);
export const checkSlotPayloadHandler = validationHandlerGenerator(CheckSlotPayloadSchema);