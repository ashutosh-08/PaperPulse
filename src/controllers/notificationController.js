const Certificate = require('../models/Certificate');
const Notification = require('../models/Notification');
const { sendPulseAlert } = require('../services/notificationService');

/**
 * Validates manual testing payloads routing explicitly specifically targeting explicit Viva execution interfaces cleanly.
 * Exposes Developer overrides natively matching Target Retailers immediately forcing Multi Channel execution safely.
 *
 * @async
 * @param {express.Request} req - Mutated req possessing 'certificateId' parameters logically mapped.
 * @param {express.Response} res - Outputs complete Sent execution histories cleanly tracking MongoDB documents.
 */
const testManualTrigger = async (req, res, next) => {
  try {
    const { certificateId } = req.body;
    if (!certificateId) {
      return res.status(400).json({ message: 'Certificate ID completely missing from test payload natively.' });
    }

    // Isolate target Certificate completely executing Relational Document mappings autonomously
    const certificate = await Certificate.findById(certificateId).populate('retailer');
    if (!certificate) {
      return res.status(404).json({ message: 'Explicit Certificate mapping completely unmapped internally.' });
    }

    // Target native Alert dispatcher mapped structurally evaluating true Multi Channel limits inherently
    const { emailStatus, whatsappStatus } = await sendPulseAlert(certificate.retailer, certificate);

    // Track test execution outputs generating the tracking parameters explicitly natively mapping MongoDB
    const auditLogs = [];

    if (certificate.retailer.notifPref && certificate.retailer.notifPref.email) {
      const emailLog = await Notification.create({
        retailerId: certificate.retailer._id,
        certificateId: certificate._id,
        type: 'TEST',
        channel: 'Email',
        status: emailStatus,
      });
      auditLogs.push(emailLog);
    }

    if (certificate.retailer.notifPref && certificate.retailer.notifPref.whatsapp) {
      const waLog = await Notification.create({
        retailerId: certificate.retailer._id,
        certificateId: certificate._id,
        type: 'TEST',
        channel: 'WhatsApp',
        status: whatsappStatus,
      });
      auditLogs.push(waLog);
    }

    res.status(200).json({
      success: true,
      message: 'Testing Notification Dispatch Execution complete seamlessly parsing explicit parameters globally.',
      data: {
        retailer: certificate.retailer.name,
        emailExecution: emailStatus,
        whatsappExecution: whatsappStatus,
        auditLogs,
      },
    });
  } catch (error) {
    next(error); 
  }
};

/**
 * Public debug endpoint to trigger notifications without requiring a stored Certificate or Retailer.
 * Accepts a simple payload containing retailer and certificate fields and forwards to sendPulseAlert.
 * Useful for testing SMTP and Twilio integrations during development.
 *
 * Expected body shape:
 * {
 *   retailer: { name, email, phoneNumber, notifPref: { email: true, whatsapp: true } },
 *   certificate: { type, licenseNumber, expiryDate }
 * }
 */
const debugTrigger = async (req, res, next) => {
  try {
    const { retailer, certificate } = req.body;
    if (!retailer || !certificate) {
      return res.status(400).json({ message: 'Both retailer and certificate objects are required in the body.' });
    }

    // Normalize expiryDate into a Date object if provided as string
    if (certificate.expiryDate && typeof certificate.expiryDate === 'string') {
      certificate.expiryDate = new Date(certificate.expiryDate);
    }

    const result = await sendPulseAlert(retailer, certificate);

    return res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  testManualTrigger,
  debugTrigger,
};
