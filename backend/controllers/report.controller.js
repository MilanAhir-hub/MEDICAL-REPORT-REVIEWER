import uploadToCloudinary from '../utils/cloudinaryUpload.js';
import { extractRawTextFromFile } from '../services/extractRawText.service.js';
import { normalizeBloodReport } from '../services/normalizeReport.service.js';
import MedicalReport from '../models/MedicalReport.js';
import User from '../models/User.js';
import { cleanOCRText } from '../utils/textCleaner.util.js';
import { analyzeReport } from './aiController.js';
import logger from '../utils/logger.js';
import cloudinary from '../config/cloudinary.js';

export const uploadReport = async (req, res) => {
    try {
        const report = req.file;
        const reportType = req.body.reportType;

        logger.info(`Upload started — userId: ${req.user.id}, reportType: ${reportType}`);

        if (!report) {
            return res.status(400).json({
                success: false,
                message: "Please upload a report"
            });
        }

        // Decide folder based on file type
        let folderName = "hospital_reports/others";
        if (report.mimetype.startsWith("image/")) {
            folderName = "hospital_reports/images";
        } else if (report.mimetype === "application/pdf") {
            folderName = "hospital_reports/pdfs";
        }

        // Upload to Cloudinary FIRST (before buffer gets consumed)
        const result = await uploadToCloudinary(report.buffer, folderName);
        logger.info(`Cloudinary upload complete — public_id: ${result.public_id}`);

        // Extract raw text from the file
        const rawText = await extractRawTextFromFile(report.buffer);

        if (!rawText || rawText.trim().length < 30) {
            throw Object.assign(
                new Error("Empty or unreadable report"),
                { http_code: 400 }
            );
        }

        logger.info(`Text extracted — length: ${rawText.length}`);

        const cleanedText = cleanOCRText(rawText);
        logger.info(`Text cleaned — length: ${cleanedText.length}`);

        const normalizedData = normalizeBloodReport(cleanedText);
        logger.info(`Report normalized — tests found: ${normalizedData?.tests?.length ?? 0}`);

        const fileType = report.mimetype === "application/pdf" ? "pdf" : "image";

        const reportData = await MedicalReport.create({
            userId: req.user.id,
            title: report.originalname,
            publicId: result.public_id,
            fileUrl: result.secure_url,
            fileType,
            reportType,
            summary: "",
            extractedText: rawText,
            riskLevel: "low",
            normalizedData,
        });

        logger.info(`Report saved to DB — reportId: ${reportData._id}`);

        return res.status(200).json({
            success: true,
            message: "Hospital report uploaded successfully",
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                file_type: report.mimetype,
                folder: folderName,
                raw_text: rawText,
                reportData,
            },
        });
    } catch (error) {
        logger.error('Upload error', error);
        return res.status(error.http_code || 500).json({
            success: false,
            message: error.http_code === 400
                ? error.message
                : "Failed to upload hospital report",
        });
    }
};

export const reportAnalysis = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reportId } = req.body;

        logger.info(`Analysis started — userId: ${userId}, reportId: ${reportId}`);

        const user = await User.findById(userId).select('language');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const language = user.language || 'english';
        logger.info(`Analysis language: ${language}`);

        if (!reportId) {
            return res.status(400).json({
                success: false,
                message: "Report ID is required",
            });
        }

        const report = await MedicalReport.findOne({ _id: reportId, userId });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "No report found for this user",
            });
        }

        const normalizedData = report.normalizedData;
        const summary = await analyzeReport(normalizedData, language);

        logger.info(`AI analysis complete — reportId: ${reportId}`);

        const riskLevel = summary.aiAnalysis.riskLevel;

        await report.updateOne({
            riskLevel,
            summary: summary.aiAnalysis.summary,
            abnormalFindings: summary.aiAnalysis.abnormalFindings,
            explanations: summary.aiAnalysis.explanations,
            suggestions: summary.aiAnalysis.suggestions,
        });

        logger.info(`Report updated with analysis — reportId: ${reportId}`);

        return res.status(200).json({
            success: true,
            message: "Report analyzed successfully",
            aiAnalysis: summary.aiAnalysis
        });
    } catch (error) {
        logger.error('Report analysis error', error);

        let errorMessage = "Failed to analyze report";
        let statusCode = 500;

        if (error.status === 503 || error.message?.includes("503")) {
            errorMessage = "AI service is temporarily unavailable. Please try again in a moment.";
            statusCode = 503;
        } else if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
            errorMessage = "AI service quota exceeded. Please try again later.";
            statusCode = 429;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
        });
    }
};

export const getReport = async (req, res) => {
    try {
        const userId = req.user.id;

        const report = await MedicalReport.findOne({ userId }).sort({ createdAt: -1 });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "No report found for this user",
            });
        }

        return res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        logger.error('Get report error', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get report",
        });
    }
};

export const getReports = async (req, res) => {
    try {
        const userId = req.user.id;

        const reports = await MedicalReport.find({ userId }).sort({ createdAt: -1 });

        if (!reports) {
            return res.status(404).json({
                success: false,
                message: "No reports found for this user",
            });
        }

        return res.status(200).json({
            success: true,
            reports
        });
    } catch (error) {
        logger.error('Get reports error', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get reports",
        });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        logger.info(`Delete report requested — userId: ${userId}, reportId: ${id}`);

        const report = await MedicalReport.findOne({ _id: id, userId });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "No report found or unauthorized to delete this report",
            });
        }

        // Delete from Cloudinary if publicId exists
        if (report.publicId) {
            try {
                logger.info(`Deleting file from Cloudinary — publicId: ${report.publicId}`);
                await cloudinary.uploader.destroy(report.publicId);
            } catch (clErr) {
                logger.error(`Failed to delete from Cloudinary — publicId: ${report.publicId}`, clErr);
            }
        }

        await report.deleteOne();
        logger.info(`Report deleted from database — reportId: ${id}`);

        return res.status(200).json({
            success: true,
            message: "Report deleted successfully"
        });
    } catch (error) {
        logger.error('Delete report error', error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete report"
        });
    }
};
