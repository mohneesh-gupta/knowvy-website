import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Phone, BookOpen, FileText, Code, Upload } from 'lucide-react';

const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        college: '',
        skills: '',
        avatar: '',
        password: ''
    });
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                phone: user.phone || '',
                college: user.college || '',
                skills: user.skills ? user.skills.join(', ') : '',
                avatar: user.avatar || '',
                password: ''
            });
            setAvatarPreview(user.avatar || '');
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // Process skills
            const skillsArray = formData.skills
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            // Build update object
            const updateData = {
                name: formData.name,
                email: formData.email,
                bio: formData.bio,
                phone: formData.phone,
                college: formData.college,
                skills: skillsArray,
                avatar: formData.avatar
            };

            // Only include password if it's not empty
            if (formData.password && formData.password.trim() !== '') {
                updateData.password = formData.password;
            }

            const { data } = await axios.put(
                'http://localhost:5000/api/auth/profile',
                updateData,
                config
            );

            // Update context and localStorage
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));

            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err) {
            console.error('Update error:', err);
            setError(
                err.response?.data?.message ||
                err.message ||
                'Failed to update profile. Please try again.'
            );
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center mt-20">
                <p className="text-gray-400">Please login to edit your profile</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-display font-bold mb-8 text-center">Edit Profile</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                    <p className="text-green-400">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neon-purple/50">
                        <img
                            src={avatarPreview || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2">
                        <Upload size={16} />
                        Change Avatar
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Name *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                            />
                        </div>
                    </div>

                    {/* College */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">College/Organization</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={formData.college}
                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Bio</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows="4"
                            className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Skills (comma-separated)</label>
                    <div className="relative">
                        <Code className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input
                            type="text"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            placeholder="e.g., React, Node.js, Python"
                            className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">New Password (leave blank to keep current)</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                        placeholder="Enter new password"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-neon-purple text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="flex-1 bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
