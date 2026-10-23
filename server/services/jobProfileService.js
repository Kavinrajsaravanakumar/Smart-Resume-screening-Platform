const JobProfile = require('../models/JobProfile');
const Candidate = require('../models/Candidate');
const scoringService = require('./scoringService');

const DEFAULT_PROFILE_TEMPLATE = {
  title: 'Full Stack Engineer',
  requiredSkills: [
    { name: 'React', weight: 5, mandatory: true },
    { name: 'Node.js', weight: 4, mandatory: true },
    { name: 'TypeScript', weight: 4, mandatory: false },
    { name: 'Python', weight: 3, mandatory: false },
    { name: 'PostgreSQL', weight: 3, mandatory: false },
    { name: 'Docker', weight: 3, mandatory: false },
    { name: 'AWS', weight: 2, mandatory: false },
  ],
  minExperienceYears: 3,
  preferredEducation: "Bachelor's",
  weights: {
    skills: 50,
    experience: 20,
    education: 15,
    projects: 10,
    certifications: 5,
  },
  isActive: true,
};

async function createDefaultProfileForUser(userId) {
  // Check if a global template exists
  const template = await JobProfile.findOne({ isTemplate: true });
  const profileData = template
    ? {
        title: template.title,
        requiredSkills: template.requiredSkills.map(s => ({
          name: s.name,
          weight: s.weight,
          mandatory: s.mandatory,
        })),
        minExperienceYears: template.minExperienceYears,
        preferredEducation: template.preferredEducation,
        weights: template.weights,
        isActive: true,
        owner: userId,
      }
    : {
        ...DEFAULT_PROFILE_TEMPLATE,
        owner: userId,
      };

  return await JobProfile.create(profileData);
}

async function getJobProfiles(userId) {
  const profiles = await JobProfile.find({ owner: userId }).sort({ isActive: -1, createdAt: -1 });
  // If no profiles exist for this user, create a default one
  if (profiles.length === 0) {
    const defaultProfile = await createDefaultProfileForUser(userId);
    return [defaultProfile];
  }
  return profiles;
}

async function getActiveProfile(userId) {
  let profile = await JobProfile.findOne({ owner: userId, isActive: true });
  if (!profile) {
    const all = await getJobProfiles(userId);
    profile = all[0];
  }
  return profile;
}

async function createJobProfile(userId, data) {
  data.owner = userId;
  const count = await JobProfile.countDocuments({ owner: userId });
  if (count === 0 || data.isActive) {
    await JobProfile.updateMany({ owner: userId }, { isActive: false });
    data.isActive = true;
  }
  const profile = await JobProfile.create(data);
  return profile;
}

async function updateJobProfile(userId, id, updates) {
  const profile = await JobProfile.findOne({ _id: id, owner: userId });
  if (!profile) {
    const err = new Error('Job profile not found');
    err.statusCode = 404;
    throw err;
  }

  if (updates.isActive) {
    await JobProfile.updateMany({ owner: userId, _id: { $ne: id } }, { isActive: false });
  }

  Object.assign(profile, updates);
  await profile.save();
  return profile;
}

async function activateJobProfile(userId, id, rescore = false) {
  // Deactivate only the current user's profiles
  await JobProfile.updateMany({ owner: userId }, { isActive: false });
  const profile = await JobProfile.findOneAndUpdate(
    { _id: id, owner: userId },
    { isActive: true },
    { new: true }
  );

  if (!profile) {
    const err = new Error('Job profile not found');
    err.statusCode = 404;
    throw err;
  }

  if (rescore) {
    await rescoreAllCandidates(userId, id);
  }

  return profile;
}

async function deleteJobProfile(userId, id) {
  const profile = await JobProfile.findOneAndDelete({ _id: id, owner: userId });
  if (!profile) {
    const err = new Error('Job profile not found');
    err.statusCode = 404;
    throw err;
  }

  // If the deleted profile was active, make another one active if available
  if (profile.isActive) {
    const another = await JobProfile.findOne({ owner: userId });
    if (another) {
      another.isActive = true;
      await another.save();
    }
  }
  return { id };
}

async function rescoreAllCandidates(userId, profileId) {
  const profile = profileId
    ? await JobProfile.findOne({ _id: profileId, owner: userId })
    : await getActiveProfile(userId);

  if (!profile) {
    const err = new Error('Job profile not found for rescoring');
    err.statusCode = 404;
    throw err;
  }

  // Only query candidates belonging to the current user
  const candidates = await Candidate.find({ owner: userId });
  let updatedCount = 0;

  for (const candidate of candidates) {
    const { score, breakdown } = scoringService.calculateScore(candidate, profile);
    candidate.score = score;
    candidate.scoreBreakdown = breakdown;
    await candidate.save();
    updatedCount++;
  }

  return { updatedCount, profileTitle: profile.title };
}

module.exports = {
  createDefaultProfileForUser,
  getJobProfiles,
  getActiveProfile,
  createJobProfile,
  updateJobProfile,
  activateJobProfile,
  deleteJobProfile,
  rescoreAllCandidates,
};
