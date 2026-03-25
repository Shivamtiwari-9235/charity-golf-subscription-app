require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/error');

connectDB();

const createAdmin = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    await User.create({ name: 'Admin', email: 'admin@golf.com', passwordHash: hash, role: 'admin' });
    console.log('Admin created: admin@golf.com / admin123');
  }
};

const seedCharities = async () => {
  const Charity = require('./models/Charity');
  const count = await Charity.countDocuments();
  if (count === 0) {
    await Charity.insertMany([
      { name: 'Cancer Research UK', description: 'Fighting cancer through research', featured: true },
      { name: 'WWF', description: 'Protecting wildlife and nature', featured: true },
      { name: 'Red Cross', description: 'Emergency response and aid', featured: false },
    ]);
    console.log('Seeded default charities');
  }
};

createAdmin();
seedCharities();

const app = express();
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:3000',
  'https://charity-golf-app.netlify.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: This origin is not allowed')); 
    }
  },
  credentials: true,
}));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Golf Charity API is running' });
});

app.get('/api', (req, res) => {
  res.json({ status: 'success', message: 'API is running', base: '/api' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/scores', require('./routes/scores'));
app.use('/api/charities', require('./routes/charities'));
app.use('/api/draws', require('./routes/draws'));
app.use('/api/winners', require('./routes/winners'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stripe', require('./routes/stripe'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
