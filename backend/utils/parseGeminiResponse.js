export const parseGeminiResponse = (aiText) => {
  try {
    // Gemini sometimes wraps JSON in text, so extract JSON only
    const jsonStart = aiText.indexOf("{");
    const jsonEnd = aiText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in AI response");
    }

    const jsonString = aiText.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI response parsing failed:", error.message);

    return {
      summary: "Unable to generate summary at this time.",
      abnormalFindings: [],
      explanations: [],
      suggestions: [],
      riskLevel: "unknown",
      reportType: "unknown"
    };
  }
};
