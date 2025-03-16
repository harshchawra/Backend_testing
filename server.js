import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDb from './src/config/connectDB.js';
import authRoutes from './src/routes/auth.routes.js';
import appRoutes from './src/routes/queries.routes.js';
import notifications from './src/routes/notification.routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', appRoutes);
app.use('/api', notifications);

connectToDb().then(() => {
  app.listen(3000, () => console.log(`Server running on port 3000`));
}).catch((err) => console.error('Database connection failed:', err));

export default app;
