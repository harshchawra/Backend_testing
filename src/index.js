const mongoose = require('mongoose');
const Query = require("./models/user.model.js");

const connectToDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        // console.log(`MongoDB connected: ${conn.connection.host}`);
        // console.log(`Using database: ${conn.connection.name}`);

    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1); // Exit on failure
    }
};

module.exports = connectToDb; 