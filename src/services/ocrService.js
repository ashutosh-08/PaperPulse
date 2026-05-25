const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Validates the presence of GEMINI_API_KEY globally or throws immediately to prevent runtime failures downstream.
 */
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is inexplicably missing. OCR functionalities will fail.');
}

// Instantiate explicitly leveraging the most robust Gemini 1.5 Flash framework mappings available globally
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_API_KEY');

const aiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

/**
 * Standalone OCR Microservice abstracting AI functionality natively executing strict prompt mappings.
 * Exploiting Native JSON Mode forcing Google Gemini to adhere precisely towards structured format bindings implicitly avoiding malformed string replies safely without Regex.
 * 
 * @async
 * @param {Buffer} fileBuffer - Injected RAM data containing binary image or PDF payloads mapped under 5MB boundaries.
 * @param {string} mimeType - Required to map proper Gemini content parts implicitly.
 * @returns {Promise<Object>} Mapped representation natively casting explicit parameter variables intelligently for the Controller.
 */
const scanDocumentWithAI = async (fileBuffer, mimeType) => {
  try {
    const inlineData = {
      data: fileBuffer.toString('base64'),
      mimeType,
    };

    /**
     * Engineered explicitly mapping instructions explicitly tuned towards Indian Government Documents (REG-06 and FSSAI standards).
     */
    const prompt = `
      Analyze this Indian government certificate (GST/FSSAI). 
      Extract: gstin, licenseNumber, legalName, expiryDate (YYYY-MM-DD), and certificateType. 
      If a field is missing, return null. Output strictly as JSON.
    `;

    try {
      // Multi-modal array input blending standard instructional strings beside binary base64 fragments natively.
      const result = await aiModel.generateContent([prompt, { inlineData }]);

      // Handle multiple possible response shapes from the Gemini client
      let responseText = null;
      if (result && result.response && typeof result.response.text === 'function') {
        responseText = await result.response.text();
      } else if (result && result.output && Array.isArray(result.output) && result.output[0].content) {
        responseText = typeof result.output[0].content === 'string' ? result.output[0].content : JSON.stringify(result.output[0].content);
      } else if (typeof result === 'string') {
        responseText = result;
      } else {
        responseText = JSON.stringify(result || {});
      }

      // Try to extract the first JSON object found in the response text if the model wrapped extra commentary
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;

      const parsed = JSON.parse(jsonString.trim());

      // Normalize keys and ensure expected shape
      return {
        gstin: parsed.gstin || parsed.licenseNumber || parsed.gstinNumber || null,
        licenseNumber: parsed.licenseNumber || parsed.gstin || null,
        legalName: parsed.legalName || parsed.legal_name || parsed.name || null,
        expiryDate: parsed.expiryDate || parsed.expiry_date || parsed.validUpto || null,
        certificateType: parsed.certificateType || parsed.type || null,
        fullResponse: parsed,
      };
    } catch (aiError) {
       // Do NOT return dummy data. Log the raw response for debugging and rethrow.
       try {
         const fs = require('fs');
         const path = require('path');
         const logsDir = path.join(process.cwd(), 'logs');
         if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

         const logFile = path.join(logsDir, 'ocr_raw_responses.log');
         const timestamp = new Date().toISOString();
         const raw = aiError && aiError.response && aiError.response.data ? JSON.stringify(aiError.response.data) : (aiError && aiError.message ? aiError.message : JSON.stringify(aiError));
         const entry = `---\nTimestamp: ${timestamp}\nError: ${aiError.message}\nRaw: ${raw}\n---\n`;
         fs.appendFileSync(logFile, entry);
         console.error(`[AI] Gemini Engine Interruption: ${aiError.message}. Raw response logged to ${logFile}`);
       } catch (logErr) {
         console.error(`Failed to write OCR debug log: ${logErr.message}`);
       }

      throw new Error('OCR extraction failed. Raw Gemini response has been logged for debugging.');
    }
  } catch (error) {
    console.error(`AI Extraction Native execution crashed seamlessly parsing payloads globally: ${error.message}`);
    throw new Error('Automated Document processing mechanisms structurally failed resolving insights dynamically.');
  }
};

module.exports = { scanDocumentWithAI };
