import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const organizationSchema = new mongoose.Schema(
  {
    // Common
    name: { type: String, required: true }, // contact person
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

    // Organization-specific
    orgName: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password
organizationSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
organizationSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Organization", organizationSchema);
