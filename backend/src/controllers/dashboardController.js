import candidateService from '../services/candidateService.js';

export async function getDashboardStats(_req, res, next) {
  try {
    const stats = await candidateService.getDashboardStats();
    return res.json({ data: stats });
  } catch (error) {
    return next(error);
  }
}
