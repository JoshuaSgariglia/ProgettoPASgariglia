import { Request, Response, NextFunction } from "express";
import { ErrorType, UserRole } from "../utils/enums";
import jwt, { NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { TokenPayload, TokenPayloadSchema } from "../utils/schemas";
import { PUBLIC_KEY, SIGNING_ALGORITHM } from "../utils/config";


function checkAuthHeader(req: Request, res: Response, next: NextFunction) {
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
        req.token = authHeaderSplit[1];
        next();
    } else {
        next(ErrorType.InvalidAuthorizationType);
    }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        // req.token is not undefined thanks to checkAuthType
        let tokenPayload = jwt.verify(req.token!, PUBLIC_KEY, { algorithms: [SIGNING_ALGORITHM] });
        req.tokenPayload = tokenPayload;
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
    let tokenPayload = req.tokenPayload;
    // Check that tokenPayload is not undefined
    if (tokenPayload) {
        // Check that tokenPayload is of type UserPayload
        const result = TokenPayloadSchema.safeParse(tokenPayload);
        if (result.success) {
            req.tokenPayload = result.data;
            next();

        } else {
            next(ErrorType.InvalidTokenPayload);
        }

    } else {
        next(ErrorType.MissingTokenPayload);
    }
}

export const verifyAuthorizationGenerator = (requiredRole: UserRole) =>
    (req: Request, res: Response, next: NextFunction): void => {
        // tokenPayload is of type TokenPayload thanks to verifyTokenPayload
        const tokenPayload = req.tokenPayload as TokenPayload;

        if (tokenPayload.role === requiredRole) {
            next();
        } else {
            next(ErrorType.InsufficientPermissions);
        }

    };

const getAuthHandlers = (requiredRole: UserRole) => [checkAuthHeader, checkAuthType, verifyToken, verifyTokenPayload, verifyAuthorizationGenerator(requiredRole)];