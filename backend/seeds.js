const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Charity = require('./models/Charity');

const importData = async () => {
  try {
    await connectDB();

    await Charity.deleteMany();

    const charities = [
      {
        name: "Make-A-Wish Foundation",
        description: "Grants life-changing wishes for children with critical illnesses.",
        images: ["https://images.unsplash.com/photo-1516979187457-637bbbb4f5a0?w=400"],
        upcomingEvents: [{ title: "Charity Golf Classic", date: new Date("2024-06-15"), description: "Annual golf event" }],
        featured: true
      },
      {
        name: "American Red Cross",
        description: "Provides emergency assistance, disaster relief, and education.",
        images: ["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400"],
        upcomingEvents: [{ title: "Blood Drive", date: new Date("2024-05-25"), description: "Community blood donation" }],
        featured: true
      },
      {
        name: "Habitat for Humanity",
        description: "Builds and repairs homes for families in need.",
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"],
        upcomingEvents: [{ title: "Hammer & Hope Build Day", date: new Date("2024-06-01"), description: "Home building volunteer day" }],
        featured: true
      },
      {
        name: "St. Jude Children's Research Hospital",
        description: "Leading children's cancer research and treatment center.",
        images: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"],
        upcomingEvents: [{ title: "Family Research Fundraiser", date: new Date("2024-07-10"), description: "Annual fundraising event" }],
        featured: false
      },
      {
        name: "Boys & Girls Clubs of America",
        description: "Provides after-school programs for youth development.",
        images: ["https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400"],
        upcomingEvents: [{ title: "Annual Golf Tournament", date: new Date("2024-08-15"), description: "Major fundraising golf event" }],
        featured: true
      }
    ];

    await Charity.insertMany(charities);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

importData();
