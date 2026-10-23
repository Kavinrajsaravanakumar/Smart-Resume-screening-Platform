const dashboardService = require('../services/dashboardService');

async function getDashboard(req, res, next) {
  try {
    const data = await dashboardService.getDashboardData(req.user._id);
    return res.status(200).json({
      success: true,
      data,
      message: 'Dashboard data retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
};
