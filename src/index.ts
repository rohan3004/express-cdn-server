// File: src/index.ts
// The final, complete server entry point with a more robust static path.

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
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https://cdn.rohandev.online", "https://rohandev.online", "https:"],
        // Add connect-src to allow fetch requests to specific domains
        "connect-src": ["'self'", "https://api.rohandev.online", "https://api.weatherapi.com", "https://scribe.rohandev.online"],
      },
    },
  })
);
app.use(rateLimiter);
app.use(cors(corsOptions));
app.use(express.json());

// === Static Files Middleware ===
// This path is now relative to the project root, making it more reliable.
const publicDirectoryPath = path.join(process.cwd(), 'public');
app.use(express.static(publicDirectoryPath));

app.use(requestLogger);

// === Routes ===
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Audio Streaming API is healthy' });
});
app.use('/api/stream', streamRoutes);


// === Smart 404 Page Middleware ===
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({
      status: 'fail',
      message: `Not Found: The requested URL ${req.originalUrl} does not exist on this server.`
    });
  } else {
    res.status(404).sendFile(path.join(publicDirectoryPath, '404.html'));
  }
});

// === Final Error Handling Middleware ===
app.use(errorHandler);


// === Start Server ===
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`CORS enabled for the following origins: ${allowedOrigins.join(', ')}`);
});
