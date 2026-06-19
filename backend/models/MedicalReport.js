import mongoose from "mongoose";

const MedicalReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    publicId:{
        type: String,
        required: false
    },
    fileUrl: {
        type: String,
        required: true,
    },

    fileType: {
        type: String,
        enum: ["pdf", "image"],
        required: true,
    },

    reportName: String,
    reportType: {
        type: String,
        default: ""
    },

    summary: String,
    extractedText: String,

    riskLevel: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    },

    abnormalFindings: {
        type: [String],
        default: [],
    },

    explanations: {
        type: [String],
        default: [],
    },

    suggestions: {
        type: [String],
        default: [],
    },

    normalizedData: Object,
}, {
    timestamps: true,
});

// Indexes for dashboard queries
MedicalReportSchema.index({userId: 1});
MedicalReportSchema.index({riskLevel: 1});
MedicalReportSchema.index({createdAt: 1});

export default mongoose.model("MedicalReport", MedicalReportSchema);