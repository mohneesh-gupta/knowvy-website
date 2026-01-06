import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Calendar, Clock, MessageSquare, Phone, User, Mail, FileText, ArrowLeft } from 'lucide-react';

const BookMentor = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingType, setBookingType] = useState('call'); // 'call' or 'message'
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        preferredDate: '',
        preferredTime: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/mentors/${id}`);
                setMentor(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching mentor:', error);
                setLoading(false);
            }
        };
        fetchMentor();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('Please login to book a mentorship session');
            return;
        }

        if (user.userType !== 'student') {
            setError('Only students can book mentorship sessions');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };

            await axios.post('http://localhost:5000/api/mentorship', {
                mentorId: id,
                type: bookingType,
                subject: formData.subject,
                message: formData.message,
                preferredDate: formData.preferredDate,
                preferredTime: formData.preferredTime
            }, config);

            setSuccess(true);
            setTimeout(() => {
                navigate('/mentorship');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book session');
        }
    };

    if (loading) {
        return <div className="text-center mt-20 text-neon-purple">Loading mentor details...</div>;
    }

    if (!mentor) {
        return <div className="text-center mt-20 text-red-500">Mentor not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/mentorship')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Mentors
            </button>

            {/* Mentor Info Card */}
            <div className="glass-panel p-6 border-neon-purple/30">
                <div className="flex gap-6 items-start">
                    <img
                        src={mentor.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                        alt={mentor.name}
                        className="w-24 h-24 rounded-full border-2 border-neon-purple object-cover"
                    />
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-2">{mentor.name}</h2>
                        <p className="text-gray-400 mb-3">{mentor.bio}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            {mentor.company && (
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-neon-purple" />
                                    <span>{mentor.company}</span>
                                </div>
                            )}
                            {mentor.experience && (
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-neon-purple" />
                                    <span>{mentor.experience} years experience</span>
                                </div>
                            )}
                        </div>
                        {mentor.expertise && mentor.expertise.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {mentor.expertise.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-neon-purple/20 border border-neon-purple/50 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Form */}
            <div className="glass-panel p-8">
                <h3 className="text-2xl font-bold mb-6">Book a Session</h3>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-lg mb-6">
                        ✅ Booking request sent successfully! Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Session Type */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400">Session Type *</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setBookingType('call')}
                                className={`p-4 rounded-lg border-2 transition-all ${bookingType === 'call'
                                    ? 'border-neon-blue bg-neon-blue/10'
                                    : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <Phone className="mx-auto mb-2" size={24} />
                                <div className="font-bold">Video Call</div>
                                <div className="text-xs text-gray-400">1-on-1 session</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setBookingType('message')}
                                className={`p-4 rounded-lg border-2 transition-all ${bookingType === 'message'
                                    ? 'border-neon-pink bg-neon-pink/10'
                                    : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <MessageSquare className="mx-auto mb-2" size={24} />
                                <div className="font-bold">Chat Session</div>
                                <div className="text-xs text-gray-400">Text-based guidance</div>
                            </button>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Subject *</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                                placeholder="What do you want to discuss?"
                                required
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Message *</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows="4"
                            className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-neon-purple transition-colors text-white resize-none"
                            placeholder="Provide more details about what you'd like help with..."
                            required
                        />
                    </div>

                    {/* Preferred Date & Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Preferred Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="date"
                                    value={formData.preferredDate}
                                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Preferred Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="time"
                                    value={formData.preferredTime}
                                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-purple transition-colors text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white py-4 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(188,19,254,0.5)] transition-all"
                    >
                        Send Booking Request
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                        The mentor will review your request and get back to you soon.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BookMentor;
