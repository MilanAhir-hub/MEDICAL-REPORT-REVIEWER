import { geminiAI } from "../config/gemini.js";
import { filterAIAnalysis } from "../utils/filterAIAnalysis.js";
import { parseGeminiResponse } from "../utils/parseGeminiResponse.js";
import { buildMedicalPrompt } from "../utils/promptBuilder.js";
import logger from "../utils/logger.js";

export const analyzeReportWithGemini = async (normalizedReport, language = 'english') => {
  logger.info(`Gemini service — language: ${language}`);
  
  const prompt = buildMedicalPrompt(normalizedReport, language);

  const response = await geminiAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  const rawText = response.text;

  const parsed = parseGeminiResponse(rawText);
  const filtered = filterAIAnalysis(parsed);

  return filtered;
};
