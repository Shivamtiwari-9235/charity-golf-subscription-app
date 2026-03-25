const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const createAdminIfNone = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`Current admin count: ${adminCount}`);

    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Admin123!', salt);

      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@golfcharity.com',
        passwordHash,
        role: 'admin',
        selectedCharityId: null,
        charityContributionPercent: 10
      });

      console.log('✅ Admin user created:');
      console.log('Email: admin@golfcharity.com');
      console.log('Password: Admin123!');
      console.log('Role: admin');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdminIfNone();