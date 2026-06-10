import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import candidateService from '../services/candidateService.js';
import rankingService from '../services/rankingService.js';
import resumeParserService from '../services/resumeParserService.js';
import s3Service from '../services/s3Service.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { uploadRequestSchema } from '../validators/resumeValidator.js';

const snsClient = config.snsTopicArn ? new SNSClient({ region: config.awsRegion }) : null;

async function publishResumeEvent(candidate) {
  if (!snsClient || !config.snsTopicArn) return;

  try {
    await snsClient.send(new PublishCommand({
      TopicArn: config.snsTopicArn,
      Subject: 'Resume processed',
      Message: JSON.stringify({
        candidateId: candidate.candidateId,
        candidateName: candidate.fullName,
        rankingScore: candidate.rankingScore,
        resumeS3Key: candidate.resumeS3Key
      })
    }));
  } catch (error) {
    logger.error(`Failed to publish SNS event: ${error.message}`);
  }
}

export async function uploadResume(req, res, next) {
  try {
    const { error, value } = uploadRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    const { resumeS3Key } = await s3Service.uploadResume(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const extracted = await resumeParserService.extractCandidateInfo(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    const requiredSkills = value.requiredSkills
      ? value.requiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean)
      : [];
    const { rankingScore, scoreBreakdown } = rankingService.calculateBreakdown(requiredSkills, extracted);

    const candidate = await candidateService.createCandidate({
      ...extracted,
      rankingScore,
      scoreBreakdown,
      resumeS3Key
    });

    await publishResumeEvent(candidate);

    return res.status(201).json({
      message: 'Resume uploaded and processed successfully.',
      data: candidate
    });
  } catch (error) {
    return next(error);
  }
}
