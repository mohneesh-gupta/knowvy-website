import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import API_BASE_URL from "../config/api";
import {
    User as UserIcon,
    Phone,
    BookOpen,
    Code,
    Briefcase,
    MapPin,
    Building,
    FileText,
    AlertTriangle,
} from "lucide-react";

/**
 * CompleteProfile - Premium UI for OAuth profile completion
 */
const CompleteProfile = () => {
    const { user, fetchProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        bio: "",
        avatar: "",
        // Student specific
        college: "",
        skills: "",
        // Mentor specific
        occupation: "",
        specialtyField: "",
        experienceYears: "",
        // Organization specific
        orgName: "",
        location: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Pre-fill name from user object
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || "",
                avatar: user.avatar || "",
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const skillsArray = formData.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            const profileData = {
                phone: formData.phone,
                bio: formData.bio,
                avatar: formData.avatar,
            };

            if (role === "student") {
                profileData.college = formData.college;
                profileData.skills = skillsArray;
            } else if (role === "mentor") {
                profileData.occupation = formData.occupation;
                profileData.specialtyField = formData.specialtyField;
                profileData.experienceYears = Number(formData.experienceYears);
                profileData.skills = skillsArray;
            } else if (role === "organization") {
                profileData.orgName = formData.orgName;
                profileData.location = formData.location;
            }

            const token = user?.token || localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;

            const { data } = await axios.post(
                `${API_BASE_URL}/api/profile/complete-profile`,
                {
                    role,
                    name: formData.name, // Allow updating name
                    password: formData.password, // Set password if provided
                    profileData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (data.success) {
                // Refresh profile in context with the existing token
                await fetchProfile(token);
                // Ensure navigate happens after state is guaranteed to be updated
                setTimeout(() => navigate("/"), 100);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to complete profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-6 mb-12">
            <div className="glass-panel p-8 border-neon-blue/30 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                <h2 className="text-3xl font-display font-bold text-center mb-2">Final Step</h2>
                <p className="text-gray-400 text-center mb-8">Complete your profile to join the community</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertTriangle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* USER TYPE */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Join as</label>
                        <div className="grid grid-cols-3 gap-3">
                            {["student", "mentor", "organization"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`py-2 px-4 rounded-lg border text-sm capitalize transition-all ${role === r
                                        ? "bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                                        : "bg-dark-bg border-white/10 text-gray-400 hover:border-white/30"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            icon={UserIcon}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Email (Disabled)"
                            icon={Building}
                            value={user.email}
                            disabled
                            className="opacity-60 cursor-not-allowed"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            icon={Phone}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Set Password (Optional)"
                            icon={FileText} // Standard lock icon would be better but let's stick to available/themed
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Set to login without Google"
                        />
                    </div>

                    <div className="space-y-2">
                        <Input
                            label="Bio"
                            icon={FileText}
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ROLE SPECIFIC FIELDS */}
                    {role === "student" && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="College"
                                icon={BookOpen}
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Skills (comma separated)"
                                icon={Code}
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                required
                                placeholder="React, Java, DSA"
                            />
                        </div>
                    )}

                    {role === "mentor" && (
                        <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Occupation"
                                    icon={Briefcase}
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Specialty Field"
                                    icon={Code}
                                    name="specialtyField"
                                    value={formData.specialtyField}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Experience (Years)"
                                    icon={Briefcase}
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Skills (comma separated)"
                                    icon={Code}
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {role === "organization" && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Organization Name"
                                icon={Building}
                                name="orgName"
                                value={formData.orgName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Location"
                                icon={MapPin}
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all mt-4 disabled:opacity-50"
                    >
                        {loading ? "Saving Profile..." : "Complete Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Input = ({ label, icon: Icon, required, className, ...props }) => (
    <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
                {...props}
                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-blue transition-colors text-white"
            />
        </div>
    </div>
);

export default CompleteProfile;
