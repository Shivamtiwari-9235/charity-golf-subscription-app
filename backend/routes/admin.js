const express = require('express');
const { protect, admin } = require('../middlewares/auth');
const { usersReport } = require('../controllers/adminController');
const router = express.Router();

router.get('/reports', protect, admin, usersReport);

module.exports = router;
