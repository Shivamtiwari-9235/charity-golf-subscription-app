const express = require('express');
const { createCharity, updateCharity, deleteCharity, getCharities, getCharityById } = require('../controllers/charityController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();

router.get('/', getCharities);
router.get('/:id', getCharityById);
router.post('/', protect, admin, createCharity);
router.put('/:id', protect, admin, updateCharity);
router.delete('/:id', protect, admin, deleteCharity);

module.exports = router;
