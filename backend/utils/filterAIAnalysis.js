export const filterAIAnalysis = (parsedAIData) => {
  return {
    summary: parsedAIData.summary || "",
    abnormalFindings: parsedAIData.abnormalFindings || [],
    explanations: parsedAIData.explanations || [],
    suggestions: parsedAIData.suggestions || [],
    riskLevel: parsedAIData.riskLevel || "unknown",
    reportType: parsedAIData.reportType || "unknown"
  };
};
