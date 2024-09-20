import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService{
    checkTokenService(token: string){
        return checkToken(token);
    };

    getUserIdService(token: string){
        return getUserId(token);
    }
};

export function checkToken(token: string){
    try {
        const jwt_verify = jwt.verify(token, process.env.JWT_KEY);
        if (Object.keys(jwt_verify).length > 0){
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }  
};

export function getUserId(token: string){
    try {
        const jwt_verify = jwt.verify(token, process.env.JWT_KEY);
        if (Object.keys(jwt_verify).length == 0){
            return false;
        } else {
            return jwt_verify['user_id'];
        }
    } catch (e) {
        return false;
    }  
}