import candidateService from '../services/candidateService.js';
import resumeParserService from '../services/resumeParserService.js';
import rankingService from '../services/rankingService.js';
import { uploadRequestSchema } from '../validators/resumeValidator.js';

export async function uploadResume(req, res, next) {
  try {
    const { error, value } = uploadRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    const extracted = await resumeParserService.extractCandidateInfo(req.file.path, req.file.mimetype);
    const requiredSkills = value.requiredSkills ? value.requiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean) : [];
    const { rankingScore, scoreBreakdown } = rankingService.calculateBreakdown(requiredSkills, extracted);

    const candidate = await candidateService.createCandidate({
      ...extracted,
      rankingScore,
      scoreBreakdown,
      resumeUrl: req.file.path
    });

    return res.status(201).json({ message: 'Resume uploaded and processed successfully.', data: candidate });
  } catch (error) {
    return next(error);
  }
}
