const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Candidate = require('../models/Candidate');
const Resume = require('../models/Resume');
const Activity = require('../models/Activity');
const jobProfileService = require('./jobProfileService');
const scoringService = require('./scoringService');

// ─── Skill Normalization Map ───
const SKILL_MAP = {
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express',
  'expressjs': 'Express',
  'express.js': 'Express',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'python': 'Python',
  'py': 'Python',
  'golang': 'Go',
  'go': 'Go',
  'java': 'Java',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'sql': 'SQL',
  'mysql': 'MySQL',
  'redis': 'Redis',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'aws': 'AWS',
  'gcp': 'GCP',
  'azure': 'Azure',
  'git': 'Git',
  'github': 'GitHub',
  'html': 'HTML',
  'css': 'CSS',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'graphql': 'GraphQL',
  'rest': 'REST APIs',
  'rest api': 'REST APIs',
  'rest apis': 'REST APIs',
  'vue': 'Vue.js',
  'vuejs': 'Vue.js',
  'vue.js': 'Vue.js',
  'angular': 'Angular',
  'c++': 'C++',
  'rust': 'Rust',
  'kafka': 'Kafka',
  'linux': 'Linux',
  'figma': 'Figma',
};

function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];
  const set = new Set();
  const result = [];

  for (const s of skills) {
    if (!s || typeof s !== 'string') continue;
    const trimmed = s.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    const normalized = SKILL_MAP[lower] || trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const key = normalized.toLowerCase();
    if (!set.has(key)) {
      set.add(key);
      result.push(normalized);
    }
  }

  return result;
}

// ─── Calculate Experience Years from Date Ranges ───
function calculateExpYearsFromText(text) {
  const currentYear = 2026;
  const regex = /\b(19\d\d|20\d\d)\s*(?:[-–—to]+)\s*(Present|Current|Now|\d{4})\b/gi;
  let match;
  let totalYears = 0;
  const ranges = [];

  while ((match = regex.exec(text)) !== null) {
    const start = parseInt(match[1], 10);
    const endStr = match[2];
    const end = /present|current|now/i.test(endStr) ? currentYear : parseInt(endStr, 10);
    if (end >= start && end - start <= 40 && start > 1980) {
      ranges.push({ start, end });
    }
  }

  // Merge overlapping ranges
  if (ranges.length > 0) {
    ranges.sort((a, b) => a.start - b.start);
    let cur = ranges[0];
    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i].start <= cur.end) {
        cur.end = Math.max(cur.end, ranges[i].end);
      } else {
        totalYears += cur.end - cur.start;
        cur = ranges[i];
      }
    }
    totalYears += cur.end - cur.start;
  }

  return Math.min(totalYears, 35);
}

// ─── Extract Name from Top of Resume ───
function extractNameFromTop(text, filename) {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 1 && l.length < 60);

  for (const line of lines.slice(0, 5)) {
    // Skip if line looks like header/title/contact
    if (
      /resume|curriculum|vitae|cv|page|email|phone|http|github|linkedin|contact/i.test(line) ||
      line.includes('@') ||
      line.includes('.com')
    ) {
      continue;
    }
    // Looks like a valid name: 2 to 4 words with letters
    if (/^[a-zA-Z\s\.\-']{2,40}$/.test(line) && line.split(/\s+/).length <= 4) {
      return line.trim();
    }
  }

  // Clean filename fallback
  const clean = filename
    .replace(/\.pdf$/i, '')
    .replace(/^\d+-/, '')
    .replace(/[_-]/g, ' ')
    .trim();
  return clean || 'Candidate';
}

