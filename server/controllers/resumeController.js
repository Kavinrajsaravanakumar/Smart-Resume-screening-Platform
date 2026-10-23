const resumeService = require('../services/resumeService');

async function upload(req, res, next) {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'No PDF resume files uploaded',
      });
    }

    const candidates = await resumeService.uploadResumes(files, req.user);
    return res.status(201).json({
      success: true,
      data: candidates.length === 1 ? candidates[0] : candidates,
      message: `${candidates.length} resume(s) processed and evaluated successfully`,
    });
  } catch (error) {
    next(error);
  }
}

async function getResumeFile(req, res, next) {
  try {
    const { candidateId } = req.params;
    const { data, mimeType, fileName } = await resumeService.getResumePdf(candidateId, req.user._id);

    res.setHeader('Content-Type', mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    return res.send(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  upload,
  getResumeFile,
};
