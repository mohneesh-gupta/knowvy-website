import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            // Password required only if authProvider is local
            required: function () {
                return this.authProvider === 'local';
            },
        },
        role: {
            type: String,
            enum: ['student', 'mentor', 'organization', 'admin'],
            required: function () {
                // If they are local, role is required.
                // If they are google, role is required only AFTER profile completion.
                if (this.authProvider === 'local') return true;
                return this.profileCompleted === true;
            },
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        profileCompleted: {
            type: Boolean,
            default: false,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        googleId: {
            type: String,
            sparse: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        averageRating: {
            type: Number,
            default: 0
        },
        numReviews: {
            type: Number,
            default: 0
        },
        eventsJoined: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hackathon' // Or Session, unify if possible
        }]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for userType to maintain backward compatibility with frontend
userSchema.virtual('userType').get(function () {
    return this.role;
});

// Hash password before saving (only for local auth)
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
