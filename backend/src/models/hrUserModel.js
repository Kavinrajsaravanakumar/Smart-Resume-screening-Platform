import { v4 as uuidv4 } from 'uuid';
import db from '../repositories/localHrUserRepository.js';

export async function create({ name, email, passwordHash }) {
  return db.insert({
    hrUserId: uuidv4(),
    name,
    email,
    passwordHash,
    role: 'HR',
    createdAt: new Date().toISOString()
  });
}

export function findByEmail(email) {
  return db.findByEmail(email);
}

export function findById(hrUserId) {
  return db.findById(hrUserId);
}
