const Candidate = require('../models/Candidate');
const Activity = require('../models/Activity');

function getRelativeTime(date) {
  if (!date) return 'recently';
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(diffDays / 7);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
}

async function getDashboardData(userId) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // ─── 1. Totals (filtered by owner) ───
  const [total, shortlisted, inReview, rejected, pending] = await Promise.all([
    Candidate.countDocuments({ owner: userId }),
    Candidate.countDocuments({ owner: userId, status: { $in: ['Shortlisted', 'shortlisted'] } }),
    Candidate.countDocuments({ owner: userId, status: { $in: ['In Review', 'review'] } }),
    Candidate.countDocuments({ owner: userId, status: { $in: ['Rejected', 'rejected'] } }),
    Candidate.countDocuments({ owner: userId, status: { $in: ['Pending', 'pending'] } }),
  ]);

  const totals = {
    total,
    shortlisted,
    inReview,
    review: inReview, // alias for frontend
    rejected,
    pending,
  };

  // ─── 2. "This week" Change Counts (filtered by owner) ───
  const [
    recentTotal,
    prevTotal,
    recentShortlisted,
    prevShortlisted,
    recentInReview,
    prevInReview,
    recentRejected,
    prevRejected,
  ] = await Promise.all([
    Candidate.countDocuments({ owner: userId, appliedAt: { $gte: sevenDaysAgo } }),
    Candidate.countDocuments({ owner: userId, appliedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } }),
    Candidate.countDocuments({ owner: userId, appliedAt: { $gte: sevenDaysAgo }, status: { $in: ['Shortlisted', 'shortlisted'] } }),
    Candidate.countDocuments({ owner: userId, appliedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }, status: { $in: ['Shortlisted', 'shortlisted'] } }),
    Candidate.countDocuments({ owner: userId, appliedAt: { $gte: sevenDaysAgo }, status: { $in: ['In Review', 'review'] } }),
    Candidate.countDocuments({ owner: userId, appliedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }, status: { $in: ['In Review', 'review'] } }),
    Candidate.countDocuments({ owner: userId, appliedAt: { $gte: sevenDaysAgo }, status: { $in: ['Rejected', 'rejected'] } }),
    Candidate.countDocuments({ owner: userId, appliedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }, status: { $in: ['Rejected', 'rejected'] } }),
  ]);

  const formatDiff = (curr, prev) => {
    // If no candidates in either period, return null so no fake trend badges show
    if (curr === 0 && prev === 0) return null;
    const diff = curr - prev;
    if (diff > 0) return `+${diff} this week`;
    if (diff < 0) return `${diff} vs last week`;
    return 'Same as last week';
  };

  const thisWeek = {
    total: recentTotal,
    shortlisted: recentShortlisted,
    inReview: recentInReview,
    rejected: recentRejected,
    changes: {
      total: formatDiff(recentTotal, prevTotal),
      shortlisted: formatDiff(recentShortlisted, prevShortlisted),
      inReview: formatDiff(recentInReview, prevInReview),
      rejected: formatDiff(recentRejected, prevRejected),
    },
  };

  // ─── 3. Top Candidates by Score (filtered by owner) ───
  const topCandidatesDocs = await Candidate.find({ owner: userId })
    .sort({ score: -1, appliedAt: -1 })
    .limit(5);

  const topCandidates = topCandidatesDocs.map(c => {
    const fn = c.firstName || c.name.split(' ')[0] || '';
    const ln = c.lastName || c.name.split(' ').slice(1).join(' ') || '';
    const initials = `${fn[0] || ''}${ln[0] || ''}`.toUpperCase() || 'CD';
    return {
      id: c._id.toHexString(),
      _id: c._id,
      name: c.name,
      firstName: fn,
      lastName: ln,
      initials,
      skills: c.skills,
      score: c.score,
      rankingScore: c.score,
      status: c.status,
    };
  });

  // ─── 4. Six Most Recent Activities (filtered by owner) ───
  const recentActivitiesDocs = await Activity.find({ owner: userId })
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('candidate', 'name email status');

  const recentActivities = recentActivitiesDocs.map(act => ({
    id: act._id.toHexString(),
    _id: act._id,
    type: act.type,
    message: act.message,
    time: getRelativeTime(act.createdAt),
    createdAt: act.createdAt,
    icon: act.icon,
    candidate: act.candidate,
  }));

  return {
    totals,
    thisWeek,
    topCandidates,
    recentActivities,
  };
}

module.exports = {
  getDashboardData,
  getRelativeTime,
};
