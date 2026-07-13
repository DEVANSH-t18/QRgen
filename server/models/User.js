const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileData: {
    name: { type: String, default: '' },
    bio: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  qrTheme: {
    fgColor: { type: String, default: '#ffffff' },
    bgColor: { type: String, default: '#000000' },
    logoUrl: { type: String, default: '' }
  },
  scanCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
