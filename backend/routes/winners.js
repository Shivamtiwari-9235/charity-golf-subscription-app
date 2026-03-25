const express = require('express');
const { protect, admin } = require('../middlewares/auth');
const { submitVerification, listVerifications, reviewVerification, payoutDone } = require('../controllers/winnerController');
const router = express.Router();

router.post('/', protect, submitVerification);
router.get('/', protect, admin, listVerifications);
router.put('/:id/review', protect, admin, reviewVerification);
router.put('/:id/payout', protect, admin, payoutDone);

module.exports = router;
