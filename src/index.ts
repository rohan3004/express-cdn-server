// File: src/index.ts
// The final, complete server entry point with dynamic CORS configuration.

import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors'; // Import CorsOptions type

import { rateLimiter } from './config/rateLimiter';
import { logger, requestLogger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import streamRoutes from './routes/stream.routes';

// --- Start of CORS Configuration ---

// 1. Get the allowed origins from the .env file and split them into an array.
const allowedOriginsString = process.env.CORS_ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsString.split(',');

// 2. Define the CORS options.
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // The 'origin' is the URL of the frontend making the request.
    // We check if this origin is in our allowed list.
    // The `!origin` check allows for server-to-server requests or tools like Postman where origin is undefined.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      // If allowed, the callback passes `null` for the error and `true` for success.
      callback(null, true);
    } else {
      // If not allowed, the callback passes an error.
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allows cookies to be sent
};

// --- End of CORS Configuration ---


const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// === Security & Core Middleware ===
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(rateLimiter);

// 3. Use the cors middleware with our dynamic options.
app.use(cors(corsOptions));

app.use(express.json());
app.use(requestLogger);


// === Routes ===
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Audio Streaming API is healthy' });
});

app.use('/api/stream', streamRoutes);


// === Error Handling Middleware ===
app.use(errorHandler);


// === Start Server ===
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`CORS enabled for the following origins: ${allowedOrigins.join(', ')}`);
});
