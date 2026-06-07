import logger from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  logger.error(error.stack || error.message);
  if (error.message?.includes('Only PDF and DOCX')) {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Resume file exceeds the configured size limit.' });
  }
  return res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : 'Internal server error.'
  });
}
