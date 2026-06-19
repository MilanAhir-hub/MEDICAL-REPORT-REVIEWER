import express from "express";
import protect from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";
import { reportAnalysis, uploadReport, getReport, getReports, deleteReport } from "../controllers/report.controller.js";
import { validate } from "../middleware/validate.js";
import { uploadReportSchema, analyzeReportSchema } from "../validators/schemas.js";

const router = express.Router();

router.post("/upload_report", protect, upload.single("file"), validate(uploadReportSchema), uploadReport);
router.post("/analyze_report", protect, validate(analyzeReportSchema), reportAnalysis);
router.get('/reports', protect, getReports);
router.get("/report/:reportId", protect, getReport);
router.delete("/reports/:id", protect, deleteReport);

export default router;