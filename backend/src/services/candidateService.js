import * as Candidate from '../models/candidateModel.js';

function includesText(value, search) {
  return String(value || '').toLowerCase().includes(search.toLowerCase());
}

function normalizeCandidate(candidate) {
  return {
    firstName: candidate.firstName || candidate.name?.split(' ')?.[0] || '',
    lastName: candidate.lastName || candidate.name?.split(' ')?.slice(1).join(' ') || '',
    fullName: candidate.fullName || candidate.name || 'Unnamed Candidate',
    linkedIn: candidate.linkedIn || '',
    github: candidate.github || '',
    portfolio: candidate.portfolio || '',
    location: candidate.location || '',
    summary: candidate.summary || '',
    skillGroups: candidate.skillGroups || {
      programmingLanguages: [],
      frameworks: [],
      databases: [],
      cloudTechnologies: [],
      devOpsTools: [],
      softSkills: []
    },
    educationDetails: candidate.educationDetails || {
      degree: candidate.education || 'Not specified',
      department: '',
      college: '',
      cgpa: '',
      startYear: '',
      endYear: ''
    },
    experienceDetails: candidate.experienceDetails || [],
    projects: candidate.projects || [],
    certifications: candidate.certifications || [],
    achievements: candidate.achievements || { awards: [], hackathons: [], publications: [], scholarships: [] },
    additionalInfo: candidate.additionalInfo || { languages: [], volunteerWork: [], extracurricularActivities: [] },
    scoreBreakdown: candidate.scoreBreakdown || {
      skillsScore: candidate.rankingScore || 0,
      projectScore: 0,
      experienceScore: 0,
      certificationScore: 0,
      educationScore: candidate.education ? 80 : 0,
      achievementScore: 0
    },
    status: candidate.status || (candidate.rankingScore >= 75 ? 'shortlisted' : candidate.rankingScore < 40 ? 'rejected' : 'review'),
    ...candidate
  };
}

const candidateService = {
  createCandidate(payload) {
    return Candidate.create(payload);
  },

  async getCandidates(filters = {}) {
    const candidates = (await Candidate.findAll()).map(normalizeCandidate);
    const skillFilters = filters.skills ? filters.skills.split(',').map((skill) => skill.trim().toLowerCase()).filter(Boolean) : [];

    return candidates
      .filter((candidate) => {
        const matchesSearch = !filters.search || [candidate.fullName, candidate.name, candidate.email, candidate.phone, candidate.education, candidate.skills.join(' ')]
          .some((value) => includesText(value, filters.search));
        const matchesSkills = !skillFilters.length || skillFilters.every((skill) => candidate.skills.map((item) => item.toLowerCase()).includes(skill));
        const matchesEducation = !filters.education || includesText(candidate.education, filters.education);
        const matchesExperience = filters.minExperience === undefined || Number(candidate.experience) >= Number(filters.minExperience);
        const matchesScore = filters.minScore === undefined || Number(candidate.rankingScore) >= Number(filters.minScore);
        return matchesSearch && matchesSkills && matchesEducation && matchesExperience && matchesScore;
      })
      .sort((a, b) => b.rankingScore - a.rankingScore);
  },

  getCandidateById(id) {
    return Candidate.findById(id).then((candidate) => candidate ? normalizeCandidate(candidate) : null);
  },

  deleteCandidate(id) {
    return Candidate.remove(id);
  },

  async getDashboardStats() {
    const candidates = await this.getCandidates();
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
