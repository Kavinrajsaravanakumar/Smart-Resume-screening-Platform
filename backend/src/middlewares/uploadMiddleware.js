import fs from "fs";
import multer from "multer";
import path from "path";
import config from "../config/index.js";

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    console.log("UPLOAD FILE:", file.originalname);
    console.log("MIMETYPE:", file.mimetype);

    const extension = path.extname(file.originalname).toLowerCase();

    console.log("EXTENSION:", extension);

    const validExtension = extension === ".pdf" || extension === ".docx";

    console.log("VALID:", validExtension);

    if (!validExtension) {
      return cb(new Error("Only PDF and DOCX resume files are allowed."));
    }

    return cb(null, true);
  },
});

export default upload;
