const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getProfile, 
  submitKYC, 
  getAvailableCampaigns,
  getAnalytics,
  getPayouts,
  requestPayout
} = require('../controllers/affiliateController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/stats', protect, authorize('affiliate'), getDashboardStats);
router.get('/campaigns', protect, authorize('affiliate'), getAvailableCampaigns);
router.get('/analytics', protect, authorize('affiliate'), getAnalytics);
router.get('/payouts', protect, authorize('affiliate'), getPayouts);
router.post('/payouts/request', protect, authorize('affiliate'), requestPayout);
router.post('/kyc', protect, authorize('affiliate'), submitKYC);
router.get('/profile', protect, getProfile);

module.exports = router;
