import { Request, Response, NextFunction } from "express";
import { ErrorType, UserRole } from "../utils/enums";
import jwt, { NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { TokenPayload, TokenPayloadSchema } from "../utils/schemas";
import { PUBLIC_KEY, SIGNING_ALGORITHM } from "../utils/config";


function checkAuthHeader(req: Request, res: Response, next: NextFunction) {
    console.log("Entered authentication middleware")
    const authHeader = req.headers.authorization;

    if (authHeader) {
        next();
    } else {
        next(ErrorType.MissingAuthorizationHeader);
    }
};

function checkAuthType(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // authHeader is not undefined thanks to checkAuthHeader
    const authHeaderSplit: string[] = authHeader!.split(' ');

    if (authHeaderSplit.length === 2 && authHeaderSplit[0] === 'Bearer') {
        // Save Bearer token
        res.locals.token = authHeaderSplit[1];
        next();
    } else {
        next(ErrorType.InvalidAuthorizationType);
    }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        // res.locals.token is not undefined thanks to checkAuthType
        res.locals.tokenPayload = jwt.verify(res.locals.token, PUBLIC_KEY, { algorithms: [SIGNING_ALGORITHM] });
        next();
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

function verifyTokenPayload(req: Request, res: Response, next: NextFunction) {
    let tokenPayload = res.locals.tokenPayload;

    // Check that tokenPayload is of type UserPayload
    const result = TokenPayloadSchema.safeParse(tokenPayload);
    if (result.success) {
        res.locals.tokenPayload = result.data;
        next();

    } else {
        next(ErrorType.InvalidTokenPayload);
    }

}

const verifyAuthorizationGenerator = (requiredRole: UserRole) =>
    (req: Request, res: Response, next: NextFunction): void => {
        // tokenPayload is of type TokenPayload thanks to verifyTokenPayload
        const tokenPayload = res.locals.tokenPayload as TokenPayload;

        // Check role authorization
        if (tokenPayload.role === requiredRole) {
            next();
        } else {
            next(ErrorType.InsufficientPermissions);
        }

    };

export const getAuthHandlers = (requiredRole: UserRole) => [checkAuthHeader, checkAuthType, verifyToken, verifyTokenPayload, verifyAuthorizationGenerator(requiredRole)];

