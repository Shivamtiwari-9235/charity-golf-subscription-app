const asyncHandler = require('express-async-handler');
const Charity = require('../models/Charity');

const createCharity = asyncHandler(async (req, res) => {
  const { name, description, images, upcomingEvents, featured } = req.body;
  const charity = await Charity.create({ name, description, images, upcomingEvents, featured });
  res.status(201).json(charity);
});

const updateCharity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const charity = await Charity.findByIdAndUpdate(id, req.body, { new: true });
  if (!charity) {
    res.status(404);
    throw new Error('Charity not found');
  }
  res.json(charity);
});

const deleteCharity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const charity = await Charity.findById(id);
  if (!charity) {
    res.status(404);
    throw new Error('Charity not found');
  }
  await charity.remove();
  res.json({ message: 'Charity deleted' });
});

const getCharities = asyncHandler(async (req, res) => {
  const { search, featured } = req.query;
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (featured === 'true') filter.featured = true;

  const charities = await Charity.find(filter).limit(50);
  res.json(charities);
});

const getCharityById = asyncHandler(async (req, res) => {
  const charity = await Charity.findById(req.params.id);
  if (!charity) {
    res.status(404);
    throw new Error('Charity not found');
  }
  res.json(charity);
});

module.exports = { createCharity, updateCharity, deleteCharity, getCharities, getCharityById };
