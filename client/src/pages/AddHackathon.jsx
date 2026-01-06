import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Upload, Calendar, Globe, MapPin, Type, FileText, DollarSign, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const AddHackathon = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Form States
    const [title, setTitle] = useState('');
    const [theme, setTheme] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [entryFee, setEntryFee] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('');
    const [tags, setTags] = useState('');
    const [banner, setBanner] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);
                setBanner(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(t => t);

            const hackathonData = {
                title,
                theme,
                description,
                startDate,
                endDate,
                entryFee: entryFee || 0,
                website,
                banner: banner || 'https://via.placeholder.com/800x400',
                location,
                tags: tagsArray
            };

            console.log('Submitting hackathon:', hackathonData);

            const response = await axios.post('http://localhost:5000/api/hackathons', hackathonData, config);

            console.log('Hackathon created:', response.data);
            toast.success('Hackathon submitted successfully! It will be visible once approved by the admin.');
            navigate('/hackathons');
        } catch (error) {
            console.error('Error creating hackathon:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || error.message || 'Failed to create hackathon');
        }
    };

    // Check if user is logged in
    if (!user) {
        return (
            <div className="max-w-2xl mx-auto mt-20 text-center">
                <div className="glass-panel p-8 border-red-500/30">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Login Required</h2>
                    <p className="text-gray-400">Please login to host a hackathon.</p>
                    <Link to="/login" className="mt-6 inline-block bg-neon-purple text-white px-6 py-2 rounded-lg transition-all">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    // Check if mentor/organization account is approved
    if ((user.userType === 'mentor' || user.userType === 'organization') && !user.isApproved) {
        return (
            <div className="max-w-2xl mx-auto mt-20 text-center">
                <div className="glass-panel p-8 border-yellow-500/30">
                    <h2 className="text-2xl font-bold text-yellow-500 mb-4">⏳ Approval Pending</h2>
                    <p className="text-gray-400 mb-4">Your account needs to be approved by an admin before you can host hackathons.</p>
                    <p className="text-sm text-gray-500">Please wait for admin approval. You'll receive a notification once your account is approved.</p>
                    <Link to="/hackathons" className="mt-6 inline-block bg-neon-purple text-white px-6 py-2 rounded-lg transition-all">
                        View Hackathons
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl font-display font-bold mb-8 text-center">Host a Hackathon</h1>

            <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6 border-neon-purple/30">
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Hackathon Title *</label>
                    <div className="relative">
                        <Type className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Theme / Tagline *</label>
                    <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 px-4 text-white focus:border-neon-purple focus:outline-none"
                        placeholder="e.g., Build for Good"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Description *</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none resize-none"
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Banner Upload */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Banner Image (optional)</label>
                    <div className="space-y-3">
                        {bannerPreview && (
                            <div className="w-full h-56 rounded-lg overflow-hidden border-2 border-white/10">
                                <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 w-full">
                            <Upload size={18} />
                            {bannerPreview ? 'Change Banner Image' : 'Upload Banner Image'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-medium">Start Date *</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-medium">End Date *</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-medium">Location *</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none"
                                placeholder="Online / City"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-medium">Entry Fee</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="number"
                                value={entryFee}
                                onChange={(e) => setEntryFee(e.target.value)}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none"
                                placeholder="0 for free"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Website URL</label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Tags (comma-separated)</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none"
                            placeholder="e.g., AI, Web3, Healthcare"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-neon-purple text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all"
                >
                    Submit for Approval
                </button>
            </form>
        </div>
    );
};

export default AddHackathon;
