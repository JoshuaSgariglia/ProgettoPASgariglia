import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken'

declare module 'express-serve-static-core' {
    interface Request {
        token?: string;
        tokenPayload?: string | JwtPayload;
        user?: {uuid: string, role: string};
    }
}