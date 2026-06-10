import { v4 as uuidv4 } from 'uuid';
import dynamoService from '../services/dynamoService.js';

export async function create({ name, email, passwordHash }) {
  const record = {
    hrUserId: uuidv4(),
    name,
    email,
    passwordHash,
    role: 'HR',
    createdAt: new Date().toISOString()
  };

  await dynamoService.createHrUser(record);
  return record;
}

export function findByEmail(email) {
  return dynamoService.getHrUserByEmail(email);
}

export function findById(hrUserId) {
  return dynamoService.getHrUserById(hrUserId);
}
