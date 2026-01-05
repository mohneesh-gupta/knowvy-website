import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Common profile fields (kept in profile as per "Profile data must be separate from auth" but some might be redundant with User.name. The prompt says "Ensure fields: name" in User.js. Profile models usually create separation. I'll keep profile specific 'name' if it differs, or maybe just redundant. The prompt 'Each profile model MUST: Contain a user... Contain ONLY role-specific fields'. Wait. 'Contain ONLY role-specific fields'. Does 'name' count as role specific? No. 'name' is in User.js. However, 'Action 1.2' says 'Each profile model MUST NOT contain: email, password...'. It doesn't explicitly say remove 'name'. But 'Contain ONLY role-specific fields' implies common fields like name might move to User.
    // However, Phase 3.1 says "Create User with... Create corresponding role profile". Secure/Production ready usually puts common profile data in User or a Profile Common.
    // The prompt says "Profile data must be separate from auth". "User.js" is Auth collection. So "name" in User.js is for Auth? or Display?
    // User.js requirements: "name, email...".
    // Profile requirements: "Contain ONLY role-specific fields".
    // This suggests 'name' should be in User, and removed from Profile?
    // Let's check Phase 4.1 "Update User common fields". This confirms 'name' is in User.
    // So I should remove 'name', 'email', 'avatar', 'phone', 'bio' from profile?
    // Wait, 'avatar', 'phone', 'bio' are NOT in User.js requirements.
    // So 'avatar', 'phone', 'bio' must remain in Profile?
    // But 'Contain ONLY role-specific fields'. 'bio' is common to all profiles but not in User.js.
    // Maybe "role-specific" here means "non-auth" fields specific to the profile entity (which represents the role).
    // Let's keep 'avatar', 'phone', 'bio' in profile for now, but remove 'name' and 'email' as they are in User.
    // Actually, looking at Phase 3.1, "Validate email... Create User... Create role profile".
    // "Modify User.js... Ensure fields: name...".
    // So 'name' is in User.
    // I will remove 'name' and 'email' from Profile.
    // I will keep 'avatar', 'phone', 'bio' in Profile as they are not in User.js requirements.

    // Update: user prompt Phase 6.3 "Pre-fill name/email/avatar". "Disable Google-provided fields".
    // This implies name/email come from User (or Google). Avatar might come from google too.
    // If I put name in User, I should access it from User.
    // Let's strictly follow "Contain ONLY role-specific fields" and "Remove email, password".
    // It breaks 'Common' section.
    // I'll keep 'avatar', 'phone', 'bio' here.
    avatar: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    phone: { type: String },
    bio: { type: String },

    // Student-specific
    college: { type: String },
    skills: { type: [String] },

    // Optional academic info
    year: { type: Number },
    enrollmentNumber: { type: String },
    branch: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
