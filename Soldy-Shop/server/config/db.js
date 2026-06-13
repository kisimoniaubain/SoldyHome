const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('bufferCommands', false);

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  global.__DB_CONNECTED__ = true;
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
