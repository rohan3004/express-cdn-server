// This service contains the core logic for video file system interaction.

import fs from 'fs';
import path from 'path';
import { AppError } from '../utils/AppError';
import { Readable } from 'stream';

interface StreamDetails {
    stream: Readable;
    headers: Record<string, string | number>;
    statusCode: number;
}

// Get the video directory path from environment variables.
const videoDirectory = process.env.VIDEO_DIRECTORY || 'videos';

export async function createVideoStream(videoName: string, range: string): Promise<StreamDetails> {
    const videoPath = path.join(videoDirectory, videoName);
    
    // Security check
    const resolvedPath = path.resolve(videoPath);
    const resolvedVideoDir = path.resolve(videoDirectory);
    if (!resolvedPath.startsWith(resolvedVideoDir)) {
      throw new AppError('Access denied: Path traversal attempt detected', 403);
    }
    
    try {
        await fs.promises.access(videoPath, fs.constants.R_OK);
    } catch (err) {
        throw new AppError('Video not found or is not readable', 404);
    }

    const stat = await fs.promises.stat(videoPath);
    const fileSize = stat.size;

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
        throw new AppError('Requested range not satisfiable', 416);
    }

    const chunkSize = (end - start) + 1;
    const stream = fs.createReadStream(videoPath, { start, end });

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4', // Changed content type for video
    };

    return {
        stream,
        headers,
        statusCode: 206 // Partial Content
    };
}