import mongoose from 'mongoose';
import { MONGO_URI } from './config/config.js';

const connectToDb = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URL is not defined in environment variables.");
        }

        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        // console.log(`Using database: ${conn.connection.name}`);

    } catch (error) {
        console.log("MongoDB connection error: ", error);
        // process.exit(1); // Exit on failure
        setTimeout(connectToDb, 5000); //Retry after 5 seconds
    }
};

export default connectToDb;  