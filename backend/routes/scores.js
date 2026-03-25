const express = require('express');
const { addScore, getScores } = require('../controllers/scoresController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.post('/', protect, addScore);
router.get('/', protect, getScores);

module.exports = router;
