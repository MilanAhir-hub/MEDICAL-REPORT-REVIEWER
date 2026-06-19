import multer from "multer";

//store files in memory as buffer (RAM)
const storage = multer.memoryStorage();

//let allow only images and PDFs
const filter = (req, file, cb) => {
if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed"), false);
  }
}

//create multer instance
export const upload = multer({
  storage,
  filter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});