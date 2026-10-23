/**
 * Scoring Service
 * Evaluates candidates against a configurable JobProfile using skill matching,
 * mandatory skill enforcement, experience curves, and education thresholds.
 */

// Skill aliases mapping to canonical forms for alias-aware matching
const SKILL_ALIASES = {
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'node': 'node.js',
  'nodejs': 'node.js',
  'node.js': 'node.js',
  'express': 'express',
  'expressjs': 'express',
  'express.js': 'express',
  'vue': 'vue',
  'vuejs': 'vue',
  'vue.js': 'vue',
  'typescript': 'typescript',
  'ts': 'typescript',
  'javascript': 'javascript',
  'js': 'javascript',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'k8s': 'kubernetes',
  'kubernetes': 'kubernetes',
  'golang': 'go',
  'go': 'go',
  'aws': 'aws',
  'amazon web services': 'aws',
  'gcp': 'gcp',
  'google cloud': 'gcp',
  'docker': 'docker',
  'python': 'python',
  'java': 'java',
};

function canonicalizeSkill(skill) {
  if (!skill) return '';
  const clean = skill.toString().trim().toLowerCase();
  return SKILL_ALIASES[clean] || clean.replace(/[\s\.\-_]/g, '');
}

// Education level mapping
const EDUCATION_LEVELS = {
  'ph.d': 4,
  'phd': 4,
  'doctorate': 4,
  "master's": 3,
  'masters': 3,
  'm.s': 3,
  'm.s.': 3,
  'm.tech': 3,
  'mba': 3,
  "bachelor's": 2,
  'bachelors': 2,
  'b.s': 2,
  'b.s.': 2,
  'b.tech': 2,
  'associate': 1,
  'diploma': 1,
  'any': 0,
};

function parseEduLevel(edu) {
  if (!edu) return 1;
  const str = typeof edu === 'string' ? edu.toLowerCase() : JSON.stringify(edu).toLowerCase();
  if (/ph\.?d|doctorate/i.test(str)) return 4;
  if (/master|m\.s\.|m\.tech|mba/i.test(str)) return 3;
  if (/bachelor|b\.s\.|b\.tech|degree/i.test(str)) return 2;
  if (/associate|diploma/i.test(str)) return 1;
  return 1;
}

/**
 * Calculates score and returns detailed breakdown against a job profile
 * @param {Object} candidateData - { skills, experienceYears, education, projects, certifications }
 * @param {Object} jobProfile - { title, requiredSkills, minExperienceYears, preferredEducation, weights }
 */
function calculateScore(candidateData, jobProfile) {
  if (!jobProfile) {
    // Fallback default profile if none provided
    jobProfile = {
      title: 'General Profile',
      requiredSkills: [
        { name: 'JavaScript', weight: 4, mandatory: false },
        { name: 'React', weight: 4, mandatory: true },
        { name: 'Node.js', weight: 3, mandatory: false },
      ],
      minExperienceYears: 2,
      preferredEducation: "Bachelor's",
      weights: { skills: 50, experience: 20, education: 15, projects: 10, certifications: 5 },
    };
  }

  const weights = jobProfile.weights || {
    skills: 50,
    experience: 20,
    education: 15,
    projects: 10,
    certifications: 5,
  };

  // Normalize candidate skills
  const candidateSkills = (candidateData.skills || []).map(s => ({
    raw: s,
    canonical: canonicalizeSkill(s),
  }));

  const matchedSkills = [];
  const missingSkills = [];
  let matchedWeightSum = 0;
  let totalRequiredWeight = 0;
  let missingMandatory = false;

  const requiredSkills = jobProfile.requiredSkills || [];

  for (const req of requiredSkills) {
    const reqCanonical = canonicalizeSkill(req.name);
    const weight = Number(req.weight) || 3;
    totalRequiredWeight += weight;

    // Check if candidate possesses skill
    const found = candidateSkills.find(
      cs =>
        cs.canonical === reqCanonical ||
        cs.canonical.includes(reqCanonical) ||
        reqCanonical.includes(cs.canonical)
    );

    if (found) {
      matchedSkills.push({
        name: req.name,
        weight,
        mandatory: Boolean(req.mandatory),
      });
      matchedWeightSum += weight;
    } else {
      missingSkills.push({
        name: req.name,
        weight,
        mandatory: Boolean(req.mandatory),
      });
      if (req.mandatory) {
        missingMandatory = true;
      }
    }
  }

  // 1. Skills score (0 to 100)
  const skillsScore =
    totalRequiredWeight > 0 ? (matchedWeightSum / totalRequiredWeight) * 100 : 80;

  // 2. Experience score (0 to 100)
  const minExp = Number(jobProfile.minExperienceYears) || 1;
  const candExp = Number(candidateData.experienceYears) || 0;
  const experienceScore = Math.min(candExp / Math.max(minExp, 1), 1) * 100;

  // 3. Education score (0 to 100)
  const candEduLevel = parseEduLevel(candidateData.education);
  const prefEduLevel = parseEduLevel(jobProfile.preferredEducation || "Bachelor's");
  let educationScore = 100;
  if (prefEduLevel > 0) {
    if (candEduLevel >= prefEduLevel) {
      educationScore = 100;
    } else {
      educationScore = Math.max(50, (candEduLevel / prefEduLevel) * 80);
    }
  }

  // 4. Projects score (0 or 100)
  const hasProjects =
    Array.isArray(candidateData.projects) && candidateData.projects.length > 0;
  const projectsScore = hasProjects ? 100 : 0;

  // 5. Certifications score (0 or 100)
  const hasCerts =
    Array.isArray(candidateData.certifications) && candidateData.certifications.length > 0;
  const certificationsScore = hasCerts ? 100 : 0;

  // Weighted total (normalized to 100)
  const totalWeight =
    (weights.skills || 0) +
    (weights.experience || 0) +
    (weights.education || 0) +
    (weights.projects || 0) +
    (weights.certifications || 0) || 100;

  let finalScore =
    (skillsScore * (weights.skills || 0) +
      experienceScore * (weights.experience || 0) +
      educationScore * (weights.education || 0) +
      projectsScore * (weights.projects || 0) +
      certificationsScore * (weights.certifications || 0)) /
    totalWeight;

  // Enforce mandatory skill penalty: cap final score at 50 if any mandatory skill is missing
  if (missingMandatory) {
    finalScore = Math.min(finalScore, 50);
  }

  finalScore = Math.min(100, Math.max(0, Math.round(finalScore)));

  return {
    score: finalScore,
    breakdown: {
      matchedSkills,
      missingSkills,
      skillsScore: Math.round(skillsScore),
      experienceScore: Math.round(experienceScore),
      educationScore: Math.round(educationScore),
      projectsScore: Math.round(projectsScore),
      certificationsScore: Math.round(certificationsScore),
      missingMandatory,
      jobProfileTitle: jobProfile.title,
      jobProfileId: jobProfile._id || null,
    },
  };
}

module.exports = {
  calculateScore,
  canonicalizeSkill,
};
