// File: src/services/file.service.ts
// This service acts as a proxy to stream from an external URL.

import axios from 'axios';
import { AppError } from '../utils/AppError';
import { Readable } from 'stream';

// In a real application, you would get this from a database or config file.
const songUrlMap: Record<string, string> = {
  'music1.mp3': 'https://www.rohandev.online/song-repo/music1.mp3',
  'music2.mp3': 'https://www.rohandev.online/song-repo/music2.mp3',
  'music3.mp3': 'https://www.rohandev.online/song-repo/music3.mp3',
  'music4.mp3': 'https://www.rohandev.online/song-repo/music4.mp3',
  'music5.mp3': 'https://www.rohandev.online/song-repo/music5.mp3',
};

interface StreamDetails {
    stream: Readable;
    headers: Record<string, string | number>;
    statusCode: number;
}

export async function createStream(songId: string, range: string): Promise<StreamDetails> {
    const musicUrl = songUrlMap[songId];
    if (!musicUrl) {
        throw new AppError('Song not found', 404);
    }

    try {
        // 1. First, make a HEAD request to get the total file size.
        // This is efficient as it doesn't download the file content.
        const headResponse = await axios.head(musicUrl);
        const fileSize = headResponse.headers['content-length'];

        if (!fileSize) {
            throw new AppError('Could not determine file size.', 500);
        }

        // 2. Parse the client's Range header.
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : parseInt(fileSize, 10) - 1;
        const chunkSize = (end - start) + 1;

        // 3. Make the actual GET request for the specific chunk.
        // We pass the client's Range header directly to the source.
        const response = await axios.get(musicUrl, {
            responseType: 'stream', // This is crucial!
            headers: {
                Range: `bytes=${start}-${end}`
            }
        });

        // 4. Prepare the headers to send back to our client.
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        };

        return {
            stream: response.data as Readable, // response.data is now a readable stream
            headers: headers,
            statusCode: 206 // Partial Content
        };

    } catch (error: any) {
        // The fix is to check for the 'isAxiosError' property on the error object itself.
        if (error.isAxiosError && error.response?.status === 404) {
            throw new AppError('Song not found at the source URL', 404);
        }
        // Re-throw other errors to be caught by the central error handler.
        throw new AppError(error.message || 'Failed to fetch audio from source.', 500);
    }
}
