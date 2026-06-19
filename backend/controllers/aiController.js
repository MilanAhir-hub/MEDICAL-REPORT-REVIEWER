import { analyzeReportWithGemini } from '../services/gemini.service.js';

export const analyzeReport = async (normalizedData, language) => {
  if (!normalizedData || Object.keys(normalizedData).length === 0) {
    throw new Error("Normalized report data is required");
  }

  const aiResult = await analyzeReportWithGemini(normalizedData, language);

  

  return {
    success: true,
    aiAnalysis: aiResult
  };
};
