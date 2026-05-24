const cron = require('node-cron');
const Certificate = require('../models/Certificate');
const Notification = require('../models/Notification');
const { sendPulseAlert } = require('../services/notificationService');

/**
 * Daemon process mapping isolated cron sequences precisely analyzing Mongoose schemas for Certificate Expiry bounds dynamically.
 * Executes at precisely 09:00 AM ('0 9 * * *') resolving DB queries matching bounds targeting Multi Channel Dispatch APIs exclusively.
 * Integrates native Audit trailing logging exact statuses explicitly mapping to Retailer histories seamlessly.
 */
const startExpiryWorker = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      const currentDate = new Date();

      const expiringCertificates = await Certificate.aggregate([
        { $match: { status: { $ne: 'Expired' } } },
        {
          $addFields: {
            daysDifference: {
              $floor: {
                $divide: [
                  { $subtract: ['$expiryDate', currentDate] },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
          },
        },
        { $match: { daysDifference: { $in: [7, 15, 30] } } },
      ]);

      if (expiringCertificates.length > 0) {
        const certIds = expiringCertificates.map(c => c._id);
        const fullCerts = await Certificate.find({ _id: { $in: certIds } }).populate('retailer');

        let totalSentCount = 0;
        let totalFailedCount = 0;

        /**
         * Resolves external API execution promises natively without forcing linear bottlenecks.
         * Enforces strict async processing preserving isolated states organically independent from one another reliably.
         */
        const dispatchPromises = fullCerts.map(async (cert) => {
          cert.status = 'Expiring Soon'; 
          await cert.save();
          
          const diffMatch = expiringCertificates.find(c => c._id.toString() === cert._id.toString());
          const notifType = `${diffMatch.daysDifference}_DAY`;

          const { emailStatus, whatsappStatus, emailSid, whatsappSid } = await sendPulseAlert(cert.retailer, cert); 

          if (cert.retailer.notifPref && cert.retailer.notifPref.email) {
            await Notification.create({
              retailerId: cert.retailer._id,
              certificateId: cert._id,
              type: notifType,
              channel: 'Email',
              status: emailStatus,
              providerSid: emailSid,
            });
            if (emailStatus === 'Sent') totalSentCount++;
            else totalFailedCount++;
          }

          if (cert.retailer.notifPref && cert.retailer.notifPref.whatsapp) {
            await Notification.create({
              retailerId: cert.retailer._id,
              certificateId: cert._id,
              type: notifType,
              channel: 'WhatsApp',
              status: whatsappStatus,
              providerSid: whatsappSid,
            });
            if (whatsappStatus === 'Sent') totalSentCount++;
            else totalFailedCount++;
          }
        });

        await Promise.allSettled(dispatchPromises);
        
        console.log(`Cron Complete: ${totalSentCount} Sent, ${totalFailedCount} Failed`);
      }

      const expiredDocs = await Certificate.find({
        status: { $ne: 'Expired' },
        expiryDate: { $lt: currentDate },
      });

      if (expiredDocs.length > 0) {
        for (let deadCert of expiredDocs) {
          deadCert.status = 'Expired';
          await deadCert.save();
        }
      }

    } catch (error) {
    }
  });

};

module.exports = { startExpiryWorker };
