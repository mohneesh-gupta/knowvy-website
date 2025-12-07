import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const organizationSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    bio: { type: String },
    phone: { type: String },
    website: { type: String },
    address: { type: String },
    organizationType: {
        type: String,
        enum: ['company', 'ngo', 'college', 'startup', 'other'],
        default: 'company'
    },
    verificationStatus: { type: Boolean, default: false },
    verificationDocuments: [{ type: String }], // URLs to documents
    industry: { type: String },
    size: { type: String } // 'small', 'medium', 'large'
}, {
    timestamps: true
});

// Hash password before saving
organizationSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
organizationSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;
