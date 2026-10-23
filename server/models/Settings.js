const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
    scoringWeights: {
      skills: { type: Number, default: 40 },
      experience: { type: Number, default: 20 },
      projects: { type: Number, default: 15 },
      education: { type: Number, default: 10 },
      certifications: { type: Number, default: 10 },
      achievements: { type: Number, default: 5 },
    },
    requiredSkills: {
      type: [String],
      default: [
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
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
