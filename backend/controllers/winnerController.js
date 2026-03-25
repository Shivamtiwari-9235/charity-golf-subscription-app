const asyncHandler = require('express-async-handler');
const WinnerVerification = require('../models/WinnerVerification');

const submitVerification = asyncHandler(async (req, res) => {
  const { drawId, ticketId, proofImageUrl } = req.body;
  const existing = await WinnerVerification.findOne({ ticketId });
  if (existing) {
    res.status(400);
    throw new Error('Verification already submitted for this ticket');
  }
  const verification = await WinnerVerification.create({
    userId: req.user._id,
    drawId,
    ticketId,
    proofImageUrl,
    status: 'pending'
  });
  res.json(verification);
});

const listVerifications = asyncHandler(async (req, res) => {
  const verifications = await WinnerVerification.find().populate('userId', 'name email').populate('drawId', 'month year');
  res.json(verifications);
});

const reviewVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const verification = await WinnerVerification.findById(id);
  if (!verification) { res.status(404); throw new Error('Verification not found'); }
  if (!['approved','rejected'].includes(status)) { res.status(400); throw new Error('Invalid status'); }
  verification.status = status;
  verification.adminReviewerId = req.user._id;
  if (status === 'approved') {
    verification.payoutStatus = 'pending';
  }
  await verification.save();
  res.json(verification);
});

const payoutDone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const verification = await WinnerVerification.findById(id);
  if (!verification) { res.status(404); throw new Error('Verification not found'); }
  verification.payoutStatus = 'paid';
  verification.payoutDate = new Date();
  await verification.save();
  res.json(verification);
});

module.exports = { submitVerification, listVerifications, reviewVerification, payoutDone };
