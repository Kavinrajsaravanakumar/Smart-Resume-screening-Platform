const mongoose = require('mongoose');

const jobProfileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    requiredSkills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        weight: {
          type: Number,
          min: 1,
          max: 5,
          default: 3,
        },
        mandatory: {
          type: Boolean,
          default: false,
        },
      },
    ],
    minExperienceYears: {
      type: Number,
      default: 2,
      min: 0,
    },
    preferredEducation: {
      type: String,
      default: "Bachelor's",
    },
    weights: {
      skills: { type: Number, default: 50 },
      experience: { type: Number, default: 20 },
      education: { type: Number, default: 15 },
      projects: { type: Number, default: 10 },
      certifications: { type: Number, default: 5 },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobProfileSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('JobProfile', jobProfileSchema);
