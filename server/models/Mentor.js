import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mentorSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    bio: { type: String },
    phone: { type: String },
    expertise: [{ type: String }], // e.g., ['React', 'Node.js', 'AI/ML']
    experience: { type: Number }, // years of experience
    company: { type: String },
    designation: { type: String },
    linkedIn: { type: String },
    github: { type: String },
    twitter: { type: String },
    availability: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available'
    },
    rating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    hourlyRate: { type: Number }, // optional, for paid mentorship
    languages: [{ type: String }] // languages spoken
}, {
    timestamps: true
});

// Hash password before saving
mentorSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
mentorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;
