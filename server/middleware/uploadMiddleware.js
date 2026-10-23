const multer = require('multer');
const path = require('path');

// Use memoryStorage so the PDF buffer is kept in memory and saved to MongoDB
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';
  const isPdfMime = file.mimetype === 'application/pdf';

  if (isPdfExt || isPdfMime) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;
