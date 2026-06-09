import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

const skillCatalog = {
  programmingLanguages: ['Java', 'JavaScript', 'TypeScript', 'Python', 'C', 'C++', 'C#', 'Go', 'Ruby', 'PHP', 'SQL'],
  frameworks: ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Spring Boot', 'Django', 'Flask', 'Laravel'],
  databases: ['DynamoDB', 'MongoDB', 'MySQL', 'PostgreSQL', 'SQL Server', 'Redis', 'Oracle'],
  cloudTechnologies: ['AWS', 'Azure', 'Google Cloud', 'GCP', 'EC2', 'S3', 'Lambda', 'CloudFront'],
  devOpsTools: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Git', 'GitHub', 'Linux', 'Prometheus', 'Grafana'],
  softSkills: ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Adaptability', 'Collaboration']
};

const blockedNameTerms = new Set([
  'resume', 'cv', 'curriculum vitae', 'profile', 'summary', 'education', 'experience', 'projects',
  'skills', 'certifications', 'achievements', 'contact', 'personal details'
]);

const allSkills = Object.values(skillCatalog).flat();

function splitLines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function extractEmail(text) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || 'unknown@example.com';
}

function extractPhone(text) {
  return text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4}/)?.[0] || 'Not provided';
}

function isNameCandidate(line) {
  const cleaned = line.replace(/[^a-zA-Z\s.]/g, '').replace(/\s+/g, ' ').trim();
  const lower = cleaned.toLowerCase();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return cleaned
    && words.length >= 2
    && words.length <= 5
    && !blockedNameTerms.has(lower)
    && !line.includes('@')
    && !/\d{4,}/.test(line)
    && !/linkedin|github|portfolio|http|www/i.test(line)
    && !allSkills.some((skill) => lower === skill.toLowerCase());
}

function extractNameParts(text, email) {
  const headerLines = splitLines(text).slice(0, 12);
  const headerCandidate = headerLines
    .map((line) => line.replace(/[|•·]/g, ' '))
    .map((line) => line.replace(/[^a-zA-Z\s.]/g, '').replace(/\s+/g, ' ').trim())
    .find(isNameCandidate);

  const emailUser = email.split('@')[0]
    ?.replace(/[._-]+/g, ' ')
    .replace(/\d+/g, '')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

  const fullName = headerCandidate || (isNameCandidate(emailUser) ? emailUser : 'Unnamed Candidate');
  const parts = fullName.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || 'Unnamed',
    lastName: parts.slice(1).join(' ') || '',
    fullName
  };
}

function extractUrl(text, pattern) {
  return text.match(pattern)?.[0] || '';
}

function extractLocation(lines) {
  const locationLine = lines.slice(0, 12).find((line) => /location|address|chennai|bangalore|bengaluru|hyderabad|pune|mumbai|delhi|india/i.test(line));
  return locationLine?.replace(/location|address/ig, '').replace(/[:|-]/g, '').trim() || '';
}

