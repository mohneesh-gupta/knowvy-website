import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import ttsRoutes from './routes/ttsRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();
connectDB();

const app = express();

/* ======================
   GLOBAL MIDDLEWARE
   ====================== */
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/* ======================
   ROUTES
   ====================== */
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/mentors', mentorRoutes);

/* ======================
   ROOT ROUTE
   ====================== */
app.get('/', (req, res) => {
  res.send('API is running...');
});

/* ======================
   404 HANDLER (REQUIRED)
   ====================== */
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

/* ======================
   ERROR HANDLER
   ====================== */
app.use(errorHandler);

/* ======================
   SERVER START
   ====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
