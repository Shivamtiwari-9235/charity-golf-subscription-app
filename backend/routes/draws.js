const express = require('express');
const { protect, admin } = require('../middlewares/auth');
const { createDraw, simulateDraw, publishDraw, getDraws, getDraw } = require('../controllers/drawController');
const router = express.Router();

router.get('/', protect, getDraws);
router.get('/:id', protect, getDraw);
router.post('/', protect, admin, createDraw);
router.post('/:id/simulate', protect, admin, simulateDraw);
router.post('/:id/publish', protect, admin, publishDraw);

module.exports = router;
