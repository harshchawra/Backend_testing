import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDb from './src/index.js';
import authRoutes from './src/routes/auth.routes.js';
import appRoutes from './src/routes/queries.routes.js'; // Import your queries routes

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', appRoutes);

connectToDb().then(() => {
  app.listen(3000, () => console.log(`Server running on port 3000`));
}).catch((err) => console.error('Database connection failed:', err));

export default app;
