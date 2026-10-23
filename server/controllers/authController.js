const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { name, firstName, lastName, email, password, role } = req.body;
    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();
    const result = await authService.registerUser({
      name: fullName,
      email,
      password,
      role,
    });
    return res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return res.status(200).json({
      success: true,
      data: result,
      message: 'Logged in successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user._id);
    return res.status(200).json({
      success: true,
      data: user,
      message: 'User profile fetched successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, role } = req.body;
    const user = await authService.updateProfile(req.user._id, { name, role });
    return res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const result = await authService.updatePassword(req.user._id, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return res.status(200).json({
      success: true,
      data: result,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
};
