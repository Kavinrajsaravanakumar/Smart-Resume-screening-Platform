const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.array('resume', 10), resumeController.upload);
router.get('/:candidateId', protect, resumeController.getResumeFile);

module.exports = router;
