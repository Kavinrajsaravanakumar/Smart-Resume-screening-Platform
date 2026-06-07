import fs from 'fs/promises';
import path from 'path';

const dataDir = path.resolve('data');
const dataFile = path.join(dataDir, 'candidates.json');

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
  },
  async findAll() {
    return readRecords();
  },
  async findById(candidateId) {
    const records = await readRecords();
    return records.find((record) => record.candidateId === candidateId) || null;
  },
  async remove(candidateId) {
    const records = await readRecords();
    const nextRecords = records.filter((record) => record.candidateId !== candidateId);
    await writeRecords(nextRecords);
    return nextRecords.length !== records.length;
  }
};
