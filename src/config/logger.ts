// File: src/config/logger.ts
// This file sets up our application's logger using the Winston library.

import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

const logger = winston.createLogger({
  // The minimum level of messages to log.
  level: 'info',
  // The format for the log messages.
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Log the full error stack
    winston.format.splat(),
    winston.format.json() // Log in JSON format
  ),
  // Default metadata to be added to every log message.
  defaultMeta: { service: 'audio-streamer' },
  // Where to send the logs. We are configuring two files.
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in a production environment, also log to the console
// with a simpler, colorized format for better readability during development.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// A simple middleware to log incoming HTTP requests.
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`[${req.method}] ${req.originalUrl} - IP: ${req.ip}`);
    next();
};

export { logger };