// File: src/middleware/errorHandler.ts
// This file defines our centralized error handling middleware.

import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    // If the error is an instance of our AppError, we trust it and can expose its message.
    if (err instanceof AppError) {
        logger.warn(`Operational Error: ${err.statusCode} ${err.message}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        return;
    }

    // For all other unexpected, non-operational errors, log them as critical.
    logger.error('Unexpected Error:', { message: err.message, stack: err.stack });

    // In a production environment, send a generic message to avoid leaking implementation details.
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({
            status: 'error',
            message: 'An internal server error occurred.',
        });
    } else {
        // In development, send a detailed error for easier debugging.
        res.status(500).json({
            status: 'error',
            message: err.message,
            stack: err.stack,
        });
    }
};
