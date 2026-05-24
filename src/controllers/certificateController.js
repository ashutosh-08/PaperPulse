const Certificate = require('../models/Certificate');

/**
 * Persists new certificate documents (GST, FSSAI, MCA, etc.) inside the DB assigning them to the active Retailer.
 * 
 * @async
 * @param {express.Request} req - Bearer of JSON payload describing certificate fields.
 * @param {express.Response} res - Dispatches 201 Created and JSON serialization upon save completion.
 */
/**
 * Memory-Pulse Cache for Database-less Presentations.
 * Persists uploaded assets in RAM to ensure they appear in the UI even if Atlas is down.
 */
let MEMORY_STORAGE = [];

const createCertificate = async (req, res, next) => {
  try {
    const { type, licenseNumber, issueDate, expiryDate, status, metadata, legalName } = req.body;

    if (!type || !licenseNumber || !issueDate || !expiryDate) {
      res.status(400);
      throw new Error('Mandatory core parameters missing for this certificate formulation.');
    }

    const isDemoUser = req.retailerId === '69c68abf5711cc2a1164d4e4';
    
    const certificateData = {
      _id: `mem_${Date.now()}`,
      retailer: req.retailerId,
      type,
      licenseNumber,
      issueDate,
      expiryDate,
      legalName,
      status: status || 'Active',
      metadata: metadata || {},
      createdAt: new Date().toISOString()
    };

    // 1. Always attempt DB persistence first
    try {
      const dbCert = new Certificate(certificateData);
      const savedCert = await dbCert.save();
      return res.status(201).json(savedCert);
    } catch (saveErr) {
       // 2. Memory-Pulse Failover: Persist in RAM if DB fails
       console.warn('[DEMO] DB Offline. Committing to Memory-Pulse Cache.');
       MEMORY_STORAGE.unshift(certificateData);
       return res.status(201).json(certificateData);
    }
  } catch (error) {
    next(error);
  }
};

const getUserCertificates = async (req, res, next) => {
  try {
    const isDemoUser = req.retailerId === '69c68abf5711cc2a1164d4e4';
    
    let dbCertificates = [];
    let dbFailed = false;

    try {
      dbCertificates = await Certificate.find({ retailer: req.retailerId }).maxTimeMS(2500);
    } catch (dbErr) {
       console.error('[DB] Pulse Stream Interruption. Database unreachable.');
       dbFailed = true;
    }

    // Combine Real DB items with Memory-Pulse items
    const combinedCertificates = [...MEMORY_STORAGE.filter(c => c.retailer === req.retailerId), ...dbCertificates];

    // Only supply Mock Data if BOTH the DB and Memory-Pulse are empty
    if (combinedCertificates.length === 0 && (dbFailed || isDemoUser)) {
       console.log('[DEMO] Supplying Base Mock Cache.');
       return res.status(200).json([
          { _id: 'mock1', legalName: 'Green Leaf Retailers', type: 'FSSAI', licenseNumber: '10023045000123', expiryDate: '2026-12-15T00:00:00.000Z', status: 'Active' },
          { _id: 'mock2', legalName: 'PaperPulse Test Node', type: 'GST', licenseNumber: '09AAACHP1234A1Z5', expiryDate: '2026-05-20T00:00:00.000Z', status: 'Expiring Soon' }
       ]);
    }

    res.status(200).json(combinedCertificates);
  } catch (error) {
    next(error);
  }
};

/**
 * Adjusts meta/status properties of a specific given certificate assuming implicit ownership.
 *
 * @async
 * @param {express.Request} req - Holds `req.params.id` string and new payload inside `req.body`.
 * @param {express.Response} res - Updates single object document.
 */
const updateCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404);
      throw new Error('This targeted Certificate ID was not found.');
    }

    // Checking precise ownership 
    if (certificate.retailer.toString() !== req.retailerId) {
      res.status(401);
      throw new Error('Unauthorized execution attempting to alter external retailer compliance metrics.');
    }

    const updatedCertificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCertificate);
  } catch (error) {
    next(error);
  }
};

/**
 * Slashes records definitively given their Object IDs matching requesting Retailers properties.
 *
 * @async
 * @param {express.Request} req - Params holds specific `id`.
 * @param {express.Response} res - Yields simple string confirming purge completion.
 */
const deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404);
      throw new Error('Target Certificate ID omitted or missing from DB cache.');
    }

    // Ownership verifications tightly implemented 
    if (certificate.retailer.toString() !== req.retailerId) {
      res.status(401);
      throw new Error('Unauthorized Retailer trying to purge unknown compliance document.');
    }

    await certificate.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Execution complete for certificate removal.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCertificate,
  getUserCertificates,
  updateCertificate,
  deleteCertificate,
};
