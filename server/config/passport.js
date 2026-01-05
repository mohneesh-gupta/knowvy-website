import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
                // Pass req to callback if needed, but usually not for basic auth
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user exists by email
                    // Google profile emails are in profile.emails array
                    const email = profile.emails[0].value;
                    let user = await User.findOne({ email });

                    if (user) {
                        // User exists
                        const avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '';

                        // Update googleId or avatar if missing
                        if (!user.googleId || !user.avatar) {
                            if (!user.googleId) user.googleId = profile.id;
                            if (!user.avatar) user.avatar = avatarUrl;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // User not found, create new one
                    const avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '';
                    user = await User.create({
                        name: profile.displayName,
                        email: email,
                        authProvider: 'google',
                        googleId: profile.id,
                        avatar: avatarUrl,
                        profileCompleted: false,
                    });

                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );

    // Serialization
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default configurePassport;
