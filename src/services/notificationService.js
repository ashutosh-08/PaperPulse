const twilio = require('twilio');
const nodemailer = require('nodemailer');

const TWILIO_SID = process.env.TWILIO_SID || 'MISSING_SID';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'MISSING_TOKEN';
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

let twilioClient = null;
try {
  // Only initialize Twilio client when SID and token look valid
  if (TWILIO_SID && TWILIO_SID.startsWith('AC') && TWILIO_AUTH_TOKEN && TWILIO_AUTH_TOKEN !== 'MISSING_TOKEN') {
    twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
  } else {
    console.warn('Twilio credentials missing or invalid; WhatsApp notifications will be disabled.');
  }
} catch (err) {
  console.error(`Failed to initialize Twilio client: ${err.message}. WhatsApp notifications disabled.`);
  twilioClient = null;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  auth: {
    user: process.env.SMTP_USER || 'MISSING_USER',
    pass: process.env.SMTP_PASS || 'MISSING_PASS',
  },
});

/**
 * Normalizes phone numbers strictly into E.164 format natively prepending India's +91.
 * Safely strips any existing leading zeroes or duplicate international dialing prefixes dynamically bridging Twilio payload expectations.
 *
 * @param {string} rawNumber - The raw string representation provided from the Retailer payload explicitly.
 * @returns {string} Fully canonical string formatted universally ensuring '+91' is strictly prefixed exactly once natively.
 */
const formatE164 = (rawNumber) => {
  let cleanNumber = rawNumber.replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }
  if (cleanNumber.length > 10 && cleanNumber.startsWith('91')) {
    cleanNumber = cleanNumber.substring(2);
  }
  return `+91${cleanNumber}`;
};

/**
 * Re-formats ISO timestamp outputs to DD-MM-YYYY seamlessly for WhatsApp readability.
 *
 * @param {Date} date - The raw Date object mapping to certificate's bounds.
 * @returns {string} Formatted DD-MM-YYYY string.
 */
const formatDateForWhatsApp = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * High-performance Automated Messaging service explicitly bridging Retailer objects mapping custom properties seamlessly across third-party architectures.
 * 
 * @async
 * @param {Object} retailer - The fully populated Retailer Document resolving their native Name and contextual references.
 * @param {Object} certificate - Targeted Document triggering the explicit Expiry logic bounds.
 * @returns {Promise<Object>} Formulates native object resolving statuses and SID.
 */
const sendPulseAlert = async (retailer, certificate) => {
  let emailStatus = 'Failed';
  let whatsappStatus = 'Failed';
  let emailSid = null;
  let whatsappSid = null;

  const expiryStringEmail = certificate.expiryDate.toISOString().split('T')[0];
  const expiryStringWhatsApp = formatDateForWhatsApp(certificate.expiryDate);

  if (retailer.notifPref && retailer.notifPref.email) {
    try {
      const mailOptions = {
        from: '"PaperPulse Automated Compliance" <no-reply@paperpulse.co.in>',
        to: retailer.email,
        subject: `ACTION REQUIRED: Your ${certificate.type} Certificate Expiring Soon`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <h2 style="color: #1e3a8a; text-align: center;">PaperPulse Compliance Alert</h2>
              <p>Hello <strong>${retailer.name}</strong>,</p>
              <p>Your officially tracked <strong>${certificate.type}</strong> license (<strong>#${certificate.licenseNumber}</strong>) is expiring on <strong>${expiryStringEmail}</strong>.</p>
              <p>Failing to renew this government license might incur severe penalties natively.</p>
              <div style="text-align: center; margin-top: 25px;">
                <a href="https://paperpulse.co.in/portal" style="background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Renew Now</a>
              </div>
            </div>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      emailStatus = 'Sent';
      emailSid = info.messageId;
      console.log(`[Email] Natively dispatched compliance warning successfully explicitly towards: ${retailer.email}`);
    } catch (emailError) {
      console.error(`[Email] Nodemailer exception tripped bypassing delivery constraints: ${emailError.message}`);
    }
  }

    if (retailer.notifPref && retailer.notifPref.whatsapp) {
    if (!retailer.phoneNumber) {
      console.warn(`[WhatsApp] Retailer ${retailer.name} lacks verified phone strings natively. Skipping Twilio dispatch gracefully.`);
      whatsappStatus = 'Failed';
    } else {
        if (!twilioClient) {
          console.warn('[WhatsApp] Twilio client not initialized; skipping send.');
          whatsappStatus = 'Disabled';
        } else {
          try {
            const canonicalPhone = formatE164(retailer.phoneNumber);
            const response = await twilioClient.messages.create({
              contentSid: 'MG554f8ad57de62f8e88c2731990c27c5b',
              contentVariables: JSON.stringify({
                "1": certificate.type,
                "2": expiryStringWhatsApp,
              }),
              from: TWILIO_WHATSAPP_NUMBER,
              to: `whatsapp:${canonicalPhone}`,
            });

            whatsappStatus = 'Sent';
            whatsappSid = response.sid;
            console.log(`[WhatsApp] Successfully bridged Twilio endpoints firing payloads safely towards: ${canonicalPhone}`);
          } catch (twilioError) {
            whatsappStatus = 'Failed';
            if (twilioError.status === 400 || twilioError.status === 429) {
              console.error(`[WhatsApp] Twilio integration actively rejected delivery schema, Status Code: ${twilioError.status}, Detail: ${twilioError.message}`);
            } else {
              console.error(`[WhatsApp] Twilio Native Error evaluating payload structurally: ${twilioError.message}`);
            }
          }
        }
    }
  }

  return { emailStatus, whatsappStatus, emailSid, whatsappSid };
};

module.exports = { sendPulseAlert, formatE164, formatDateForWhatsApp };
