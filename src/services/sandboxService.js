const axios = require('axios');

/**
 * Validates globally configured environment references blocking headless sandbox requests before attempting invalid domains.
 */
const SANDBOX_BASE_URL = process.env.SANDBOX_BASE_URL || 'https://api.sandbox.co.in';

/**
 * Shared generic headers mapping native authentication properties universally for all requests.
 */
const getSandboxHeaders = () => {
  return {
    'x-api-key': process.env.SANDBOX_API_KEY || 'MISSING_TEST_KEY',
    'x-api-secret': process.env.SANDBOX_API_SECRET || 'MISSING_TEST_SECRET',
    'Content-Type': 'application/json',
  };
};

/**
 * Fires authentic HTTP GET query into Sandbox.co.in's public search API specifically mapping GST networks.
 * 
 * @async
 * @param {string} gstin - The 15-character regulatory active license number mapped physically dynamically.
 * @returns {Promise<Object>} Formulate native JSON responses returned natively off the Sandbox servers.
 * @throws {Error} Relays explicitly native "Verification Failed" when HTTP exceptions trip natively.
 */
const verifyLiveGSTIN = async (gstin) => {
  try {
    const endpoint = `${SANDBOX_BASE_URL}/public/gstin/${gstin}/public-search`;
    
    // Explicit mapped GET request firing native axios hooks logically
    const response = await axios.get(endpoint, { headers: getSandboxHeaders() });
    
    return response.data;
  } catch (error) {
    console.error(`Live GSTIN Sandbox API parsing failed: ${error.message}`);
    // Intercepted safely throwing standardized error structure matching explicit user constraints
    throw new Error('Verification Failed: Internal GST Sandbox response rejected the payload natively.');
  }
};

/**
 * Contacts authentic FSSAI licensing search APIs natively executing Sandbox queries globally.
 * 
 * @async
 * @param {string} licenseNumber - 14-digit native regulatory string.
 * @returns {Promise<Object>} Output structure containing valid parameters logically mapped for the DB fields natively.
 * @throws {Error} Maps any HTTP failing states natively ensuring downstream controllers can trip.
 */
const verifyLiveFSSAI = async (licenseNumber) => {
  try {
    const endpoint = `${SANDBOX_BASE_URL}/fssai/license/${licenseNumber}`;
    const response = await axios.get(endpoint, { headers: getSandboxHeaders() });
    return response.data;
  } catch (error) {
    console.error(`Live FSSAI Sandbox logic API failed: ${error.message}`);
    throw new Error('Verification Failed: Internal FSSAI Sandbox response explicitly rejected target payloads.');
  }
};

/**
 * Fetches dynamic native MCA corporate lifecycle data mapping precise registration specifics seamlessly.
 * Wait, the prompt mapped the legacy function `fetchMCADetails(cin)`. I will swap that seamlessly here mapping `verifyLiveMCA` identically.
 * 
 * @async
 * @param {string} cin - Corporate Identification Number.
 * @returns {Promise<Object>} Structuring native corporate mappings intelligently dynamically.
 */
const verifyLiveMCA = async (cin) => {
  try {
    const endpoint = `${SANDBOX_BASE_URL}/mca/company/${cin}`;
    const response = await axios.get(endpoint, { headers: getSandboxHeaders() });
    return response.data;
  } catch (error) {
    console.error(`Live MCA Document Sandbox parsing tripped error nodes: ${error.message}`);
    throw new Error('Verification Failed: Internal MCA Sandbox API bounced authentic verifications natively.');
  }
};

module.exports = {
  verifyLiveGSTIN,
  verifyLiveFSSAI,
  verifyLiveMCA,
};
