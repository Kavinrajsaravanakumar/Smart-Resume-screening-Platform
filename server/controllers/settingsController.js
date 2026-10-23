const settingsService = require('../services/settingsService');

async function getSettings(req, res, next) {
  try {
    const settings = await settingsService.getSettings(req.user._id);
    return res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const updated = await settingsService.updateSettings(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings,
};
