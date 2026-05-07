const express = require('express');
const router = express.Router();
const { 
  getAllAffiliates, 
  updateAffiliateStatus, 
  getAllCampaigns, 
  createCampaign,
  getDashboardStats,
  getAllPayouts,
  updatePayoutStatus,
  getAllConversions,
  updateConversionStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/affiliates', protect, authorize('admin'), getAllAffiliates);
router.put('/affiliates/:id/status', protect, authorize('admin'), updateAffiliateStatus);

router.get('/campaigns', protect, authorize('admin'), getAllCampaigns);
router.post('/campaigns', protect, authorize('admin'), createCampaign);

router.get('/payouts', protect, authorize('admin'), getAllPayouts);
router.put('/payouts/:id/status', protect, authorize('admin'), updatePayoutStatus);

router.get('/conversions', protect, authorize('admin'), getAllConversions);
router.put('/conversions/:id/status', protect, authorize('admin'), updateConversionStatus);

module.exports = router;
