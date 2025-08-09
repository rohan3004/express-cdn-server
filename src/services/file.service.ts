// File: src/services/file.service.ts
// This service now streams audio files from a local directory.

import fs from 'fs';
import path from 'path';
import { AppError } from '../utils/AppError';
import { Readable } from 'stream';

interface StreamDetails {
    stream: Readable;
    headers: Record<string, string | number>;
    statusCode: number;
}

// Get the music directory path from environment variables, with a default fallback.
const musicDirectory = process.env.MUSIC_DIRECTORY || 'music';

export async function createStream(songId: string, range: string): Promise<StreamDetails> {
    // Construct the full path to the requested song file.
    const songPath = path.join(musicDirectory, songId);
    
    // Security check: ensure the final path is still within the music directory.
    const resolvedPath = path.resolve(songPath);
    const resolvedMusicDir = path.resolve(musicDirectory);

    if (!resolvedPath.startsWith(resolvedMusicDir)) {
      throw new AppError('Access denied: Path traversal attempt detected', 403);
    }
    
    // 1. Check if the file exists and is readable.
    try {
        await fs.promises.access(songPath, fs.constants.R_OK);
    } catch (err) {
        throw new AppError('Song not found or is not readable', 404);
    }

    // 2. Get file stats to determine its size.
    const stat = await fs.promises.stat(songPath);
    const fileSize = stat.size;

    // 3. Parse the client's Range header.
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
        throw new AppError('Requested range not satisfiable', 416);
    }

    const chunkSize = (end - start) + 1;

    // 4. Create a readable stream for the requested chunk of the local file.
    const stream = fs.createReadStream(songPath, { start, end });

    // 5. Prepare the headers to send back to our client.
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
    };

    return {
        stream,
        headers,
        statusCode: 206 // Partial Content
    };
}
