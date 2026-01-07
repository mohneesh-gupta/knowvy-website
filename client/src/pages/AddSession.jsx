import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Calendar, Video, Clock, User, FileText, Link as LinkIcon } from 'lucide-react';
import API_BASE_URL from '../config/api';

const AddSession = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Form States
    const [title, setTitle] = useState('');
    const [speakerName, setSpeakerName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [mode, setMode] = useState('online');
    const [linkOrVenue, setLinkOrVenue] = useState('');
    const [description, setDescription] = useState('');
    const [banner, setBanner] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');
    const [speakerImage, setSpeakerImage] = useState('');
    const [speakerImagePreview, setSpeakerImagePreview] = useState('');

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

    const handleSpeakerImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSpeakerImagePreview(reader.result);
                setSpeakerImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };

        await axios.post(`${API_BASE_URL}/api/sessions`, {
            title,
            speakerName,
            date,
            time,
            mode,
            linkOrVenue,
            description,
            banner: banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            speakerImage: speakerImage || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
        }, config);

        navigate('/sessions');
    };

    // Check if user has permission - admin can create anything
    if (!user || (user.userType === 'student')) {
        return (
            <div className="max-w-2xl mx-auto mt-20 text-center">
                <div className="glass-panel p-8 border-red-500/30">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
                    <p className="text-gray-400">Only organizations, mentors, and admins can create sessions.</p>
                    <Link to="/sessions" className="mt-6 inline-block bg-neon-pink text-white px-6 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all">
                        View Sessions
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
                    <p className="text-gray-400 mb-4">Your account needs to be approved by an admin before you can create sessions.</p>
                    <p className="text-sm text-gray-500">Please wait for admin approval. You'll receive a notification once your account is approved.</p>
                    <Link to="/sessions" className="mt-6 inline-block bg-neon-pink text-white px-6 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all">
                        View Sessions
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-display font-bold mb-8 text-center">Schedule Session</h1>

            <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-5 border-neon-pink/30">
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Session Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 px-4 text-white focus:border-neon-pink focus:outline-none" required />
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Speaker Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input type="text" value={speakerName} onChange={(e) => setSpeakerName(e.target.value)} className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-pink focus:outline-none" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-medium">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-pink focus:outline-none" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-medium">Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-pink focus:outline-none" required />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Mode</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="mode" value="online" checked={mode === 'online'} onChange={(e) => setMode(e.target.value)} className="accent-neon-pink" />
                            Online
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="mode" value="offline" checked={mode === 'offline'} onChange={(e) => setMode(e.target.value)} className="accent-neon-pink" />
                            Offline
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">{mode === 'online' ? 'Meeting Link' : 'Venue Address'}</label>
                    <div className="relative">
                        {mode === 'online' ? <LinkIcon className="absolute left-3 top-2.5 text-gray-500" size={18} /> : <Video className="absolute left-3 top-2.5 text-gray-500" size={18} />}
                        <input type="text" value={linkOrVenue} onChange={(e) => setLinkOrVenue(e.target.value)} className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-pink focus:outline-none" required />
                    </div>
                </div>

                {/* Banner Upload */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Session Banner (optional)</label>
                    <div className="space-y-3">
                        {bannerPreview && (
                            <div className="w-full h-40 rounded-lg overflow-hidden border-2 border-white/10">
                                <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            {bannerPreview ? 'Change Banner' : 'Upload Banner'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Speaker Image Upload */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Speaker Photo (optional)</label>
                    <div className="space-y-3">
                        {speakerImagePreview && (
                            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-neon-pink/50">
                                <img src={speakerImagePreview} alt="Speaker Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 w-full">
                            <User size={18} />
                            {speakerImagePreview ? 'Change Photo' : 'Upload Speaker Photo'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleSpeakerImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-dark-bg border border-white/10 rounded-lg py-2 px-4 text-white focus:border-neon-pink focus:outline-none" required></textarea>
                </div>

                <button type="submit" className="w-full bg-neon-pink text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all">
                    Create Session
                </button>
            </form>
        </div>
    );
};

export default AddSession;
