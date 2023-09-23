const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      user: process.env.DB_USER,
      pass: process.env.DB_PWD,
      dbName: process.env.DB_NAME,
      socketTimeoutMS: 4000,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
