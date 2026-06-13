const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  browser: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  ip: { type: String, default: '' },
  referrer: { type: String, default: 'Direct' }
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
