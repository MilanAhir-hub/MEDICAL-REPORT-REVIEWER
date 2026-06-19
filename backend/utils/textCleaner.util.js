export const cleanOCRText = (raw) => {
  if (!raw || typeof raw !== "string") return "";

  let text = raw;

  // Normalize unicode & OCR artifacts
  text = text
    .replace(/[|¦]/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/—|–/g, "-")
    .replace(/[~]{2,}/g, "")
    .replace(/\u00a0/g, " ");

  // Remove obvious junk lines
  const junkPatterns = [
    /powered by.*$/i,
    /sample letterhead/i,
    /scan to download/i,
    /not valid for medico legal purpose/i,
    /work timings.*$/i,
    /copyright.*$/i,
    /page \d+ of \d+/i,
    /https?:\/\/\S+/i,
    /^\s*©.*$/i
  ];

  text = text
    .split("\n")
    .filter(line => !junkPatterns.some(p => p.test(line)))
    .join("\n");

  // Fix broken medical spacing
  text = text
    .replace(/(\d)\s+([a-zA-Z%])/g, "$1 $2")   // 35.7 % → 35.7 %
    .replace(/([a-zA-Z])\s+(\d)/g, "$1 $2")   // Hb 15 → Hb 15
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s{3,}/g, "  "); // keep table spacing

  // Normalize known medical typos
  text = text
    .replace(/lakhs\/?cumm/gi, "lakhs/cumm")
    .replace(/million\/?cumm/gi, "million/cumm")
    .replace(/pg\b/gi, "Pg")
    .replace(/mcg\b/gi, "mcg");

  // Clean empty lines
  text = text
    .split("\n")
    .map(l => l.trimEnd())
    .filter(l => l.length > 0)
    .join("\n");

  return text.trim();
};
