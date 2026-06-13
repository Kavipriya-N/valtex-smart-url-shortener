const { nanoid } = require('nanoid');

// Generate a unique 6-character short code
const generateCode = () => nanoid(6);

// Validate URL format
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Format number with commas
const formatNumber = (n) => n.toLocaleString();

module.exports = { generateCode, isValidUrl, formatNumber };
