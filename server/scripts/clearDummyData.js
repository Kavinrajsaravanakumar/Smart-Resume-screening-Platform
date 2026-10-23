require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const Resume = require('../models/Resume');
const Activity = require('../models/Activity');

const SEEDED_EMAILS = [
  'carlos.m@email.com',
  'sarah.chen@email.com',
  'aisha.okafor@email.com',
  'marcus.j@email.com',
  'fatima.h@email.com',
  'priya.sharma@email.com',
  'elena.r@email.com',
  'david.kim@email.com',
  'alex.t@email.com',
];

async function clearDummyData() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_resume_screening';
    console.log(`[ClearDummy] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    // 1. Find candidates that have no owner/createdBy or match seeded emails
    const dummyCandidates = await Candidate.find({
      $or: [
        { owner: null },
        { owner: { $exists: false } },
        { createdBy: null },
        { createdBy: { $exists: false } },
        { email: { $in: SEEDED_EMAILS } },
      ],
    }).select('_id name email');

    const dummyCandidateIds = dummyCandidates.map(c => c._id);
    console.log(`[ClearDummy] Found ${dummyCandidateIds.length} dummy/unowned candidate(s) to remove.`);

    // 2. Delete resumes associated with dummy candidates or without owner
    const resumeDeleteResult = await Resume.deleteMany({
      $or: [
        { candidate: { $in: dummyCandidateIds } },
        { owner: null },
        { owner: { $exists: false } },
      ],
    });

    // 3. Delete activities associated with dummy candidates or without owner
    const activityDeleteResult = await Activity.deleteMany({
      $or: [
        { candidate: { $in: dummyCandidateIds } },
        { owner: null },
        { owner: { $exists: false } },
      ],
    });

    // 4. Delete the candidates
    const candidateDeleteResult = await Candidate.deleteMany({
      $or: [
        { _id: { $in: dummyCandidateIds } },
        { owner: null },
        { owner: { $exists: false } },
        { createdBy: null },
        { createdBy: { $exists: false } },
        { email: { $in: SEEDED_EMAILS } },
      ],
    });

    console.log('\n================ CLEAR DUMMY DATA REPORT ================');
    console.log(`Deleted Candidates : ${candidateDeleteResult.deletedCount}`);
    console.log(`Deleted Resumes    : ${resumeDeleteResult.deletedCount}`);
    console.log(`Deleted Activities : ${activityDeleteResult.deletedCount}`);
    console.log('=========================================================\n');
    console.log('✅ Cleanup finished successfully.');

    process.exit(0);
  } catch (err) {
    console.error('❌ [ClearDummy] Error during cleanup:', err);
    process.exit(1);
  }
}

clearDummyData();
