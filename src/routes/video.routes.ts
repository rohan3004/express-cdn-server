// This file defines the API endpoint for streaming a video.

import { Router } from 'express';
import { getVideoStream } from '../controllers/video.controller';
import { validateVideoRequest } from '../middleware/validator';

const router = Router();

// A GET request to /:videoName will first be validated,
// and if valid, will be passed to the getVideoStream controller.
router.get('/:videoName', validateVideoRequest, getVideoStream);

export default router;