// ─── Fallback Regex Extraction ───
function fallbackExtract(text, filename) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0].toLowerCase() : `candidate-${Date.now()}@example.com`;

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  const name = extractNameFromTop(text, filename);
  const expYears = calculateExpYearsFromText(text);

  // Common tech skills lookup
  const commonSkills = [
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'AWS', 'Docker',
    'Kubernetes', 'SQL', 'PostgreSQL', 'MongoDB', 'Git', 'HTML', 'CSS', 'Tailwind CSS',
    'REST APIs', 'GraphQL', 'Linux', 'GCP', 'Azure', 'C++', 'Rust', 'Redis', 'Figma'
  ];
  const foundSkills = commonSkills.filter(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(text);
  });

  let education = '';
  if (/ph\.?d|doctorate/i.test(text)) education = 'Ph.D';
  else if (/master|m\.s\.|m\.tech|mba/i.test(text)) education = "Master's Degree";
  else if (/bachelor|b\.s\.|b\.tech/i.test(text)) education = "Bachelor's Degree";

  const summary = text.slice(0, 180).replace(/\s+/g, ' ').trim();

  return {
    name,
    email,
    phone,
    location: '',
    skills: normalizeSkills(foundSkills),
    experienceYears: expYears,
    education,
    summary,
    projects: [],
    certifications: [],
  };
}

// ─── Gemini Parsing with Strict JSON ───
async function parseWithGemini(pdfText, filename) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return fallbackExtract(pdfText, filename);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a professional resume parsing assistant. Extract candidate information from the following resume text.
CRITICAL RULES:
1. Use ONLY information explicitly present in the resume text. Never guess, extrapolate, or invent details.
2. Return null or empty array [] when an item is missing or not mentioned.
3. For name: Extract the candidate's actual full name from the very top of the resume.
4. For experienceYears: Carefully calculate total years of experience by summing the durations of each listed job entry based on the start and end dates (treat 'Present' or 'Current' as the year 2026). Do NOT extract arbitrary numbers mentioned inside project descriptions.
5. For skills: Extract only technical and professional skills listed in the resume as an array of strings.
6. Return STRICT, VALID JSON ONLY. Do NOT include markdown code blocks, do NOT write \`\`\`json, and do NOT include explanations.

JSON Format:
{
  "name": "Candidate Full Name",
  "email": "email@domain.com",
  "phone": "+1 555-0199",
  "location": "City, State or Country",
  "skills": ["Skill1", "Skill2"],
  "experienceYears": 3,
  "education": "Highest Degree, Institution Name",
  "summary": "1-2 sentence professional summary from the resume",
  "projects": [
    { "name": "Project Name", "description": "Short description", "tech": "Tech stack used" }
  ],
  "certifications": ["Certification Name"]
}

Resume Text:
${pdfText.slice(0, 9000)}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // Strip markdown code fences if Gemini added them
    const cleanJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleanJson);

    // Validate email with regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let email = parsed.email && emailRegex.test(parsed.email.trim()) ? parsed.email.trim() : null;
    if (!email) {
      const fallbackEmail = pdfText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      email = fallbackEmail ? fallbackEmail[0].toLowerCase() : `candidate-${Date.now()}@example.com`;
    }

    // Validate name
    let name = parsed.name ? parsed.name.trim() : '';
    if (!name || /resume|curriculum|vitae/i.test(name)) {
      name = extractNameFromTop(pdfText, filename);
    }

    // Validate experienceYears: if 0 or null, check text date ranges
    let experienceYears = Number(parsed.experienceYears);
    if (isNaN(experienceYears) || experienceYears <= 0) {
      experienceYears = calculateExpYearsFromText(pdfText);
    }

    return {
      name,
      email,
      phone: parsed.phone ? parsed.phone.trim() : '',
      location: parsed.location ? parsed.location.trim() : '',
      skills: normalizeSkills(parsed.skills),
      experienceYears,
      education: parsed.education || '',
      summary: parsed.summary || '',
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
    };
  } catch (error) {
    console.warn('[Gemini] Parsing failed, falling back to regex:', error.message);
    return fallbackExtract(pdfText, filename);
  }
}

// ─── Process Uploaded Resume File (Memory Buffer) ───
async function processResumeFile(file, user) {
  // Extract text from memory buffer safely
  let pdfText = '';
  try {
    const pdfData = await pdfParse(file.buffer);
    pdfText = pdfData?.text || '';
  } catch (pdfErr) {
    console.warn(`[PDFParse] Could not extract text from ${file.originalname}:`, pdfErr.message);
  }

  // Extract structured candidate details (Gemini -> fallback regex)
  let extracted;
  try {
    extracted = await parseWithGemini(pdfText, file.originalname);
  } catch (parseErr) {
    console.warn(`[Parse] Extraction error for ${file.originalname}, using fallback:`, parseErr.message);
    extracted = fallbackExtract(pdfText, file.originalname);
  }

  // Fallback defaults if fields missing
  const candidateName = extracted.name || file.originalname.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ') || 'Candidate';
  const candidateEmail = extracted.email || `applicant-${Date.now()}@example.com`;

  // Get active job profile for scoring
  let score = 0;
  let breakdown = null;
  try {
    const activeProfile = await jobProfileService.getActiveProfile(user?._id);
    const scored = scoringService.calculateScore(extracted, activeProfile);
    score = scored.score;
    breakdown = scored.breakdown;
  } catch (scoreErr) {
    console.warn('[Scoring] Failed to score candidate, setting default:', scoreErr.message);
    score = 65;
  }

  // 1. Create Candidate document
  const candidate = await Candidate.create({
    owner: user._id,
    name: candidateName,
    email: candidateEmail,
    phone: extracted.phone || '',
    location: extracted.location || '',
    skills: extracted.skills || [],
    experienceYears: extracted.experienceYears || 0,
    education: extracted.education || '',
    summary: extracted.summary || '',
    projects: extracted.projects || [],
    certifications: extracted.certifications || [],
    score: score,
    scoreBreakdown: breakdown,
    status: 'Pending',
    resumeFile: file.originalname,
    createdBy: user._id,
  });

  // 2. Save PDF Buffer into MongoDB Resume model
  await Resume.create({
    owner: user._id,
    candidate: candidate._id,
    fileName: file.originalname,
    mimeType: file.mimetype || 'application/pdf',
    size: file.size || file.buffer.length,
    data: file.buffer,
    extractedText: pdfText,
  });

  // 3. Create Activity entry
  try {
    await Activity.create({
      owner: user._id,
      type: 'uploaded',
      message: `${candidate.name}'s resume was uploaded`,
      candidate: candidate._id,
    });
  } catch (actErr) {
    console.warn('[Activity] Failed to create upload activity:', actErr.message);
  }

  return candidate;
}

