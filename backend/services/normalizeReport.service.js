import logger from '../utils/logger.js';

export const normalizeBloodReport = (cleanedText) => {
  // Minimal validation
  if (!cleanedText || cleanedText.length < 100) {
    throw Object.assign(
      new Error("Empty or unreadable medical report"),
      { http_code: 400 }
    );
  }

  // Updated regex to handle:
  // - Test names (letters, spaces, parentheses)
  // - Values with commas (5,100)
  // - Units (g/dl, cumm, %, etc.)
  // - Ranges with spaces and commas (13-17, 4,800 - 10,800)
  const testRegex =
    /([A-Za-z][A-Za-z\s(),]+?)\s+([\d,]+(?:\.\d+)?)\s+([a-zA-Z/%]+)?\s*([\d,]+\s*[-–]\s*[\d,]+|<\s*[\d,]+)/g;

  const tests = [];
  let match;

  logger.info('Normalization started');

  while ((match = testRegex.exec(cleanedText)) !== null) {
    // Clean test name
    const name = match[1]
      .replace(/\b(Total|COUNT|DIFFERENTIAL|INDICES|VALUE|MEAN|CELL|CORPUSCULAR|VOLUME|HAEMOGLOBIN|CON)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    // Skip if name is too short or empty
    if (name.length < 2) continue;

    // Parse value (remove commas)
    const valueStr = match[2].replace(/,/g, "");
    const value = parseFloat(valueStr);

    // Get unit (optional)
    const unit = match[3] || "";

    // Parse range (remove commas and spaces)
    let range = match[4].replace(/,/g, "").replace(/\s+/g, "");
    
    let status = "NORMAL";

    if (range.includes("-")) {
      const [lowStr, highStr] = range.split(/[-–]/);
      const low = parseFloat(lowStr);
      const high = parseFloat(highStr);
      
      if (!isNaN(low) && !isNaN(high)) {
        if (value < low) status = "LOW";
        else if (value > high) status = "HIGH";
      } else {
        range = "UNKNOWN";
      }
    } else if (range.startsWith("<")) {
      const limitStr = range.replace("<", "");
      const limit = parseFloat(limitStr);
      if (!isNaN(limit)) {
        if (value >= limit) status = "HIGH";
      } else {
        range = "UNKNOWN";
      }
    } else {
      range = "UNKNOWN";
    }

    tests.push({
      name,
      value,
      unit,
      range,
      status
    });
  }

  logger.info(`Normalized ${tests.length} tests`);

  
  return { tests };
};
