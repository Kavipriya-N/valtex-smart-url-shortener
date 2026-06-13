const express = require('express');
const router = express.Router();
const { createUrl, getUserUrls, updateUrl, deleteUrl } = require('../controllers/urlController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.post('/', optionalProtect, createUrl);
router.get('/', protect, getUserUrls);
router.put('/:id', protect, updateUrl);
router.delete('/:id', protect, deleteUrl);

module.exports = router;
