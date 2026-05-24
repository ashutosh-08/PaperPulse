/**
 * Simulates a response from the Indian GST Council API port for checking tax compliance status.
 * This function artificially delays resolution to mimic network latency.
 *
 * @async
 * @function verifyGSTIN
 * @param {string} gstin - The 15-digit alphanumeric PAN-based Goods and Services Tax Identification Number.
 * @returns {Promise<Object>} Mock metadata describing the firm's overall GST filing health.
 */
const verifyGSTIN = async (gstin) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        gstin,
        businessName: 'Mock Enterprise Solutions Pvt Ltd',
        status: 'Active',
        lastFilingDate: new Date().toISOString(),
        pendingLiabilities: 0,
      });
    }, 800); // artificially lag mock to illustrate typical REST IO blocks
  });
};

/**
 * Accesses mocked FSSAI registry endpoints checking a particular Food License validity.
 *
 * @async
 * @function checkFSSAILicense
 * @param {string} licenseNumber - 14-digit FSSAI regulatory number.
 * @returns {Promise<Object>} Mock response displaying food license authenticity limits.
 */
const checkFSSAILicense = async (licenseNumber) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        licenseNumber,
        category: 'Retail/Distribution',
        validUpto: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Valid for 1 future year
        status: 'Valid',
      });
    }, 600);
  });
};

/**
 * Replicates Ministry of Corporate Affairs Company Master Data Lookup operations.
 * Highly valuable for onboarding Private Limited or LLP Indian incorporations cleanly.
 *
 * @async
 * @function fetchMCADetails
 * @param {string} cin - Corporate Identification Number (CIN) starting with L/U identifying the entity.
 * @returns {Promise<Object>} Extensive registry document snapshot mimicking MCA V3 Portal parameters.
 */
const fetchMCADetails = async (cin) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        cin,
        companyName: 'MOCK INNOVATIONS PRIVATE LIMITED',
        dateOfIncorporation: '2015-08-25',
        rocCode: 'RoC-Delhi',
        paidUpCapital: 500000,
        directors: ['John Doe', 'Jane Smith'],
      });
    }, 1200);
  });
};

module.exports = {
  verifyGSTIN,
  checkFSSAILicense,
  fetchMCADetails,
};
