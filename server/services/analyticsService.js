const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');

async function getAnalyticsData(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [totalCandidates, shortlistedCount, uniqueSkills, avgResult] = await Promise.all([
    Candidate.countDocuments({ owner: userObjectId }),
    Candidate.countDocuments({ owner: userObjectId, status: { $in: ['Shortlisted', 'shortlisted'] } }),
    Candidate.distinct('skills', { owner: userObjectId }),
    Candidate.aggregate([
      {
        $match: { owner: userObjectId },
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
        },
      },
    ]),
  ]);

  const averageScore = avgResult.length > 0 && avgResult[0].avgScore !== null
    ? Math.round(avgResult[0].avgScore)
    : 0;

  const uniqueSkillsCount = uniqueSkills.length;

  // ─── Status Distribution ───
  const statusCounts = await Candidate.aggregate([
    {
      $match: { owner: userObjectId },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Standardize statuses
  const statusMap = {
    Shortlisted: 0,
    'In Review': 0,
    Pending: 0,
    Rejected: 0,
  };
  statusCounts.forEach(s => {
    let key = s._id;
    if (key === 'review') key = 'In Review';
    if (key === 'shortlisted') key = 'Shortlisted';
    if (key === 'pending') key = 'Pending';
    if (key === 'rejected') key = 'Rejected';
    if (statusMap[key] !== undefined) {
      statusMap[key] += s.count;
    } else {
      statusMap[key] = s.count;
    }
  });

  const statusDistribution = Object.entries(statusMap).map(([status, count]) => ({
    status,
    name: status,
    value: count,
    count,
  }));

  // ─── Skills Distribution (Top 10 via $match -> $unwind -> $group) ───
  const skillsResult = await Candidate.aggregate([
    {
      $match: { owner: userObjectId },
    },
    { $unwind: '$skills' },
    {
      $group: {
        _id: '$skills',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const skillsDistribution = skillsResult.map(s => ({
    skill: s._id,
    name: s._id,
    count: s.count,
  }));

  // ─── Experience Distribution (Buckets: 0-2, 3-5, 6-10, 10+ years) ───
  const allCandidates = await Candidate.find({ owner: userObjectId }, 'experienceYears education appliedAt');

  const expBuckets = {
    '0-2 years': 0,
    '3-5 years': 0,
    '6-10 years': 0,
    '10+ years': 0,
  };

  allCandidates.forEach(c => {
    const years = c.experienceYears || 0;
    if (years <= 2) expBuckets['0-2 years']++;
    else if (years <= 5) expBuckets['3-5 years']++;
    else if (years <= 10) expBuckets['6-10 years']++;
    else expBuckets['10+ years']++;
  });

  const experienceDistribution = Object.entries(expBuckets).map(([bucket, count]) => ({
    bucket,
    name: bucket,
    count,
  }));

  // ─── Education Levels ───
  const eduCounts = {};
  allCandidates.forEach(c => {
    let eduStr = '';
    if (typeof c.education === 'string') {
      eduStr = c.education;
    } else if (Array.isArray(c.education) && c.education.length > 0) {
      eduStr = c.education.map(e => e.degree || '').join(' ');
    }
    const level = /ph\.?d/i.test(eduStr)
      ? 'Ph.D'
      : /master|m\.s\.|m\.tech|mba/i.test(eduStr)
      ? "Master's"
      : /bachelor|b\.s\.|b\.tech/i.test(eduStr)
      ? "Bachelor's"
      : "Bachelor's"; // default

    eduCounts[level] = (eduCounts[level] || 0) + 1;
  });

  const educationLevels = Object.entries(eduCounts).map(([level, count]) => ({
    level,
    name: level,
    count,
  }));

  // ─── Applications Per Week (Last 8 weeks) ───
  const now = new Date();
  const applicationsPerWeek = [];

  for (let i = 7; i >= 0; i--) {
    const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const count = allCandidates.filter(c => {
      const d = new Date(c.appliedAt);
      return d >= start && d < end;
    }).length;

    applicationsPerWeek.push({
      week: `Wk ${8 - i}`,
      label: `Week ${8 - i}`,
      count,
    });
  }

  return {
    totalCandidates,
    averageScore,
    uniqueSkillsCount,
    shortlistedCount,
    statusDistribution,
    skillsDistribution,
    experienceDistribution,
    educationLevels,
    applicationsPerWeek,
  };
}

module.exports = {
  getAnalyticsData,
};
