const { scanDocumentWithAI } = require('../services/ocrService');

/**
 * High-performance standalone AI Controller expressly isolating Google Gemini OCR generation loops explicitly away from external sandbox dependencies.
 * Consumes Multer memory buffers directly mapping payloads to Gemini natively.
 *
 * @async
 * @param {express.Request} req - Mutated req possessing 'file' properties validated under 5MB boundaries.
 * @param {express.Response} res - Outputs Native JSON formatted intelligence mappings for frontend usage.
 */
const scanDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Mandatory PDF or Image file buffer is missing from the designated OCR payload natively.');
    }

    // Isolate explicit parameters directly off execution bypassing validations cleanly.
    const extractedData = await scanDocumentWithAI(req.file.buffer, req.file.mimetype);

    res.status(200).json({
      success: true,
      message: 'Certificate cleanly processed autonomously by Gemini Flash Native JSON.',
      data: extractedData,
    });
  } catch (error) {
    next(error); // Bounce out natively falling neatly into global error handlers protecting execution pools.
  }
};

module.exports = {
  scanDocument,
};
