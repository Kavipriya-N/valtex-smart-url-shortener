const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');
const Url = require('../models/Url');
const Visit = require('../models/Visit');
const { generateCode, isValidUrl } = require('../utils/generateCode');

// @POST /api/urls — Create short URL
const createUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiryDate } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ success: false, message: 'URL is required.' });
    }
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ success: false, message: 'Invalid URL format.' });
    }

    let shortCode = customAlias ? customAlias.toLowerCase().replace(/\s+/g, '-') : generateCode();

    const exists = await Url.findOne({ shortCode });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Alias already taken.' });
    }

    const url = await Url.create({
      userId: req.user ? req.user._id : null,
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      expiryDate: expiryDate || null
    });

    res.status(201).json({
      success: true,
      message: 'Short URL created!',
      url: {
        ...url.toJSON(),
        shortUrl: `${process.env.BASE_URL}/${shortCode}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @GET /api/urls — Get all URLs for user
const getUserUrls = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      userId: req.user._id,
      ...(search && {
        $or: [
          { originalUrl: { $regex: search, $options: 'i' } },
          { shortCode: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const [urls, total] = await Promise.all([
      Url.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Url.countDocuments(query)
    ]);

    const urlsWithShort = urls.map(u => ({
      ...u.toJSON(),
      shortUrl: `${process.env.BASE_URL}/${u.shortCode}`
    }));

    res.json({
      success: true,
      urls: urlsWithShort,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @PUT /api/urls/:id — Edit URL
const updateUrl = async (req, res) => {
  try {
    const { originalUrl, expiryDate } = req.body;
    const url = await Url.findOne({ _id: req.params.id, userId: req.user._id });

    if (!url) return res.status(404).json({ success: false, message: 'URL not found.' });
    if (originalUrl && !isValidUrl(originalUrl)) {
      return res.status(400).json({ success: false, message: 'Invalid URL.' });
    }

    if (originalUrl) url.originalUrl = originalUrl;
    if (expiryDate !== undefined) url.expiryDate = expiryDate || null;
    await url.save();

    res.json({ success: true, message: 'URL updated.', url: url.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @DELETE /api/urls/:id — Delete URL
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!url) return res.status(404).json({ success: false, message: 'URL not found.' });
    await Visit.deleteMany({ urlId: req.params.id });
    res.json({ success: true, message: 'URL deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @GET /:code — Redirect & track visit
const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (!url) return res.status(404).send('<h1>404 — Link not found</h1>');
    if (url.expiryDate && new Date() > url.expiryDate) {
      return res.status(410).send('<h1>410 — This link has expired</h1>');
    }

    const ua = new UAParser(req.headers['user-agent']);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const geo = geoip.lookup(ip.split(',')[0].trim());

    await Promise.all([
      Url.findByIdAndUpdate(url._id, { $inc: { clickCount: 1 } }),
      Visit.create({
        urlId: url._id,
        browser: ua.getBrowser().name || 'Unknown',
        device: ua.getDevice().type || 'Desktop',
        os: ua.getOS().name || 'Unknown',
        country: geo?.country || 'Unknown',
        ip: ip.split(',')[0].trim(),
        referrer: req.headers.referer || 'Direct'
      })
    ]);

    res.redirect(301, url.originalUrl);
  } catch (error) {
    res.status(500).send('<h1>Server Error</h1>');
  }
};

module.exports = { createUrl, getUserUrls, updateUrl, deleteUrl, redirectUrl };
