const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Candidate email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    education: {
      type: mongoose.Schema.Types.Mixed,
      default: '',
    },
    experience: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    projects: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    scoreBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Shortlisted', 'Rejected'],
      default: 'Pending',
    },
    resumeFile: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for id
candidateSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual for rankingScore to match frontend
candidateSchema.virtual('rankingScore').get(function () {
  return this.score;
});

// Sync appliedAt with createdAt if present
candidateSchema.pre('save', function (next) {
  if (this.appliedAt && !this.createdAt) {
    this.createdAt = this.appliedAt;
  } else if (this.createdAt && !this.appliedAt) {
    this.appliedAt = this.createdAt;
  }
  next();
});

// Virtuals for firstName and lastName to match frontend
candidateSchema.virtual('firstName').get(function () {
  if (!this.name) return '';
  return this.name.split(' ')[0] || '';
});

candidateSchema.virtual('lastName').get(function () {
  if (!this.name) return '';
  const parts = this.name.split(' ');
  return parts.slice(1).join(' ') || '';
});

// Text index for search
candidateSchema.index({ name: 'text', email: 'text', skills: 'text' });

module.exports = mongoose.model('Candidate', candidateSchema);
