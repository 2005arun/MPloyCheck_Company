require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const users = [
      {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        department: 'IT',
        accessLevel: 'Admin'
      },
      {
        username: 'arun',
        password: await bcrypt.hash('arun123', 10),
        role: 'admin',
        department: 'Engineering',
        accessLevel: 'Admin'
      },
      {
        username: 'ravi',
        password: await bcrypt.hash('ravi123', 10),
        role: 'user',
        department: 'HR',
        accessLevel: 'Read'
      },
      {
        username: 'priya',
        password: await bcrypt.hash('priya123', 10),
        role: 'user',
        department: 'Finance',
        accessLevel: 'Read'
      },
      {
        username: 'kumar',
        password: await bcrypt.hash('kumar123', 10),
        role: 'user',
        department: 'Marketing',
        accessLevel: 'Write'
      },
      {
        username: 'deepa',
        password: await bcrypt.hash('deepa123', 10),
        role: 'user',
        department: 'Operations',
        accessLevel: 'Read'
      }
    ];

    await User.insertMany(users);
    console.log('Test users seeded successfully');
    console.log('---');
    console.log('Admin credentials:');
    console.log('  username=admin, password=admin123');
    console.log('  username=arun, password=arun123');
    console.log('User credentials:');
    console.log('  username=ravi, password=ravi123');
    console.log('  username=priya, password=priya123');
    console.log('  username=kumar, password=kumar123');
    console.log('  username=deepa, password=deepa123');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
