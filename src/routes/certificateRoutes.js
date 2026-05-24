const express = require('express');
const {
  createCertificate,
  getUserCertificates,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
/**
 * Ensures that absolutely all operations regarding the active manipulation or querying of Certificates
 * mandates current, signed login cookies representing actively checked session Retailers.
 */
router.use(protect);

/**
 * Standard GET logic retrieving array mappings of stored Certs, alongside POST logic creating new ones.
 * @route GET /api/certificates
 * @route POST /api/certificates
 */
router.route('/').get(getUserCertificates).post(createCertificate);

/**
 * Specific param-driven paths mapping ID string endpoints for updating or deleting specific resources.
 * @route PUT /api/certificates/:id
 * @route DELETE /api/certificates/:id
 */
router.route('/:id').put(updateCertificate).delete(deleteCertificate);

module.exports = router;
