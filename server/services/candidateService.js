const Candidate = require('../models/Candidate');
const Activity = require('../models/Activity');
const Resume = require('../models/Resume');

function normalizeStatus(status) {
  if (!status) return 'Pending';
  const s = status.trim().toLowerCase();
  if (s === 'shortlisted' || s === 'shortlist') return 'Shortlisted';
  if (s === 'review' || s === 'in review' || s === 'in_review') return 'In Review';
  if (s === 'rejected' || s === 'reject') return 'Rejected';
  if (s === 'pending') return 'Pending';
  return status;
}

function mapStatusToActivityType(status) {
  const norm = normalizeStatus(status);
  if (norm === 'Shortlisted') return 'shortlisted';
  if (norm === 'In Review') return 'review';
  if (norm === 'Rejected') return 'rejected';
  return 'uploaded';
}

async function getAllCandidates(userId, { search, status } = {}) {
  const query = { owner: userId };

  if (search && search.trim() !== '') {
    const term = search.trim();
    query.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { skills: { $elemMatch: { $regex: term, $options: 'i' } } },
    ];
  }

  if (status && status !== 'all') {
    const norm = normalizeStatus(status);
    query.status = norm;
  }

  const candidates = await Candidate.find(query).sort({ score: -1, appliedAt: -1 });
  return candidates;
}

async function getCandidateById(userId, id) {
  const candidate = await Candidate.findOne({ _id: id, owner: userId });
  if (!candidate) {
    const err = new Error('Candidate not found');
    err.statusCode = 404;
    throw err;
  }
  return candidate;
}

async function updateCandidate(userId, id, updates) {
  if (updates.status) {
    updates.status = normalizeStatus(updates.status);
  }
  const candidate = await Candidate.findOneAndUpdate(
    { _id: id, owner: userId },
    updates,
    { new: true, runValidators: true }
  );
  if (!candidate) {
    const err = new Error('Candidate not found');
    err.statusCode = 404;
    throw err;
  }
  return candidate;
}

async function updateCandidateStatus(userId, id, rawStatus) {
  const status = normalizeStatus(rawStatus);
  const candidate = await Candidate.findOne({ _id: id, owner: userId });
  if (!candidate) {
    const err = new Error('Candidate not found');
    err.statusCode = 404;
    throw err;
  }

  candidate.status = status;
  await candidate.save();

  // Create Activity log scoped to current user
  const activityType = mapStatusToActivityType(status);
  let message = `${candidate.name} was ${status.toLowerCase()}`;
  if (status === 'In Review') {
    message = `${candidate.name}'s application moved to review`;
  } else if (status === 'Shortlisted') {
    message = `${candidate.name} was shortlisted`;
  } else if (status === 'Rejected') {
    message = `${candidate.name}'s application was rejected`;
  }

  await Activity.create({
    owner: userId,
    type: activityType,
    message,
    candidate: candidate._id,
  });

  return candidate;
}

async function deleteCandidate(userId, id) {
  const candidate = await Candidate.findOneAndDelete({ _id: id, owner: userId });
  if (!candidate) {
    const err = new Error('Candidate not found');
    err.statusCode = 404;
    throw err;
  }
  await Activity.deleteMany({ candidate: id, owner: userId });
  await Resume.deleteMany({ candidate: id, owner: userId });
  return { id };
}

module.exports = {
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  updateCandidateStatus,
  deleteCandidate,
  normalizeStatus,
};
