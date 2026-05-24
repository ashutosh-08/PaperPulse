const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Retailer',
    },
    type: {
      type: String,
      required: true,
    },
    legalName: {
      type: String,
      required: false,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Expired', 'Pending Renewal', 'Suspended', 'Expiring Soon'],
      default: 'Active',
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
