import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URL;

export { PORT, MONGO_URI };
