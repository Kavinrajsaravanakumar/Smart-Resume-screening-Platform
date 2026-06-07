import { Router } from 'express';
import { uploadResume } from '../controllers/resumeController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post('/upload', upload.single('resume'), uploadResume);

export default router;
