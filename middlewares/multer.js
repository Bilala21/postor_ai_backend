const multer = require("multer");
const path = require("path");
const fs = require("fs");

const directory = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory)
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images and videos only!");
    }
  },
});

module.exports = upload;
