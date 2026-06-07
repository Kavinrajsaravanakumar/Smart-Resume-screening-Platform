import fs from 'fs/promises';
import path from 'path';

const dataDir = path.resolve('data');
const dataFile = path.join(dataDir, 'hr-users.json');

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, '[]');
  }
}

async function readRecords() {
  await ensureStore();
  const content = await fs.readFile(dataFile, 'utf-8');
  return JSON.parse(content || '[]');
}

async function writeRecords(records) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(records, null, 2));
}

export default {
  async insert(record) {
    const records = await readRecords();
    records.push(record);
    await writeRecords(records);
    return record;
  },
  async findByEmail(email) {
    const records = await readRecords();
    return records.find((record) => record.email.toLowerCase() === email.toLowerCase()) || null;
  },
  async findById(hrUserId) {
    const records = await readRecords();
    return records.find((record) => record.hrUserId === hrUserId) || null;
  }
};
