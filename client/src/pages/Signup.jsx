import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  AlertTriangle,
  Phone,
  BookOpen,
  FileText,
  Code,
  Briefcase,
  MapPin,
  Building,
} from "lucide-react";

/**
 * Signup Page
 * - One form for all user types
 * - Common fields required for everyone
 * - Role-based fields rendered dynamically
 * - Avatar validated manually (NOT via HTML required)
 */
const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ===================== COMMON REQUIRED FIELDS ===================== */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  /* ===================== USER TYPE ===================== */
  const [userType, setUserType] = useState("student");

  /* ===================== STUDENT ===================== */
  const [college, setCollege] = useState("");
  const [skills, setSkills] = useState("");

  /* ===================== MENTOR ===================== */
  const [occupation, setOccupation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  /* ===================== ORGANIZATION ===================== */
  const [orgName, setOrgName] = useState("");
  const [location, setLocation] = useState("");

  /* ===================== UI STATE ===================== */
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===================== SUBMIT HANDLER ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Manual validation for avatar (hidden file input)
    if (!avatar) {
      setError("Profile picture is required.");
      setLoading(false);
      return;
    }

    // Normalize skills into an array (usable for both student & mentor)
    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Client-side validation for role-specific required fields
    if (userType === "student") {
      if (!college.trim()) {
        setError("College is required for students.");
        setLoading(false);
        return;
      }
      if (skillsArray.length === 0) {
        setError("At least one skill is required for students.");
        setLoading(false);
        return;
      }
    }

    if (userType === "mentor") {
      if (!occupation.trim()) {
        setError("Occupation is required for mentors.");
        setLoading(false);
        return;
      }
      if (!specialty.trim()) {
        setError("Specialty field is required for mentors.");
        setLoading(false);
        return;
      }
      if (!String(experienceYears).trim()) {
        setError("Experience (years) is required for mentors.");
        setLoading(false);
        return;
      }
      const parsed = Number(experienceYears);
      if (Number.isNaN(parsed) || parsed < 0) {
        setError("Experience (years) must be a valid non-negative number.");
        setLoading(false);
        return;
      }
    }

    if (userType === "organization") {
      if (!orgName.trim()) {
        setError("Organization name is required.");
        setLoading(false);
        return;
      }
      if (!location.trim()) {
        setError("Organization location/address is required.");
        setLoading(false);
        return;
      }
    }

    try {
      const extraFields = {};

      // STUDENT: send college & skills (skills via skillsArray)
      if (userType === "student") {
        extraFields.college = college.trim();
        // no need to duplicate skills in extraFields because we pass skillsArray in the main skills arg
      }

      // MENTOR: send occupation, specialtyField, experienceYears
      if (userType === "mentor") {
        extraFields.occupation = occupation.trim();
        // IMPORTANT: backend expects `specialtyField`
        extraFields.specialtyField = specialty.trim();
        // convert to number before sending
        extraFields.experienceYears = Number(experienceYears);
        // skills will be passed via skillsArray param
      }

      // ORGANIZATION: send orgName & location
      if (userType === "organization") {
        extraFields.orgName = orgName.trim();
        extraFields.location = location.trim();
      }

      // Call signup:
      // signup(name, email, password, userType, phone, collegeParam, bio, skillsParam, avatar, ...otherFields)
      await signup(
        name,
        email,
        password,
        userType,
        phone,
        null, // college handled via extraFields (or passed in signup param if you prefer)
        bio,
        skillsArray, // send normalized skills here (will be used by student and mentor)
        avatar,
        extraFields
      );

      navigate("/");
    } catch (errMessage) {
      // errMessage comes from AuthContext and is a string
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== AVATAR HANDLER ===================== */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 mb-12">
      <div className="glass-panel p-8 border-neon-green/30 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
        <h2 className="text-3xl font-display font-bold text-center mb-8">
          Create Account
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* NAME + EMAIL */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name *" icon={User} value={name} onChange={setName} required />
            <Input label="Email Address *" icon={Mail} value={email} onChange={setEmail} type="email" required />
          </div>

          {/* AVATAR */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Profile Picture *</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-500" size={32} />
                )}
              </div>

              <label className="cursor-pointer bg-white/10 hover:bg-white/20 border px-4 py-2 rounded-lg text-sm">
                Choose Image
                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
              </label>
            </div>
          </div>

          {/* PASSWORD + PHONE */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Password *" icon={Lock} value={password} onChange={setPassword} type="password" required />
            <Input label="Phone *" icon={Phone} value={phone} onChange={setPhone} required />
          </div>

          {/* BIO */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Bio *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
              <textarea
                rows="2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full bg-dark-bg border rounded-lg py-3 pl-10 pr-4 text-white"
              />
            </div>
          </div>

          {/* USER TYPE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">I am a *</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full bg-dark-bg border rounded-lg py-3 px-4 text-white"
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="organization">Organization</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* ADMIN WARNING */}
          {userType === "admin" && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
              <p className="text-xs text-yellow-400">⚠️ Only one admin account is allowed.</p>
            </div>
          )}

          {/* ROLE-BASED FIELDS */}
          {userType === "student" && (
            <>
              <Input label="College *" icon={BookOpen} value={college} onChange={setCollege} required />
              <Input label="Skills *" icon={Code} value={skills} onChange={setSkills} required placeholder="React, Java, DSA" />
            </>
          )}

          {userType === "mentor" && (
            <>
              <Input label="Occupation *" icon={Briefcase} value={occupation} onChange={setOccupation} required />
              <Input label="Specialty Field *" icon={Code} value={specialty} onChange={setSpecialty} required />
              <Input
                label="Experience (Years) *"
                icon={Briefcase}
                type="number"
                value={experienceYears}
                onChange={setExperienceYears}
                required
              />
              <Input label="Skills *" icon={Code} value={skills} onChange={setSkills} required placeholder="React, Node.js" />
            </>
          )}

          {userType === "organization" && (
            <>
              <Input label="Organization Name *" icon={Building} value={orgName} onChange={setOrgName} required />
              <Input label="Location / Address *" icon={MapPin} value={location} onChange={setLocation} required />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-green text-black font-bold py-3 rounded-lg hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Join Knowvy"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-neon-blue hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

/* ===================== REUSABLE INPUT ===================== */
function Input({ label, icon: Icon, value, onChange, type = "text", placeholder, required = false }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-dark-bg border rounded-lg py-3 pl-10 pr-4 text-white"
        />
      </div>
    </div>
  );
}
