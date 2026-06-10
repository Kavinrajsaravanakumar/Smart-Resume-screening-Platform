import { v4 as uuidv4 } from 'uuid';
import dynamoService from '../services/dynamoService.js';

function deriveStatus(rankingScore) {
  if (rankingScore >= 75) return 'shortlisted';
  if (rankingScore < 40) return 'rejected';
  return 'review';
}

function buildCandidateRecord(candidate) {
  const fullName = candidate.fullName || candidate.name || 'Unnamed Candidate';

  return {
    candidateId: uuidv4(),
    firstName: candidate.firstName || '',
    lastName: candidate.lastName || '',
    fullName,
    email: candidate.email,
    phone: candidate.phone,
    skills: candidate.skills || [],
    education: candidate.education || 'Not specified',
    experience: candidate.experience || 0,
    rankingScore: candidate.rankingScore,
    status: candidate.status || deriveStatus(candidate.rankingScore),
    resumeS3Key: candidate.resumeS3Key,
    createdAt: new Date().toISOString(),
    parsedProfile: {
      linkedIn: candidate.linkedIn || '',
      github: candidate.github || '',
      portfolio: candidate.portfolio || '',
      location: candidate.location || '',
      summary: candidate.summary || '',
      skillGroups: candidate.skillGroups || {},
      educationDetails: candidate.educationDetails || {},
      experienceDetails: candidate.experienceDetails || [],
      projects: candidate.projects || [],
      certifications: candidate.certifications || [],
      achievements: candidate.achievements || {},
      additionalInfo: candidate.additionalInfo || {},
      scoreBreakdown: candidate.scoreBreakdown || {}
    }
  };
}

export async function create(candidate) {
  const record = buildCandidateRecord(candidate);
  await dynamoService.createCandidate(record);
  return record;
}

export async function findAll(options = {}) {
  return dynamoService.getCandidates(options);
}

export async function findById(candidateId) {
  return dynamoService.getCandidate(candidateId);
}

export async function remove(candidateId) {
  const existing = await dynamoService.getCandidate(candidateId);
  if (!existing) return null;
  await dynamoService.deleteCandidate(candidateId);
  return existing;
}
