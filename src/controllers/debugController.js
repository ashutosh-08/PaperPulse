const Retailer = require('../models/Retailer');
const { formatE164 } = require('../services/notificationService');

/**
 * Debug endpoint to check retailer notification preferences and phone number
 * Helps diagnose why notifications aren't being sent
 */
const checkRetailerNotificationConfig = async (req, res, next) => {
  try {
    const retailerId = req.retailerId; // From auth middleware

    const retailer = await Retailer.findById(retailerId);
    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }

    const diagnostics = {
      retailerId: retailer._id,
      name: retailer.name,
      email: retailer.email,
      rawPhoneNumber: retailer.phoneNumber || 'MISSING',
      notificationPreferences: {
        email: retailer.notifPref?.email ?? true,
        whatsapp: retailer.notifPref?.whatsapp ?? true,
      },
      diagnostics: {
        hasPhoneNumber: !!retailer.phoneNumber,
        emailEnabled: retailer.notifPref?.email !== false,
        whatsappEnabled: retailer.notifPref?.whatsapp !== false,
        formattedPhoneNumber: retailer.phoneNumber ? formatE164(retailer.phoneNumber) : 'N/A',
      },
      recommendations: [],
    };

    // Check for issues
    if (!retailer.phoneNumber) {
      diagnostics.recommendations.push('⚠️ Phone number is MISSING - WhatsApp notifications cannot be sent. Update your profile with a phone number.');
    } else if (retailer.notifPref?.whatsapp === false) {
      diagnostics.recommendations.push('⚠️ WhatsApp notifications are DISABLED in your preferences. Enable them in settings.');
    } else if (!retailer.notifPref?.email) {
      diagnostics.recommendations.push('⚠️ Email notifications are DISABLED in your preferences. Enable them in settings.');
    } else {
      diagnostics.recommendations.push('✅ Notification settings look good! Phone number and preferences are configured.');
    }

    res.status(200).json({
      success: true,
      diagnostics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkRetailerNotificationConfig,
};
