const express = require('express');
const router = express.Router();
const { getOverview, getLinkAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/overview', getOverview);
router.get('/:urlId', getLinkAnalytics);

module.exports = router;
