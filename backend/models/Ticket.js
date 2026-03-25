const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  numbersPicked: [{ type: Number, min: 1, max: 45, required: true }],
  matchCount: { type: Number, enum: [0, 3, 4, 5], default: 0 },
  tier: { type: String, enum: ['5-match', '4-match', '3-match', null], default: null },
  prizeAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
