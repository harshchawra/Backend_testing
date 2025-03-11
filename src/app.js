import express from 'express';
import routes from './routes/queries.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());

app.use('/api/queries', routes);
app.use('/api/auth', authRoutes); // Ensuring auth routes are registered

export default app;
