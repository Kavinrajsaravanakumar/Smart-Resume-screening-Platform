const Settings = require('../models/Settings');

async function getSettings(userId) {
  let settings = await Settings.findOne({ owner: userId });
  if (!settings) {
    settings = await Settings.create({
      owner: userId,
      scoringWeights: {
        skills: 40,
        experience: 20,
        projects: 15,
        education: 10,
        certifications: 10,
        achievements: 5,
      },
      requiredSkills: [
        'React',
        'Node.js',
        'TypeScript',
        'Python',
        'AWS',
        'Docker',
        'SQL',
        'Kubernetes',
        'PostgreSQL',
        'Git',
      ],
    });
  }
  return settings;
}

async function updateSettings(userId, updates) {
  let settings = await Settings.findOne({ owner: userId });
  if (!settings) {
    settings = new Settings({ owner: userId });
  }

  if (updates.scoringWeights) {
    settings.scoringWeights = {
      ...settings.scoringWeights?.toObject(),
      ...updates.scoringWeights,
    };
  }

  if (updates.requiredSkills) {
    settings.requiredSkills = updates.requiredSkills;
  }

  await settings.save();
  return settings;
}

module.exports = {
  getSettings,
  updateSettings,
};
