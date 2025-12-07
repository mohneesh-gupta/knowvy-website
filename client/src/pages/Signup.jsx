import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, User, AlertTriangle, Phone, BookOpen, FileText, Code } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [college, setCollege] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [userType, setUserType] = useState('student');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [error, setError] = useState(null);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
            await signup(name, email, password, userType, phone, college, bio, skillsArray, avatar);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-6 mb-12">
            <div className="glass-panel p-8 border-neon-green/30 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                <h2 className="text-3xl font-display font-bold text-center mb-8">Create Account</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertTriangle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-green transition-colors text-white"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Email Address *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-green transition-colors text-white"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Profile Picture</label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 overflow-hidden flex items-center justify-center">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-gray-500" />
                                )}
                            </div>
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-all text-sm font-medium">
                                Choose Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-green transition-colors text-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-green transition-colors text-white"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">College/University</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-green transition-colors text-white"
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Skills (comma-separated)</label>
                        <div className="relative">
                            <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-green transition-colors text-white"
                                placeholder="e.g. React, Python, UI/UX"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Bio</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows="2"
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-green transition-colors text-white resize-none"
                                placeholder="Tell us about yourself..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">I am a... *</label>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-neon-green transition-colors text-white"
                        >
                            <option value="student">Student</option>
                            <option value="organization">Organization</option>
                            <option value="mentor">Mentor</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Student: View opportunities • Organization: Host events • Mentor: Teach & guide
                        </p>
                        {userType === 'admin' && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
                                <p className="text-xs text-yellow-400">
                                    ⚠️ <strong>Admin Note:</strong> Only ONE admin account is allowed. If an admin already exists, signup will fail.
                                </p>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="w-full bg-neon-green text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all mt-2">
                        Join Knowvy
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-6">
                    Already have an account? <Link to="/login" className="text-neon-blue hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
