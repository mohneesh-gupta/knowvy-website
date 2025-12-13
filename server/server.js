import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import aiRoutes from "./routes/aiRoutes.js";

import authRoutes from './routes/authRoutes.js';

import ttsRoutes from "./routes/ttsRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/tts", ttsRoutes);

app.use("/api/ai", aiRoutes);

import hostRoutes from './routes/hostRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';


app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/mentors', mentorRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
