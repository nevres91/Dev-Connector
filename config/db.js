const mongoose = require('mongoose');
const config = require('config'); //we wanna be able to grab that string we put inside default.json
const db = config.get('mongoURI'); // to get the value

// Connect to mongo db we're using async/await instead 'mongoose.connect(db) which returns promise

const connectDB = async () => { // In most cases when we use async/await we're gonna wrap it in try/catch block
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(db)

    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err.message);
//Exit process with failure
    process.exit(1);
  }
}

module.exports = connectDB;