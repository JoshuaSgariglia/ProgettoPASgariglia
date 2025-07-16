import { Request, Response, NextFunction } from "express";
import { ErrorType, UserRole } from "../utils/enums";
import jwt, { NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { TokenPayload, TokenPayloadSchema } from "../utils/validation/schemas";
import { PUBLIC_KEY, SIGNING_ALGORITHM } from "../utils/config";
import logger from "../utils/logger";

/**
 * This file includes the middleware handlers for the authentication and authorization of users.
 * The handlers are in the order in which they are called.
*/

// --- Auth validation functions ---

/**
 * Checks that the authentication header is present.
 * Throws MissingAuthorizationHeader if the authorization header is missing.
*/
function checkAuthHeader(req: Request, res: Response, next: NextFunction) {
    logger.info("Entering authentication middleware")
    
    const authHeader: string | undefined = req.headers.authorization;

    // Check whether authHeader is undefined
    if (authHeader) {
        next();
    } else {
        next(ErrorType.MissingAuthorizationHeader);
    }
};

/**
 * Checks that the authentication type is the expected one.
 * Throws InvalidAuthorizationType if the authorization type is not Bearer token.
*/
function checkAuthType(req: Request, res: Response, next: NextFunction) {
    // authHeader is not undefined thanks to checkAuthHeader
    const authHeader: string = req.headers.authorization!;

    // Split the auth header content
    const authHeaderSplit: string[] = authHeader.split(' ');

    // Bearer token is expected
    if (authHeaderSplit.length === 2 && authHeaderSplit[0] === 'Bearer') {
        // Save Bearer token
        res.locals.token = authHeaderSplit[1];
        next();
    } else {
        next(ErrorType.InvalidAuthorizationType);
    }
}

/**
 * Verifies that the token is valid and not expired.
 * Throws TokenExpiredError if the token is expired.
 * Throws NotBeforeError if the token is not activated.
 * Throws InvalidToken if the token is invalid (e.g. wrong signature).
*/
function verifyToken(req: Request, res: Response, next: NextFunction) {
    // Try block - verify token signature
    try {
        // res.locals.token is not undefined thanks to checkAuthType
        res.locals.tokenPayload = jwt.verify(res.locals.token, PUBLIC_KEY, { algorithms: [SIGNING_ALGORITHM] });
        next();

    // Catch block - throw an error
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            next(ErrorType.TokenExpired);
        }

        // To prevent the abuse by bots
        else if (err instanceof NotBeforeError) {
            next(ErrorType.TokenNotActivated);
        }

        else {
            next(ErrorType.InvalidToken);
        }
    }

}

/**
 * Verifies that the provided token payload is valid using a schema (Zod validation library).
 * Throws InvalidTokenPayload if the token is invalid.
*/
function verifyTokenPayload(req: Request, res: Response, next: NextFunction) {
    // Check that tokenPayload is of type UserPayload
    const result = TokenPayloadSchema.safeParse(res.locals.tokenPayload);

    // If valid, save the payload, else throw and error
    if (result.success) {
        res.locals.tokenPayload = result.data;
        next();

    } else {
        next(ErrorType.InvalidTokenPayload);
    }

}

/**
 * Generator of functions that verify that the user is authorized.
 * Expects a UserRole to generate a function that performs the authorization check.
 * Throws InsufficientPermissions if the user role is different from the required one.
*/
const verifyAuthorizationGenerator = (requiredRole: UserRole) =>
    (req: Request, res: Response, next: NextFunction): void => {
        // tokenPayload is of type TokenPayload thanks to verifyTokenPayload
        const tokenPayload = res.locals.tokenPayload as TokenPayload;
        
        logger.info("Exiting authentication middleware")

        // Check role authorization
        if (tokenPayload.role === requiredRole) {
            next();
        } else {
            next(ErrorType.InsufficientPermissions);
        }
    };


// --- Auth validation chains ---

// Generator of validation chains
export const getAuthHandlers = (requiredRole: UserRole) => [checkAuthHeader, checkAuthType, verifyToken, verifyTokenPayload, verifyAuthorizationGenerator(requiredRole)];

// Generated validation chains for User and Admin roles
export const userAuthHandlers = getAuthHandlers(UserRole.User);     // used in userRoutes.ts (set in app.ts)
export const adminAuthHandlers = getAuthHandlers(UserRole.Admin);   // used in adminRoutes.ts (set in app.ts)

