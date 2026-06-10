import multer from 'multer';
import path from 'path';
import config from '../config/index.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const validExtension = extension === '.pdf' || extension === '.docx';
    if (!validExtension) {
      return cb(new Error('Only PDF and DOCX resume files are allowed.'));
    }
    return cb(null, true);
  }
});

export default upload;
