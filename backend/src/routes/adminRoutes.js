const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { 
  getAnalytics, 
  updateOrderStatus,
  updateOrderTracking,
  addCategory, updateCategory, deleteCategory,
  addCoupon, updateCoupon, deleteCoupon,
  addProduct, updateProduct, deleteProduct,
  updateSettings, updateBanners
} = require('../controllers/adminController');

const { getReviews, updateReview, deleteReview } = require('../controllers/reviewsController');
const { getReturns, updateReturnStatus, getRefunds, updateRefundStatus } = require('../controllers/returnsController');
const { getTickets, updateTicket, replyTicket } = require('../controllers/supportController');
const { getShippingZones, updateShippingZone, generateManifest } = require('../controllers/shippingController');
const { getNotifications, markAsRead } = require('../controllers/notificationsController');
const { generateReport } = require('../controllers/reportsController');
const { getAuditLogs } = require('../controllers/auditLogsController');

const router = express.Router();

// All routes require admin
router.use(requireAdmin);

router.get('/analytics', getAnalytics);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/tracking', updateOrderTracking);

router.post('/categories', addCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.post('/coupons', addCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.put('/settings/general', updateSettings);
router.put('/settings/banners', updateBanners);

// Phase 2 Enterprise Routes
router.get('/reviews', getReviews);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

router.get('/returns', getReturns);
router.put('/returns/:id/status', updateReturnStatus);
router.get('/refunds', getRefunds);
router.put('/refunds/:id/status', updateRefundStatus);

router.get('/support', getTickets);
router.put('/support/:id', updateTicket);
router.post('/support/:id/reply', replyTicket);

router.get('/shipping/zones', getShippingZones);
router.put('/shipping/zones/:id', updateShippingZone);
router.post('/shipping/manifest', generateManifest);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markAsRead);

router.get('/reports/export', generateReport);

router.get('/audit-logs', getAuditLogs);

module.exports = router;
