import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with same email (account linking)
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Link Google account to existing user
                user.googleId = profile.id;
                user.authProvider = 'google';
                await user.save();
                return done(null, user);
            }

            // Create new user
            const newUser = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                authProvider: 'google',
                userType: 'student', // Default, will be updated in complete-profile
                profileCompleted: false,
                isApproved: false,
            });

            done(null, newUser);
        } catch (error) {
            console.error('Google Strategy Error:', error);
            done(error, null);
        }
    }
);

export default googleStrategy;
