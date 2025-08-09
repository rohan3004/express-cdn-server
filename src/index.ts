// File: src/index.ts
// The final, complete server entry point with the correct middleware order.

import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import path from 'path';

import { rateLimiter } from './config/rateLimiter';
import { logger, requestLogger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import streamRoutes from './routes/stream.routes';

// --- CORS Configuration ---
const allowedOriginsString = process.env.CORS_ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsString.split(',');
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// === Security & Core Middleware ===
// Updated helmet configuration to set a proper Content Security Policy
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"], // Allow inline scripts
        "img-src": ["'self'", "data:", "https://cdn.rohandev.online", "https://rohandev.online", "https:"], // Allow images from specific origins and any https source
      },
    },
  })
);

app.use(rateLimiter);
app.use(cors(corsOptions));
app.use(express.json());

// === Static Files Middleware ===
app.use(express.static(path.join(__dirname, '../public')));

app.use(requestLogger);

// === Routes ===
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Audio Streaming API is healthy' });
});
app.use('/api/stream', streamRoutes);


// === Smart 404 Page Middleware ===
// This now correctly sits before the final error handler.
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({
      status: 'fail',
      message: `Not Found: The requested URL ${req.originalUrl} does not exist on this server.`
    });
  } else {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
  }
});

// === Final Error Handling Middleware ===
// This MUST be the last middleware.
app.use(errorHandler);


// === Start Server ===
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`CORS enabled for the following origins: ${allowedOrigins.join(', ')}`);
});
