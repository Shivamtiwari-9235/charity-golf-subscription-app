const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Draw = require('../models/Draw');
const Ticket = require('../models/Ticket');

const usersReport = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ 'subscription.status': 'active' });
  const totalPrizePool = await Draw.aggregate([{ $group: { _id: null, sum: { $sum: '$prizePoolTotal' } } }]);
  const totalCharity = await User.aggregate([{ $match: { 'subscription.status': 'active' } }, { $group: { _id: null, total: { $sum: '$subscription.plan' } } }]);
  res.json({ totalUsers, activeUsers, totalPrizePool: totalPrizePool[0]?.sum || 0, totalCharityContributions: 0, drawCount: await Draw.countDocuments(), ticketCount: await Ticket.countDocuments() });
});

module.exports = { usersReport };
