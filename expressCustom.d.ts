import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken'
import { TokenPayload } from './src/utils/schemas';

declare module 'express-serve-static-core' {
    interface Request {
        token?: string;
        tokenPayload?: string | JwtPayload | TokenPayload;
    }
}