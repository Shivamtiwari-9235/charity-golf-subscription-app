const asyncHandler = require('express-async-handler');
const Score = require('../models/Score');

const addScore = asyncHandler(async (req, res) => {
  const { value, date } = req.body;
  const userId = req.user._id;

  if (!value || !date) {
    res.status(400);
    throw new Error('Score value and date are required');
  }
  if (value < 1 || value > 45) {
    res.status(400);
    throw new Error('Score must be between 1 and 45');
  }

  await Score.create({ userId, value, date });

  const scores = await Score.find({ userId }).sort({ date: -1, createdAt: -1 });
  const latest5 = scores.slice(0, 5);

  if (scores.length > 5) {
    const toRemove = scores.slice(5);
    await Score.deleteMany({ _id: { $in: toRemove.map((item) => item._id) } });
  }

  res.status(201).json(latest5);
});

const getScores = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const scores = await Score.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(5);
  res.json(scores);
});

module.exports = { addScore, getScores };
