const jobProfileService = require('../services/jobProfileService');

async function getProfiles(req, res, next) {
  try {
    const profiles = await jobProfileService.getJobProfiles(req.user._id);
    return res.status(200).json({
      success: true,
      data: profiles,
      message: 'Job profiles retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function createProfile(req, res, next) {
  try {
    const profile = await jobProfileService.createJobProfile(req.user._id, req.body);
    return res.status(201).json({
      success: true,
      data: profile,
      message: 'Job profile created successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { id } = req.params;
    const profile = await jobProfileService.updateJobProfile(req.user._id, id, req.body);
    return res.status(200).json({
      success: true,
      data: profile,
      message: 'Job profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function activateProfile(req, res, next) {
  try {
    const { id } = req.params;
    const rescore = req.query.rescore === 'true' || req.body?.rescore === true;
    const profile = await jobProfileService.activateJobProfile(req.user._id, id, rescore);
    return res.status(200).json({
      success: true,
      data: profile,
      message: rescore
        ? 'Job profile activated and candidates re-scored'
        : 'Job profile activated successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProfile(req, res, next) {
  try {
    const { id } = req.params;
    const result = await jobProfileService.deleteJobProfile(req.user._id, id);
    return res.status(200).json({
      success: true,
      data: result,
      message: 'Job profile deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function rescoreCandidates(req, res, next) {
  try {
    const { id } = req.params;
    const result = await jobProfileService.rescoreAllCandidates(req.user._id, id);
    return res.status(200).json({
      success: true,
      data: result,
      message: `Successfully re-scored ${result.updatedCount} candidates against "${result.profileTitle}"`,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfiles,
  createProfile,
  updateProfile,
  activateProfile,
  deleteProfile,
  rescoreCandidates,
};
