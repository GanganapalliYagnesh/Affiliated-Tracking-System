const express = require('express');
const router = express.Router();
const { trackClick } = require('../controllers/trackingController');

// Public route for tracking clicks: /api/track/:affiliateCode/:campaignId
router.get('/', trackClick);

// Short link redirection: /a/:shortCode
router.get('/a/:shortCode', (req, res, next) => {
  req.query.s = req.params.shortCode;
  trackClick(req, res, next);
});

module.exports = router;
