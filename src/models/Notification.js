const mongoose = require('mongoose');

/**
 * Audit schema strictly tracking all automated external logic executing outgoing messages securely.
 * Designed natively resolving multi-channel metrics mapping analytical reporting implicitly for the Retailers.
 */
const notificationSchema = new mongoose.Schema(
  {
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Retailer',
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Certificate',
    },
    type: {
      type: String,
      required: true,
      enum: ['30_DAY', '15_DAY', '7_DAY', 'TEST'],
    },
    channel: {
      type: String,
      required: true,
      enum: ['Email', 'WhatsApp'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Sent', 'Failed'],
    },
    providerSid: {
      type: String,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
