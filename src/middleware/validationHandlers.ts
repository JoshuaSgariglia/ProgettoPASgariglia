import { ZodType } from "zod";
import { ErrorType } from "../utils/enums";
import { LoginPayloadSchema, validate } from "../utils/schemas";
import { Request, Response, NextFunction } from "express";

/**
 * Creates an Express middleware that validates input from a specified request part
 * using a Zod schema. If validation fails, it passes the error to next().
 */
const validationHandlerGenerator = <T>(
    schema: ZodType<T>,
    source: "body" | "query" | "params" = "body",
    defaultInvalidError: ErrorType = ErrorType.InvalidPayload,
    defaultMissingError: ErrorType = ErrorType.MissingPayload
) => (req: Request, res: Response, next: NextFunction) => {
    const input = req[source];
    const result = validate(schema, input, defaultInvalidError, defaultMissingError);

    if (result.success) {
        // Attach validated data to reponse.locals
        res.locals.validated = result.data;
        next();
    } else {
        next(result.error);
    }
};

export const loginPayloadHandler = validationHandlerGenerator(LoginPayloadSchema)