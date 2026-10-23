const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jobProfileService = require('./jobProfileService');

function generateToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretkey_srs_platform_2026_jwt_token',
    { expiresIn: '7d' }
  );
}

async function registerUser({ name, email, password, role }) {
  if (!name || !email || !password) {
    throw new Error('Please provide name, email, and password');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'HR Director',
  });

  // Create default active job profile for this new user
  try {
    await jobProfileService.createDefaultProfileForUser(user._id);
  } catch (err) {
    console.error('Failed to create default job profile on user register:', err.message);
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  };
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  };
}

async function getMe(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

async function updateProfile(userId, { name, role }) {
  if (!name || !name.trim()) {
    throw new Error('Full name is required');
  }

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  user.name = name.trim();
  if (role !== undefined && role !== null) {
    user.role = role.trim() || 'HR Recruiter';
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

async function updatePassword(userId, { currentPassword, newPassword, confirmPassword }) {
  if (!currentPassword || !newPassword) {
    throw new Error('Current password and new password are required');
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    throw new Error('New password and confirm password do not match');
  }

  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters');
  }

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword; // Mongoose pre('save') hook will hash with bcrypt
  await user.save();

  return { message: 'Password updated successfully' };
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  updatePassword,
};
