import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const mentorSchema = new mongoose.Schema(
  {
    // Common
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    avatar: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    phone: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },

    // Mentor-specific
    occupation: { type: String, required: true, trim: true },
    specialtyField: { type: String, required: true, trim: true },
    experienceYears: { type: Number, required: true, min: 0 },
    skills: { type: [String], required: true, default: [] },

    // Optional (future use)
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    rating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      // Remove sensitive fields when converting to JSON
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving
mentorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password (async/await for consistency)
mentorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Mentor", mentorSchema);
