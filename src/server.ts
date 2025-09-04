import express from 'express';
import dotenv from 'dotenv';
import { authRoutes } from './auth/auth.routes';
import { userRoutes } from './users/user.routes';
import { courseRoutes } from './courses/course.routes';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';
import { inMemoryStore } from './shared/data/in-memory-store';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Initialize default admin
inMemoryStore.initializeDefaultAdmin();

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
