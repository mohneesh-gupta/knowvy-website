import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Common Profile Data
    avatar: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },

    // Mentor-specific
    occupation: { type: String, required: true, trim: true },
    specialtyField: { type: String, required: true, trim: true },
    experienceYears: { type: Number, required: true, min: 0 },
    skills: { type: [String], default: [] },

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
  }
);

export default mongoose.model("Mentor", mentorSchema);
