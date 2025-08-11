// The controller for handling video stream requests.

import { Request, Response, NextFunction } from 'express';
import * as videoService from '../services/video.service';
import { AppError } from '../utils/AppError';

export async function getVideoStream(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { videoName } = req.params;
        const range = req.headers.range;

        // The HTTP spec requires a Range header for video streaming.
        if (!range) {
            return next(new AppError('Requires Range header for streaming', 416));
        }

        // Call the service to do the actual work.
        const streamDetails = await videoService.createVideoStream(videoName, range);

        // Write the custom headers (Content-Range, etc.) and the 206 Partial Content status.
        res.writeHead(streamDetails.statusCode, streamDetails.headers);

        // Pipe the file stream directly to the response.
        const { stream } = streamDetails;
        stream.pipe(res);

        stream.on('error', (err: Error) => {
            next(err);
        });

    } catch (error) {
        next(error);
    }
}