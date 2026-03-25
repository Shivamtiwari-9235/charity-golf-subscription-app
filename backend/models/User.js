const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['subscriber', 'admin'], default: 'subscriber' },
  subscription: {
    plan: { type: String, enum: ['monthly', 'yearly', null], default: null },
    status: { type: String, enum: ['active', 'inactive', 'canceled', 'past_due', 'unpaid'], default: 'inactive' },
    startDate: Date,
    endDate: Date,
    renewalDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  selectedCharityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
  charityContributionPercent: { type: Number, default: 10, min: 10, max: 100 },
  winningsSummary: {
    totalWon: { type: Number, default: 0 },
    pendingPayoutAmount: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
