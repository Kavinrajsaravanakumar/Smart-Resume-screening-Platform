const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, candidateController.getCandidates);
router.get('/:id', protect, candidateController.getCandidate);
router.put('/:id', protect, candidateController.updateCandidate);
router.patch('/:id/status', protect, candidateController.updateStatus);
router.delete('/:id', protect, candidateController.deleteCandidate);

module.exports = router;