// ─── Batch Upload Handler ───
async function uploadResumes(files, user) {
  if (!files || files.length === 0) {
    throw new Error('Please select at least one PDF resume to upload');
  }

  const fileList = Array.isArray(files) ? files : [files];
  const results = [];

  for (const file of fileList) {
    try {
      const candidate = await processResumeFile(file, user);
      results.push(candidate);
    } catch (err) {
      console.error(`[ResumeService] Failed to process ${file.originalname}:`, err.message);
      // Fallback: create candidate and store buffer directly so the file is not lost
      try {
        const fallbackCand = await Candidate.create({
          owner: user?._id,
          name: file.originalname.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ') || 'Candidate',
          email: `applicant-${Date.now()}@example.com`,
          skills: [],
          experienceYears: 0,
          score: 50,
          status: 'Pending',
          resumeFile: file.originalname,
          createdBy: user?._id || null,
        });
        await Resume.create({
          owner: user?._id,
          candidate: fallbackCand._id,
          fileName: file.originalname,
          mimeType: file.mimetype || 'application/pdf',
          size: file.size || file.buffer.length,
          data: file.buffer,
          extractedText: '',
        });
        results.push(fallbackCand);
      } catch (critErr) {
        console.error('[ResumeService] Critical fallback save error:', critErr.message);
      }
    }
  }

  if (results.length === 0) {
    throw new Error('Failed to process uploaded resume file(s). Please check that the file is a valid PDF.');
  }

  return results;
}

// ─── Get Resume PDF Buffer from Database ───
async function getResumePdf(candidateId, userId) {
  const resume = await Resume.findOne({ candidate: candidateId, owner: userId });
  if (!resume) {
    const err = new Error('Resume file not found for this candidate');
    err.statusCode = 404;
    throw err;
  }

  return {
    data: resume.data,
    mimeType: resume.mimeType || 'application/pdf',
    fileName: resume.fileName || 'resume.pdf',
  };
}

module.exports = {
  uploadResumes,
  getResumePdf,
  calculateExpYearsFromText,
  normalizeSkills,
  fallbackExtract,
};
