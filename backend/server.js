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
createAdmin();

const app = express();
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Golf Charity API is running' });
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
