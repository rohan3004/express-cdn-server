// File: src/middleware/validator.ts
// This middleware uses Joi to validate and sanitize request parameters.
// This is a CRITICAL security measure to prevent path traversal attacks.

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

// Define a schema for the expected request parameters.
const streamSchema = Joi.object({
  // The songName must be a string that matches the regex.
  // It allows alphanumeric characters, hyphens, and underscores, ending in .mp3.
  // This prevents malicious input like '../../secrets.txt'.
  songName: Joi.string().regex(/^[a-zA-Z0-9-_\.]+\.mp3$/).required(),
});

export const validateStreamRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = streamSchema.validate(req.params);

  if (error) {
    // If validation fails, pass a structured error to our central error handler.
    return next(new AppError(`Invalid song name format: ${error.details[0].message}`, 400));
  }
  
  // If validation succeeds, proceed to the next middleware (the controller).
  next();
};