function extractSummary(text) {
  const match = text.match(/(?:summary|profile|objective)\s*:?\s*([\s\S]{40,500}?)(?:\n\s*(?:education|skills|experience|projects|certifications)\b|$)/i);
  return match?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

function extractSkills(text) {
  const lower = text.toLowerCase();
  const grouped = Object.fromEntries(
    Object.entries(skillCatalog).map(([group, skills]) => [group, skills.filter((skill) => lower.includes(skill.toLowerCase()))])
  );
  return {
    grouped,
    flat: [...new Set(Object.values(grouped).flat())]
  };
}

function extractExperience(text) {
  const match = text.match(/(\d{1,2})\+?\s*(?:years|yrs)/i);
  return match ? Number(match[1]) : 0;
}

function extractEducation(text) {
  const degreeMatch = text.match(/\b(B\.?Tech|M\.?Tech|MBA|Bachelor|Master|BSc|MSc|PhD|BE|ME|BCA|MCA)\b/i);
  const departmentMatch = text.match(/\b(Computer Science|Information Technology|Electronics|Mechanical|Civil|Data Science|Artificial Intelligence)\b/i);
  const cgpaMatch = text.match(/(?:CGPA|GPA)\s*:?\s*([0-9.]{1,4})/i);
  const yearMatches = [...text.matchAll(/\b(20\d{2}|19\d{2})\b/g)].map((match) => Number(match[1]));
  const collegeLine = splitLines(text).find((line) => /college|university|institute/i.test(line)) || '';

  return {
    degree: degreeMatch?.[0] || 'Not specified',
    department: departmentMatch?.[0] || '',
    college: collegeLine,
    cgpa: cgpaMatch?.[1] || '',
    startYear: yearMatches[0] || '',
    endYear: yearMatches[1] || ''
  };
}

function extractSectionItems(text, sectionNames) {
  const names = sectionNames.join('|');
  const match = text.match(new RegExp(`(?:${names})\\s*:?\\s*([\\s\\S]*?)(?:\\n\\s*(?:education|skills|experience|projects|certifications|achievements|languages|volunteer)\\b|$)`, 'i'));
  if (!match) return [];
  return match[1].split(/\n|•|-/).map((item) => item.trim()).filter((item) => item.length > 3).slice(0, 8);
}

function extractProjects(text) {
  return extractSectionItems(text, ['projects', 'academic projects', 'personal projects']).map((item) => ({
    projectName: item.split(':')[0].slice(0, 80),
    description: item,
    technologies: allSkills.filter((skill) => item.toLowerCase().includes(skill.toLowerCase())),
    githubLink: extractUrl(item, /https?:\/\/(?:www\.)?github\.com\/[^\s]+/i),
    liveDemo: extractUrl(item, /https?:\/\/(?!.*github\.com)[^\s]+/i),
    duration: item.match(/\b\d+\s*(?:months?|weeks?)\b/i)?.[0] || '',
    role: item.match(/\b(?:developer|lead|designer|tester|engineer)\b/i)?.[0] || ''
  }));
}

function extractExperienceDetails(text) {
  const items = extractSectionItems(text, ['experience', 'work experience', 'employment']);
  return items.map((item) => ({
    company: item.match(/(?:at|@)\s+([A-Za-z0-9 .&]+)/i)?.[1]?.trim() || '',
    jobTitle: item.match(/\b(?:intern|developer|engineer|analyst|consultant|manager)\b/i)?.[0] || '',
    duration: item.match(/\b(?:\d+\+?\s*(?:years|yrs|months)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\s*[-–]\s*(?:present|\w+\s+\d{4}))\b/i)?.[0] || '',
    responsibilities: item
  }));
}

function extractCertifications(text) {
  return extractSectionItems(text, ['certifications', 'certificates']).map((item) => ({
    certificationName: item.split('-')[0].trim(),
    issuer: item.match(/(?:by|issuer)\s+([A-Za-z0-9 .&]+)/i)?.[1]?.trim() || '',
    date: item.match(/\b(?:20\d{2}|19\d{2})\b/)?.[0] || '',
    credentialUrl: extractUrl(item, /https?:\/\/[^\s]+/i)
  }));
}

function extractAchievements(text) {
  const items = extractSectionItems(text, ['achievements', 'awards', 'honors']);
  return {
    awards: items.filter((item) => /award|winner|rank|prize/i.test(item)),
    hackathons: items.filter((item) => /hackathon/i.test(item)),
    publications: items.filter((item) => /publication|paper|journal/i.test(item)),
    scholarships: items.filter((item) => /scholarship/i.test(item))
  };
}

function extractAdditionalInfo(text) {
  return {
    languages: extractSectionItems(text, ['languages']).slice(0, 6),
    volunteerWork: extractSectionItems(text, ['volunteer work', 'volunteering']),
    extracurricularActivities: extractSectionItems(text, ['extracurricular activities', 'activities'])
  };
}

async function extractPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const result = await pdf(buffer);
  return result.text;
}

async function extractDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractWithOcrFallback(filePath) {
  try {
    const result = await Tesseract.recognize(filePath, 'eng');
    return result.data?.text || '';
  } catch {
    return '';
  }
}

const resumeParserService = {
  async extractCandidateInfo(filePath, mimeType) {
    const extension = path.extname(filePath).toLowerCase();
    const isPdf = extension === '.pdf' || (extension !== '.docx' && mimeType === 'application/pdf');
    let text = isPdf ? await extractPdf(filePath) : await extractDocx(filePath);
    if (!text || text.trim().length < 80) {
      text = `${text || ''}\n${await extractWithOcrFallback(filePath)}`.trim();
    }

    const lines = splitLines(text);
    const email = extractEmail(text);
    const nameParts = extractNameParts(text, email);
    const skills = extractSkills(text);
    const educationDetails = extractEducation(text);
    const experienceDetails = extractExperienceDetails(text);
    const certifications = extractCertifications(text);
    const projects = extractProjects(text);
    const achievements = extractAchievements(text);
    const additionalInfo = extractAdditionalInfo(text);

    return {
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      fullName: nameParts.fullName,
      name: nameParts.fullName,
      email,
      phone: extractPhone(text),
      linkedIn: extractUrl(text, /https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/i),
      github: extractUrl(text, /https?:\/\/(?:www\.)?github\.com\/[^\s]+/i),
      portfolio: extractUrl(text, /https?:\/\/(?!.*(?:linkedin\.com|github\.com))[^\s]+/i),
      location: extractLocation(lines),
      summary: extractSummary(text),
      skills: skills.flat,
      skillGroups: skills.grouped,
      education: educationDetails.degree,
      educationDetails,
      experience: extractExperience(text),
      experienceDetails,
      projects,
      certifications,
      achievements,
      additionalInfo
    };
  }
};

export default resumeParserService;
