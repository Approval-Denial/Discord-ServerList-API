import { NextFunction, Request, Response } from 'express';
import logger from 'src/utils/logger';

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || 'Unknown';
    logger(`${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`, 'info', method);
    next();
}