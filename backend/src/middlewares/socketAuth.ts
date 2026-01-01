import type { Socket } from "socket.io";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

type JwtPayload = {
    sub:string;
}

export function socketAuth() {
    return(socket:Socket,next: (err?: Error) => void) => {
        try{
            const cookieHeader = socket.handshake.headers.cookie;
            if(!cookieHeader) return next(new Error("Unauthorized"));

            const cookies = cookie.parse(cookieHeader);

            const accessToken = cookies.accessToken;
            if(!accessToken) return next (new Error("Unauthorized"));

            const secret= process.env.JWT_SECRET;
            if(!secret) return next (new Error("Server misconfiguration"));

            const payload = jwt.verify(accessToken,secret) as JwtPayload;
            if(!payload?.sub) return next (new Error("Unauthorized"));

            socket.data.userId= payload.sub;
            return next();
        } catch(err){
            return next (new Error("Unauthorized"));
        }
    };
}