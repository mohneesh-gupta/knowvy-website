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
} from "lucide-react";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [userType, setUserType] = useState("student");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 📝 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await signup(
        name,
        email,
        password,
        userType,
        phone,
        college,
        bio,
        skillsArray,
        avatar
      );

      navigate("/");
    } catch (errMessage) {
      // ✅ errMessage is ALREADY a string from AuthContext
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🖼 AVATAR
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

        {/* 🔴 ERROR BOX */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* NAME + EMAIL */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              icon={User}
              value={name}
              onChange={setName}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email Address *"
              icon={Mail}
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          {/* AVATAR */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-gray-500" size={32} />
                )}
              </div>

              <label className="cursor-pointer bg-white/10 hover:bg-white/20 border px-4 py-2 rounded-lg text-sm">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
              </label>
            </div>
          </div>

          {/* PASSWORD + PHONE */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Password *"
              icon={Lock}
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="••••••••"
              required
            />

            <Input
              label="Phone"
              icon={Phone}
              value={phone}
              onChange={setPhone}
              placeholder="Optional"
            />
          </div>

          <Input
            label="College / University"
            icon={BookOpen}
            value={college}
            onChange={setCollege}
            placeholder="Optional"
          />

          <Input
            label="Skills (comma-separated)"
            icon={Code}
            value={skills}
            onChange={setSkills}
            placeholder="React, Java, DSA"
          />

          {/* BIO */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Bio</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
              <textarea
                rows="2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
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
              <option value="organization">Organization</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>

            {userType === "admin" && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
                <p className="text-xs text-yellow-400">
                  ⚠️ Only one admin account is allowed.
                </p>
              </div>
            )}
          </div>

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

/* 🔹 SMALL REUSABLE INPUT COMPONENT */
function Input({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) {
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
