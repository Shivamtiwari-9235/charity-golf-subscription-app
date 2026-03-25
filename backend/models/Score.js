const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

scoreSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Score', scoreSchema);
