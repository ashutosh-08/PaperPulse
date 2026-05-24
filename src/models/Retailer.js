const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const retailerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    notifPref: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Validates login attempts by comparing plain-text input against DB hash.
 * 
 * @param {string} enteredPassword - Raw string password provided by user login.
 * @returns {Promise<boolean>} Resolves to true if password correctly decrypts validation.
 */
retailerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Database injection hook seamlessly hashing cleartext passwords pre-save
retailerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Retailer = mongoose.model('Retailer', retailerSchema);

module.exports = Retailer;
