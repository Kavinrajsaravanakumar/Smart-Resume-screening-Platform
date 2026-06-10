import candidateService from '../services/candidateService.js';
import { candidateQuerySchema, idParamSchema } from '../validators/candidateValidator.js';

export async function getCandidates(req, res, next) {
  try {
    const { error, value } = candidateQuerySchema.validate(req.query);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const result = await candidateService.getCandidates(value);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getCandidateResume(req, res, next) {
  try {
    const { error, value } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const url = await candidateService.getResumePresignedUrl(value.id);
    if (!url) return res.status(404).json({ message: 'Resume not found.' });
    return res.json({ url });
  } catch (error) {
    return next(error);
  }
}

export async function getCandidateById(req, res, next) {
  try {
    const { error, value } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const candidate = await candidateService.getCandidateById(value.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });
    return res.json({ data: candidate });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCandidate(req, res, next) {
  try {
    const { error, value } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const deleted = await candidateService.deleteCandidate(value.id);
    if (!deleted) return res.status(404).json({ message: 'Candidate not found.' });
    return res.json({ message: 'Candidate deleted successfully.' });
  } catch (error) {
    return next(error);
  }
}
