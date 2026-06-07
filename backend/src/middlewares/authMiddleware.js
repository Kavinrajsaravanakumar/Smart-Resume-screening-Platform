import authService from '../services/authService.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication token is required.' });
    }

    req.user = await authService.verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}
