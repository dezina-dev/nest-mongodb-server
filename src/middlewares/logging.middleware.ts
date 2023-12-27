import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';

// Configure Winston logger to log & generate log file
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logfile.log',
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
        }),
    ],
});

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const now = new Date().toLocaleString();
        const method = req.method;
        const url = req.originalUrl || req.url; // Use originalUrl to include parameters

        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;

            if (res.statusCode === 200 || res.statusCode === 201) {
                logger.info(`[${now}] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
            }

            if (res.statusCode >= 400 && res.statusCode < 500) {
                logger.warn(`[${now}] ${method} ${url} - Warning: Client-side error (${res.statusCode}) - Duration: ${duration}ms`);
            }

            if (res.statusCode === 500) {
                logger.error(`[${now}] ${method} ${url} - Error: Server-side error (${res.statusCode}) - Duration: ${duration}ms`);
            }
        });

        next();
    }
}
