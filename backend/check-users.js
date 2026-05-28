require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find();
    console.log('Users in database:', users.length);
    users.forEach(u => {
      console.log(`- ${u.username} (${u.role}), password hash starts with: ${u.password.substring(0, 20)}...`);
    });
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUsers();
