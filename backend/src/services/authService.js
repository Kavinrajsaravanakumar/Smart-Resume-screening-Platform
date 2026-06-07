import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import * as HrUser from '../models/hrUserModel.js';

function publicUser(user) {
  return {
    hrUserId: user.hrUserId,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.hrUserId, email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
}

const authService = {
  async register({ name, email, password }) {
    const existing = await HrUser.findByEmail(email);
    if (existing) {
      const error = new Error('An HR account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await HrUser.create({ name, email, passwordHash });
    return { user: publicUser(user), token: signToken(user) };
  },

  async login({ email, password }) {
    const user = await HrUser.findByEmail(email);
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!valid) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }
    return { user: publicUser(user), token: signToken(user) };
  },

  async verifyToken(token) {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await HrUser.findById(payload.sub);
    if (!user) {
      const error = new Error('Authenticated HR user no longer exists.');
      error.statusCode = 401;
      throw error;
    }
    return publicUser(user);
  }
};

export default authService;
