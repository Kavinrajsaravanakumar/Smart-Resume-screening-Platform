const candidateService = require('../services/candidateService');

async function getCandidates(req, res, next) {
  try {
    const { search, status } = req.query;
    const candidates = await candidateService.getAllCandidates(req.user._id, { search, status });
    return res.status(200).json({
      success: true,
      data: candidates,
      message: 'Candidates retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function getCandidate(req, res, next) {
  try {
    const { id } = req.params;
    const candidate = await candidateService.getCandidateById(req.user._id, id);
    return res.status(200).json({
      success: true,
      data: candidate,
      message: 'Candidate retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function updateCandidate(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await candidateService.updateCandidate(req.user._id, id, req.body);
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Candidate updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Status is required',
      });
    }
    const updated = await candidateService.updateCandidateStatus(req.user._id, id, status);
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Candidate status updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function deleteCandidate(req, res, next) {
  try {
    const { id } = req.params;
    const result = await candidateService.deleteCandidate(req.user._id, id);
    return res.status(200).json({
      success: true,
      data: result,
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCandidates,
  getCandidate,
  updateCandidate,
  updateStatus,
  deleteCandidate,
};
