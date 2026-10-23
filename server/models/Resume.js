const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    size: {
      type: Number,
      default: 0,
    },
    data: {
      type: Buffer,
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
