import Tesseract from "tesseract.js";
import { fileTypeFromBuffer } from "file-type";
import { PDFParse } from "pdf-parse";

export const extractRawTextFromFile = async (file) => {
  if (!file?.buffer) {
    throw new Error("Invalid file input");
  }

  const buffer = file.buffer;
  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType) {
    throw new Error("Unsupported or unknown file type");
  }

  let rawText = "";

  if (fileType.mime === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    if (result.text?.trim().length > 50) {
      rawText = result.text;
    } else {
      const ocr = await Tesseract.recognize(buffer, "eng");
      rawText = ocr.data.text;
    }
  }

  else if (fileType.mime.startsWith("image/")) {
    const ocr = await Tesseract.recognize(buffer, "eng");
    rawText = ocr.data.text;
  }

  else {
    throw new Error("Unsupported file format");
  }

  return rawText;
};
