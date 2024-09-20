import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class CorsMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // res.header('Access-Control-Allow-Origin', 'http://swipeupstories-localdev.com'); // Replace with your domain or '*' for all origins
        res.header('Access-Control-Allow-Origin', 'https://swipeupstories.com'); // Replace with your domain or '*' for all origins
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add any additional HTTP methods your API supports
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Add any additional headers your API accepts
        next();
    }
}
