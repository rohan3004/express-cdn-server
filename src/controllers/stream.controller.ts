// File: src/controllers/stream.controller.ts
// The controller orchestrates the request and response flow.

import { Request, Response, NextFunction } from 'express';
import * as fileService from '../services/file.service';
import { AppError } from '../utils/AppError';

export async function getSongStream(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { songName } = req.params;
        const range = req.headers.range;

        // The HTTP spec requires a Range header for streaming.
        if (!range) {
            return next(new AppError('Requires Range header for streaming', 416)); // 416 Range Not Satisfiable
        }

        // Call the service to do the actual work.
        const streamDetails = await fileService.createStream(songName, range);

        // Write the custom headers (Content-Range, etc.) and the 206 Partial Content status.
        res.writeHead(streamDetails.statusCode, streamDetails.headers);

        // Pipe the file stream directly to the response.
        // This is highly efficient as it doesn't load the whole file into memory.
        const { stream } = streamDetails;
        stream.pipe(res);

        // Handle potential errors on the stream itself (e.g., client disconnects).
        stream.on('error', (err: Error) => {
            next(err);
        });

    } catch (error) {
        // Pass any errors to the centralized error handler.
        next(error);
    }
}