const analyticsService = require('../services/analyticsService');

async function getAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getAnalyticsData(req.user._id);
    return res.status(200).json({
      success: true,
      data,
      message: 'Analytics data retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAnalytics,
};
