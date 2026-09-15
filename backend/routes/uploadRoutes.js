import path from 'path';
import express from 'express';
import multer from 'multer';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow images and common ID document types
const ALLOWED_EXTENSIONS = /jpg|jpeg|png|gif|pdf|doc|docx/;
// Legacy .doc uses 'application/msword' which doesn't contain "doc" as a
// substring, so it needs to be matched explicitly alongside the others.
const ALLOWED_MIMETYPES =
  /^image\/(jpe?g|png|gif)$|^application\/pdf$|^application\/msword$|^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/;

function checkFileType(file, cb) {
  const extname = ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase());
  const mimetype = ALLOWED_MIMETYPES.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, png, gif) and documents (pdf, doc, docx) are allowed'));
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Upload route
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file was uploaded');
  }
  // Return a web-usable relative path (Windows path.join uses backslashes,
  // which would break URLs on that platform)
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

export default router;