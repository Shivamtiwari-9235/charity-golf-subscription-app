const asyncHandler = require('express-async-handler');
const Draw = require('../models/Draw');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

function randomNumbers(count) {
  const set = new Set();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(set).sort((a,b)=>a-b);
}

const createDraw = asyncHandler(async (req, res) => {
  const { month, year, mode } = req.body;
  const existing = await Draw.findOne({ month, year });
  if (existing) {
    res.status(400);
    throw new Error('Draw already exists for this month/year');
  }
  const draw = await Draw.create({ month, year, mode: mode || 'random', status: 'draft' });
  res.status(201).json(draw);
});

const simulateDraw = asyncHandler(async (req, res) => {
  const draw = await Draw.findById(req.params.id);
  if (!draw) {
    res.status(404);
    throw new Error('Draw not found');
  }
  if (!draw.numbersDrawn || draw.numbersDrawn.length===0) {
    draw.numbersDrawn = randomNumbers(5);
  }

  draw.status = 'simulated';
  await draw.save();

  res.json(draw);
});

const publishDraw = asyncHandler(async (req, res) => {
  const draw = await Draw.findById(req.params.id);
  if (!draw) {
    res.status(404);
    throw new Error('Draw not found');
  }
  if (!draw.numbersDrawn || draw.numbersDrawn.length===0) {
    draw.numbersDrawn = randomNumbers(5);
  }

  const activeUsers = await User.find({ 'subscription.status': 'active' });
  const tickets = [];
  for (const user of activeUsers) {
    const numbersPicked = randomNumbers(5);
    tickets.push({
      userId: user._id,
      drawId: draw._id,
      numbersPicked
    });
  }
  await Ticket.insertMany(tickets);

  const allTickets = await Ticket.find({ drawId: draw._id });
  const tierCounts = { '5-match': 0, '4-match': 0, '3-match': 0 };

  allTickets.forEach((ticket) => {
    const matchCount = ticket.numbersPicked.filter((n) => draw.numbersDrawn.includes(n)).length;
    ticket.matchCount = matchCount;
    if (matchCount === 5) ticket.tier = '5-match';
    else if (matchCount === 4) ticket.tier = '4-match';
    else if (matchCount === 3) ticket.tier = '3-match';
    else ticket.tier = null;

    if (ticket.tier) tierCounts[ticket.tier]++;
    ticket.save();
  });

  const totalUsers = await User.countDocuments({ 'subscription.status': 'active' });
  const perUserContribution = 20;
  const prizePoolTotal = totalUsers * perUserContribution;
  const fivePool = prizePoolTotal * 0.4 + draw.rolloverAmount;
  const fourPool = prizePoolTotal * 0.35;
  const threePool = prizePoolTotal * 0.25;

  const winners = { '5-match': [], '4-match': [], '3-match': [] };
  for (const ticket of allTickets) {
    if (ticket.tier) winners[ticket.tier].push(ticket);
  }

  const distribution = {
    '5-match': tierCounts['5-match'] > 0 ? fivePool / tierCounts['5-match'] : 0,
    '4-match': tierCounts['4-match'] > 0 ? fourPool / tierCounts['4-match'] : 0,
    '3-match': tierCounts['3-match'] > 0 ? threePool / tierCounts['3-match'] : 0
  };

  const newRollover = tierCounts['5-match'] === 0 ? fivePool : 0;

  for (const tier of ['5-match', '4-match', '3-match']) {
    for (const ticket of winners[tier]) {
      ticket.prizeAmount = distribution[tier];
      await ticket.save();
      await User.findByIdAndUpdate(ticket.userId, {
        $inc: {
          'winningsSummary.totalWon': distribution[tier],
          'winningsSummary.pendingPayoutAmount': distribution[tier]
        }
      });
      const user = await User.findById(ticket.userId);
      await sendEmail(user.email, 'Draw Results', `Congratulations! You won $${distribution[tier]} in the ${tier} category.`);
    }
  }

  draw.prizePoolTotal = prizePoolTotal;
  draw.tierAmounts = { fiveMatch: fivePool, fourMatch: fourPool, threeMatch: threePool };
  draw.rolloverAmount = newRollover;
  draw.status = 'published';
  await draw.save();

  res.json({ draw, results: { tierCounts, distribution, newRollover } });
});

const getDraws = asyncHandler(async (req, res) => {
  const draws = await Draw.find().sort({ year: -1, month: -1 });
  res.json(draws);
});

const getDraw = asyncHandler(async (req, res) => {
  const draw = await Draw.findById(req.params.id);
  if (!draw) { res.status(404); throw new Error('Draw not found'); }
  res.json(draw);
});

module.exports = { createDraw, simulateDraw, publishDraw, getDraws, getDraw };
