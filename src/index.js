const { MONGO_URI } = require("./config/config.js");
const mongoose = require('mongoose');

let Dbconnect;

module.exports = {
    connectToDb: async (cb) => {
        try {
            const connection = await mongoose.connect(MONGO_URI);
            Dbconnect = connection.connection;
            // console.log("MongoDB Connected");
            return cb();
        } catch (err) {
            // console.error("MongoDB Connection Error:", err);
            return cb(err);
        }
    },

    getDb: () => {
        if (!Dbconnect) {
            throw new Error("Database not initialized.");
        }
        return Dbconnect;
    }
};