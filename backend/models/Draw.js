const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  numbersDrawn: [{ type: Number, min: 1, max: 45 }],
  mode: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
  status: { type: String, enum: ['draft', 'simulated', 'published'], default: 'draft' },
  prizePoolTotal: { type: Number, default: 0 },
  tierAmounts: {
    fiveMatch: { type: Number, default: 0 },
    fourMatch: { type: Number, default: 0 },
    threeMatch: { type: Number, default: 0 }
  },
  rolloverAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

drawSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Draw', drawSchema);
