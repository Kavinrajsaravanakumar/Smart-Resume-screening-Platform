const rankingService = {
  calculateScore(requiredSkills = [], candidateSkills = []) {
    const required = requiredSkills.map((skill) => skill.toLowerCase()).filter(Boolean);
    if (!required.length) return 0;
    const candidateSet = new Set(candidateSkills.map((skill) => skill.toLowerCase()));
    const matches = required.filter((skill) => candidateSet.has(skill)).length;
    return Math.round((matches / required.length) * 100);
  },

  calculateBreakdown(requiredSkills = [], candidate = {}) {
    const skillsScore = this.calculateScore(requiredSkills, candidate.skills || []);
    const projectScore = Math.min((candidate.projects || []).length * 25, 100);
    const experienceScore = Math.min(Number(candidate.experience || 0) * 20, 100);
    const certificationScore = Math.min((candidate.certifications || []).length * 25, 100);
    const educationScore = candidate.educationDetails?.degree || candidate.education ? 80 : 0;
    const achievementScore = [
      ...(candidate.achievements?.awards || []),
      ...(candidate.achievements?.hackathons || []),
      ...(candidate.achievements?.publications || []),
      ...(candidate.achievements?.scholarships || [])
    ].length > 0 ? 80 : 0;

    const rankingScore = Math.round(
      skillsScore * 0.4
      + projectScore * 0.15
      + experienceScore * 0.2
      + certificationScore * 0.1
      + educationScore * 0.1
      + achievementScore * 0.05
    );

    return {
      rankingScore,
      scoreBreakdown: {
        skillsScore,
        projectScore,
        experienceScore,
        certificationScore,
        educationScore,
        achievementScore
      }
    };
  }
};

export default rankingService;
