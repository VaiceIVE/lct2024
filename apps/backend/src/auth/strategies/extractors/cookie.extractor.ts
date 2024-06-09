import { Request } from 'express';


export function cookieExtractorJwt(req: Request) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

export function cookieExtractorRefresh(req: Request) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt-refresh'];
    }
    return token;
};