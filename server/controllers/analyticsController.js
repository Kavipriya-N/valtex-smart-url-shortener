const Url = require('../models/Url');
const Visit = require('../models/Visit');

// @GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user._id });
    const urlIds = urls.map(u => u._id);
    const totalClicks = urls.reduce((sum, u) => sum + u.clickCount, 0);
    const totalVisits = await Visit.countDocuments({ urlId: { $in: urlIds } });

    res.json({
      success: true,
      data: {
        totalLinks: urls.length,
        totalClicks,
        totalVisits,
        activeLinks: urls.filter(u => u.status === 'active').length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/analytics/:urlId
const getLinkAnalytics = async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.urlId, userId: req.user._id });
    if (!url) return res.status(404).json({ success: false, message: 'URL not found.' });

    const visits = await Visit.find({ urlId: url._id }).sort('-createdAt').limit(500);

    // Daily trend — last 14 days
    const trend = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      trend[d.toISOString().split('T')[0]] = 0;
    }
    visits.forEach(v => {
      const day = v.createdAt.toISOString().split('T')[0];
      if (trend[day] !== undefined) trend[day]++;
    });

    // Browser breakdown
    const browsers = {};
    visits.forEach(v => { browsers[v.browser] = (browsers[v.browser] || 0) + 1; });

    // Device breakdown
    const devices = {};
    visits.forEach(v => { devices[v.device] = (devices[v.device] || 0) + 1; });

    // Country breakdown
    const countries = {};
    visits.forEach(v => { countries[v.country] = (countries[v.country] || 0) + 1; });

    res.json({
      success: true,
      data: {
        url: { ...url.toJSON(), shortUrl: `${process.env.BASE_URL}/${url.shortCode}` },
        totalClicks: url.clickCount,
        lastVisit: visits[0]?.createdAt || null,
        recentVisits: visits.slice(0, 10),
        trend: Object.entries(trend).map(([date, count]) => ({ date, count })),
        browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })),
        devices: Object.entries(devices).map(([name, count]) => ({ name, count })),
        countries: Object.entries(countries).map(([name, count]) => ({ name, count }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getOverview, getLinkAnalytics };
