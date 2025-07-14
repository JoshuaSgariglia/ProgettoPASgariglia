import { ZodType } from "zod";
import { InputSource } from "../utils/enums";
import { LoginPayloadSchema, UserPayloadSchema, validate } from "../utils/schemas";
import { Request, Response, NextFunction } from "express";

/**
 * Creates an Express middleware that validates input from a specified request part
 * using a Zod schema. If validation fails, it passes the error to next().
 */
const validationHandlerGenerator = <T>(
    schema: ZodType<T>,
    source: InputSource = InputSource.BODY
) => (req: Request, res: Response, next: NextFunction): void => {
    console.log("Entering validation middleware");
    const result = validate(schema, req[source]);

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
export const loginPayloadHandler = validationHandlerGenerator(LoginPayloadSchema);
export const userPayloadHandler = validationHandlerGenerator(UserPayloadSchema);