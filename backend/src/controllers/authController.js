import authService from '../services/authService.js';
import { loginSchema, registerSchema } from '../validators/authValidator.js';

export async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const result = await authService.register(value);
    return res.status(201).json({ message: 'HR account registered successfully.', data: result });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const result = await authService.login(value);
    return res.json({ message: 'Login successful.', data: result });
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res) {
  return res.json({ data: req.user });
}
