// File: src/routes/stream.routes.ts
// This file defines the API endpoint for streaming a song.

import { Router } from 'express';
import { getSongStream } from '../controllers/stream.controller';
import { validateStreamRequest } from '../middleware/validator';

const router = Router();

// A GET request to /:songName will first be validated,
// and if valid, will be passed to the getSongStream controller.
router.get('/:songName', validateStreamRequest, getSongStream);

export default router;
