const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  proofImageUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminReviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payoutStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  payoutDate: Date
}, { timestamps: true });

module.exports = mongoose.model('WinnerVerification', verificationSchema);
