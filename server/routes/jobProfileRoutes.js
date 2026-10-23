const express = require('express');
const router = express.Router();
const jobProfileController = require('../controllers/jobProfileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, jobProfileController.getProfiles);
router.post('/', protect, jobProfileController.createProfile);
router.put('/:id', protect, jobProfileController.updateProfile);
router.delete('/:id', protect, jobProfileController.deleteProfile);
router.patch('/:id/activate', protect, jobProfileController.activateProfile);
router.post('/:id/rescore', protect, jobProfileController.rescoreCandidates);

module.exports = router;
