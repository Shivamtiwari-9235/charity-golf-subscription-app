const express = require('express');
const { protect } = require('../middlewares/auth');
const { createCheckoutSession, cancelSubscription, handleWebhook } = require('../controllers/stripeController');

const router = express.Router();

router.post('/checkout-session', protect, createCheckoutSession);
router.post('/cancel-subscription', protect, cancelSubscription);
// webhook endpoint expects raw body, handled in server.js with special parser
router.post('/webhook', handleWebhook);

module.exports = router;
