import { Router } from 'express';
import {
  deleteCandidate,
  getCandidateById,
  getCandidateResume,
  getCandidates
} from '../controllers/candidateController.js';

const router = Router();

router.get('/', getCandidates);
router.get('/:id/resume', getCandidateResume);
router.get('/:id', getCandidateById);
router.delete('/:id', deleteCandidate);

export default router;
