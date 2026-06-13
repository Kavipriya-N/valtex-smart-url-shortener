const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customAlias: {
    type: String,
    trim: true,
    lowercase: true
  },
  clickCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Auto-deactivate expired links
urlSchema.virtual('status').get(function () {
  if (!this.isActive) return 'inactive';
  if (this.expiryDate && new Date() > this.expiryDate) return 'expired';
  return 'active';
});

urlSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Url', urlSchema);
