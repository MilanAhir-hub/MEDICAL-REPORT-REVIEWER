const VALID_RISK_LEVELS = ["low", "medium", "high"];

export const filterAIAnalysis = (parsedAIData) => {
  const riskLevel = (parsedAIData.riskLevel || "unknown").toLowerCase();
  const validRiskLevel = VALID_RISK_LEVELS.includes(riskLevel) ? riskLevel : "unknown";

  const abnormalFindings = Array.isArray(parsedAIData.abnormalFindings)
    ? parsedAIData.abnormalFindings.filter(f => typeof f === "string" && f.trim().length > 0)
    : [];

  const explanations = Array.isArray(parsedAIData.explanations)
    ? parsedAIData.explanations.filter(e => typeof e === "string" && e.trim().length > 0)
    : [];

  const suggestions = Array.isArray(parsedAIData.suggestions)
    ? parsedAIData.suggestions.filter(s => typeof s === "string" && s.trim().length > 0)
    : [];

  return {
    summary: typeof parsedAIData.summary === "string" ? parsedAIData.summary.trim() : "",
    abnormalFindings,
    explanations,
    suggestions,
    riskLevel: validRiskLevel,
    reportType: typeof parsedAIData.reportType === "string" ? parsedAIData.reportType.trim() : "unknown"
  };
};
