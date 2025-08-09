// File: src/utils/AppError.ts
// This file defines a custom error class for creating operational errors.

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // This flag helps us identify errors we've created intentionally.
        this.isOperational = true;

        // Maintains the correct prototype chain.
        Object.setPrototypeOf(this, new.target.prototype);

        // Captures the stack trace, excluding the constructor call.
        Error.captureStackTrace(this, this.constructor);
    }
}