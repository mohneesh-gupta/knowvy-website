import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    phone: { type: String },
    bio: { type: String },

    // Admin-only
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
