const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['uploaded', 'shortlisted', 'review', 'rejected', 'upload', 'shortlist', 'reject'],
      required: true,
      default: 'uploaded',
    },
    message: {
      type: String,
      required: [true, 'Activity message is required'],
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for id
activitySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual for icon name
activitySchema.virtual('icon').get(function () {
  switch (this.type) {
    case 'uploaded':
    case 'upload':
      return 'Upload';
    case 'shortlisted':
    case 'shortlist':
      return 'CheckCircle';
    case 'rejected':
    case 'reject':
      return 'XCircle';
    case 'review':
    default:
      return 'Eye';
  }
});

module.exports = mongoose.model('Activity', activitySchema);
