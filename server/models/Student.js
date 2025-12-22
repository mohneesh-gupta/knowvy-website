import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    // Common
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    phone: { type: String, required: true },
    bio: { type: String, required: true },

    // Student-specific
    college: { type: String, required: true },
    skills: { type: [String], required: true },

    // Optional academic info
    year: { type: Number },
    enrollmentNumber: { type: String },
    branch: { type: String },
  },
  { timestamps: true }
);

// Hash password
studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Student", studentSchema);
