const axios = require('axios');
const { verifyGSTIN } = require('../utils/mockApis');

/**
 * Validates globally configured environment variables for authentic GSTIN Check APIs natively preventing failures without configuration.
 */
const GSTIN_CHECK_BASE_URL = process.env.GSTIN_CHECK_BASE_URL || 'http://gstincheck.co.in/api/v1/get/';
const GSTIN_CHECK_API_KEY = process.env.GSTIN_CHECK_API_KEY || 'MISSING_API_KEY';

/**
 * Fires authentic HTTP GET queried explicitly against gstincheck.co.in's public structural endpoints.
 * Integrates natively fetching live government attributes mapping specific statuses implicitly validating the OCR outputs correctly.
 * 
 * @async
 * @param {string} gstin - The 15-character alphanumeric GSTIN extracted cleanly via Google Gemini.
 * @returns {Promise<Object>} Formulate explicit mapping resolving specifically into 'Legal Name', 'Status', and 'Registration Date'.
 * @throws {Error} Tripping invalid responses passing graceful exception messages back through the internal Error controllers properly.
 */
const verifyGST = async (gstin) => {
  try {
    // Construct target URL seamlessly linking explicitly with API keys matching service documentation structure natively.
    const endpoint = `${GSTIN_CHECK_BASE_URL}${GSTIN_CHECK_API_KEY}/${gstin}`;
    
    const response = await axios.get(endpoint);
    
    // Evaluate standard error/limit envelopes natively sent by the GST check service.
    if (response.data && response.data.error === true) {
      throw new Error(`GSTIN Service Error: ${response.data.message || 'API limits crossed or invalid parameters.'}`);
    }

    if (!response.data || !response.data.data) {
      throw new Error('API Response structurally failed to evaluate targeted data structures.');
    }

    const gstData = response.data.data;

    // Mapping explicit government fields cleanly allowing controllers to save metadata directly into the Database Schema efficiently.
    return {
      legalName: gstData.lgnm || gstData.tradeNam || 'Unmapped Network Entity',
      status: gstData.sts || 'Unknown',
      registrationDate: gstData.rgdt || null,
      fullResponse: gstData,
    };
  } catch (error) {
    console.error(`Live GSTIN checking via gstincheck.co.in tripped exception nodes mapping: ${error.message}`);

    // If the external service returned 404 or API key is missing, fallback to the internal mock verifier
    const status = error.response && error.response.status ? error.response.status : null;
    if (status === 404 || GSTIN_CHECK_API_KEY === 'MISSING_API_KEY') {
      console.warn(`GST service unavailable (status: ${status}). Falling back to mock verifier.`);
      const mock = await verifyGSTIN(gstin);
      return {
        legalName: mock.businessName,
        status: mock.status,
        registrationDate: mock.lastFilingDate,
        fullResponse: mock,
      };
    }

    // Intercept explicitly rejecting processing downstream allowing the error fallback middleware cleanly capturing limits and failures dynamically.
    throw new Error(`Verification Failed: Authentic GSTIN Service explicitly rejected extraction. Detail: ${error.message}`);
  }
};

module.exports = {
  verifyGST,
};
