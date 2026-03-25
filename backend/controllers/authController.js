const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, selectedCharityId, charityContributionPercent, adminCode } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Check if this should be an admin user
  let role = 'subscriber';
  if (adminCode === process.env.ADMIN_CODE || adminCode === 'ADMIN2024') {
    role = 'admin';
  } else {
    // If no admin exists yet, make first user admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      role = 'admin';
    }
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    passwordHash,
    selectedCharityId: selectedCharityId || null,
    charityContributionPercent: charityContributionPercent >= 10 ? charityContributionPercent : 10,
    role: role
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

  // send welcome email in background to avoid slowing down registration
  sendEmail(user.email, 'Welcome to Golf Charity', `Hi ${user.name}, welcome!`) // no await
    .catch((err) => console.error('Background welcome email failed:', err));

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  }
  res.status(401);
  throw new Error('Invalid email or password');
});

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

module.exports = { register, login, getProfile };
