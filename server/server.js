import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import configurePassport from './config/passport.js';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import ttsRoutes from './routes/ttsRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import mentorshipRoutes from './routes/mentorshipRoutes.js';

dotenv.config();
connectDB();
configurePassport(); // Setup passport strategies

const app = express();

/* ======================
   GLOBAL MIDDLEWARE
   ====================== */
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Session middleware (Required for Passport)
app.use(
   session({
      secret: process.env.SESSION_SECRET || 'dev_secret_key', // Make sure to adding this to .env
      resave: false,
      saveUninitialized: false,
      cookie: {
         secure: process.env.NODE_ENV === 'production', // Secure cookies in production
         maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
   })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

/* ======================
   ROUTES
   ====================== */
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); // Profile routes mounted here
app.use('/api/ai', aiRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mentorship', mentorshipRoutes);

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
