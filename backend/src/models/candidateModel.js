import { v4 as uuidv4 } from 'uuid';
import db from '../repositories/localJsonRepository.js';

export async function create(candidate) {
  const record = {
    candidateId: uuidv4(),
    firstName: candidate.firstName || '',
    lastName: candidate.lastName || '',
    fullName: candidate.fullName || candidate.name,
    name: candidate.fullName || candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    linkedIn: candidate.linkedIn || '',
    github: candidate.github || '',
    portfolio: candidate.portfolio || '',
    location: candidate.location || '',
    summary: candidate.summary || '',
    skills: candidate.skills || [],
    skillGroups: candidate.skillGroups || {},
    education: candidate.education || 'Not specified',
    educationDetails: candidate.educationDetails || {},
    experience: candidate.experience || 0,
    experienceDetails: candidate.experienceDetails || [],
    projects: candidate.projects || [],
    certifications: candidate.certifications || [],
    achievements: candidate.achievements || {},
    additionalInfo: candidate.additionalInfo || {},
    rankingScore: candidate.rankingScore,
    scoreBreakdown: candidate.scoreBreakdown || {},
    status: candidate.status || (candidate.rankingScore >= 75 ? 'shortlisted' : candidate.rankingScore < 40 ? 'rejected' : 'review'),
    resumeUrl: candidate.resumeUrl,
    createdAt: new Date().toISOString()
  };
  await db.insert(record);
  return record;
}

export async function findAll() {
  return db.findAll();
}

export async function findById(candidateId) {
  return db.findById(candidateId);
}

export async function remove(candidateId) {
  return db.remove(candidateId);
}
