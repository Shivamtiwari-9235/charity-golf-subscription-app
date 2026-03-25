const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  upcomingEvents: [{ title: String, date: Date, description: String }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);
