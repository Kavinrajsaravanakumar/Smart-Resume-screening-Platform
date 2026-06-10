import * as Candidate from '../models/candidateModel.js';
import s3Service from './s3Service.js';
import config from '../config/index.js';

const listCache = {
  data: null,
  expiresAt: 0
};

function includesText(value, search) {
  return String(value || '').toLowerCase().includes(search.toLowerCase());
}

function normalizeCandidate(candidate) {
  const parsedProfile = candidate.parsedProfile || {};
  const fullName = candidate.fullName || candidate.candidateName || candidate.name || 'Unnamed Candidate';
  const coreCandidate = { ...candidate };
  delete coreCandidate.resumeUrl;
  delete coreCandidate.parsedProfile;

  return {
    firstName: candidate.firstName || fullName.split(' ')?.[0] || '',
    lastName: candidate.lastName || fullName.split(' ')?.slice(1).join(' ') || '',
    fullName,
    candidateName: fullName,
    linkedIn: candidate.linkedIn || parsedProfile.linkedIn || '',
    github: candidate.github || parsedProfile.github || '',
    portfolio: candidate.portfolio || parsedProfile.portfolio || '',
    location: candidate.location || parsedProfile.location || '',
    summary: candidate.summary || parsedProfile.summary || '',
    skillGroups: candidate.skillGroups || parsedProfile.skillGroups || {
      programmingLanguages: [],
      frameworks: [],
      databases: [],
      cloudTechnologies: [],
      devOpsTools: [],
      softSkills: []
    },
    educationDetails: candidate.educationDetails || parsedProfile.educationDetails || {
      degree: candidate.education || 'Not specified',
      department: '',
      college: '',
      cgpa: '',
      startYear: '',
      endYear: ''
    },
    experienceDetails: candidate.experienceDetails || parsedProfile.experienceDetails || [],
    projects: candidate.projects || parsedProfile.projects || [],
    certifications: candidate.certifications || parsedProfile.certifications || [],
    achievements: candidate.achievements || parsedProfile.achievements || { awards: [], hackathons: [], publications: [], scholarships: [] },
    additionalInfo: candidate.additionalInfo || parsedProfile.additionalInfo || { languages: [], volunteerWork: [], extracurricularActivities: [] },
    scoreBreakdown: candidate.scoreBreakdown || parsedProfile.scoreBreakdown || {
      skillsScore: candidate.rankingScore || 0,
      projectScore: 0,
      experienceScore: 0,
      certificationScore: 0,
      educationScore: candidate.education ? 80 : 0,
      achievementScore: 0
    },
    status: candidate.status || (candidate.rankingScore >= 75 ? 'shortlisted' : candidate.rankingScore < 40 ? 'rejected' : 'review'),
    resumeS3Key: candidate.resumeS3Key || '',
    createdAt: candidate.createdAt,
    ...coreCandidate,
    name: fullName
  };
}

function invalidateListCache() {
  listCache.data = null;
  listCache.expiresAt = 0;
}

function applyFilters(candidates, filters = {}) {
  const skillFilters = filters.skills
    ? filters.skills.split(',').map((skill) => skill.trim().toLowerCase()).filter(Boolean)
    : [];

  return candidates
    .filter((candidate) => {
      const matchesSearch = !filters.search || [
        candidate.fullName,
        candidate.candidateName,
        candidate.name,
        candidate.email,
        candidate.phone,
        candidate.education,
        candidate.skills.join(' ')
      ].some((value) => includesText(value, filters.search));
      const matchesSkills = !skillFilters.length
        || skillFilters.every((skill) => candidate.skills.map((item) => item.toLowerCase()).includes(skill));
      const matchesEducation = !filters.education || includesText(candidate.education, filters.education);
      const matchesExperience = filters.minExperience === undefined
        || Number(candidate.experience) >= Number(filters.minExperience);
      const matchesScore = filters.minScore === undefined
        || Number(candidate.rankingScore) >= Number(filters.minScore);
      return matchesSearch && matchesSkills && matchesEducation && matchesExperience && matchesScore;
    })
    .sort((a, b) => b.rankingScore - a.rankingScore);
}

const candidateService = {
  async createCandidate(payload) {
    invalidateListCache();
    return Candidate.create(payload);
  },

  async getCandidates(filters = {}) {
    const now = Date.now();
    const useCache = !filters.limit && !filters.lastKey && Object.keys(filters).length === 0;

    if (useCache && listCache.data && listCache.expiresAt > now) {
      return listCache.data;
    }

    let lastEvaluatedKey;
    if (filters.lastKey) {
      try {
        lastEvaluatedKey = JSON.parse(filters.lastKey);
      } catch {
        lastEvaluatedKey = undefined;
      }
    }

    const { items, lastEvaluatedKey: nextKey } = await Candidate.findAll({
      limit: filters.limit,
      lastEvaluatedKey
    });

    const candidates = applyFilters(items.map(normalizeCandidate), filters);
    const response = {
      data: candidates,
      pagination: {
        limit: filters.limit || null,
        lastKey: nextKey ? JSON.stringify(nextKey) : null,
        count: candidates.length
      }
    };

    if (useCache) {
      listCache.data = response;
      listCache.expiresAt = now + (config.cacheTtlSeconds * 1000);
    }

    return response;
  },

  async getCandidateById(id) {
    const candidate = await Candidate.findById(id);
    return candidate ? normalizeCandidate(candidate) : null;
  },

  async getResumePresignedUrl(id) {
    const candidate = await Candidate.findById(id);
    if (!candidate?.resumeS3Key) return null;
    return s3Service.generatePresignedUrl(candidate.resumeS3Key);
  },

  async deleteCandidate(id) {
    const deleted = await Candidate.remove(id);
    if (!deleted) return null;

    await s3Service.deleteResume(deleted.resumeS3Key);
    invalidateListCache();
    return deleted;
  },

  async getDashboardStats() {
    const { data: candidates } = await this.getCandidates();
    const averageScore = candidates.length
      ? Math.round(candidates.reduce((sum, candidate) => sum + Number(candidate.rankingScore || 0), 0) / candidates.length)
      : 0;
    const topSkills = Object.entries(candidates.flatMap((candidate) => candidate.skills || []).reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {}))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));

    return {
      totalCandidates: candidates.length,
      shortlistedCandidates: candidates.filter((candidate) => candidate.status === 'shortlisted').length,
      rejectedCandidates: candidates.filter((candidate) => candidate.status === 'rejected').length,
      averageScore,
      topSkills,
      topCandidates: candidates.filter((candidate) => candidate.rankingScore >= 75).slice(0, 5),
      recentUploads: [...candidates].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    };
  }
};

export default candidateService;
