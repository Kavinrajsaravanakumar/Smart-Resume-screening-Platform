require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Candidate = require('./models/Candidate');
const Resume = require('./models/Resume');
const Activity = require('./models/Activity');
const JobProfile = require('./models/JobProfile');
const Settings = require('./models/Settings');

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_resume_screening';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Candidate.deleteMany({});
    await Resume.deleteMany({});
    await Activity.deleteMany({});
    await JobProfile.deleteMany({});
    await Settings.deleteMany({});

    console.log('[Seed] Creating demo HR User...');
    const hrUser = await User.create({
      name: 'Sarah Mitchell',
      email: 'sarah@company.com',
      password: 'password123',
      role: 'HR Director',
    });
    console.log(`[Seed] Created User: ${hrUser.email} / password123`);

    console.log('[Seed] Creating default active Job Profile template...');
    const defaultProfile = await JobProfile.create({
      title: 'Full Stack Engineer',
      requiredSkills: [
        { name: 'React', weight: 5, mandatory: true },
        { name: 'Node.js', weight: 4, mandatory: true },
        { name: 'TypeScript', weight: 4, mandatory: false },
        { name: 'Python', weight: 3, mandatory: false },
        { name: 'PostgreSQL', weight: 3, mandatory: false },
        { name: 'Docker', weight: 3, mandatory: false },
        { name: 'AWS', weight: 2, mandatory: false },
      ],
      minExperienceYears: 3,
      preferredEducation: "Bachelor's",
      weights: {
        skills: 50,
        experience: 20,
        education: 15,
        projects: 10,
        certifications: 5,
      },
      isActive: true,
      owner: hrUser._id,
      isTemplate: true,
    });
    console.log(`[Seed] Created Job Profile: "${defaultProfile.title}" for ${hrUser.email}`);

    console.log('✅ [Seed] Database seeded successfully (clean: NO fake candidates, activities, or resumes)!');
    process.exit(0);
  } catch (err) {
    console.error('❌ [Seed] Error:', err);
    process.exit(1);
  }
}

seed();
