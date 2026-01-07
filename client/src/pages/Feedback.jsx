import { useState, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, Send } from 'lucide-react';
import emailjs from "emailjs-com";
import API_BASE_URL from '../config/api';

const Feedback = () => {
    const { user } = useContext(AuthContext);
    const formRef = useRef();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [category, setCategory] = useState('general');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize EmailJS
    useCallback(() => {
        emailjs.init("kJ3GujBaqufGPl349");
    }, [])();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            toast.error('Please provide feedback message');
            return;
        }

        if (rating === 0) {
            toast.error('Please provide a rating');
            return;
        }

        setLoading(true);

        try {
            // Send email to admin
            await emailjs.sendForm(
                "service_a337m3o",
                "template_8phzcek",
                formRef.current,
                "kJ3GujBaqufGPl349"
            );

            // Send auto-reply to user
            await emailjs.sendForm(
                "service_a337m3o",
                "template_dwfz754",
                formRef.current,
                "kJ3GujBaqufGPl349"
            );

            // Save to database
            const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};

            await axios.post(`${API_BASE_URL}/api/feedback`, {
                name: user?.name || 'Anonymous',
                email: user?.email || '',
                rating,
                category,
                message
            }, config);

            toast.success('Thank you for your feedback! 🎉');

            // Reset form
            setRating(0);
            setCategory('general');
            setMessage('');
        } catch (error) {
            toast.error('Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="glass-panel max-w-2xl w-full p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                        We Value Your Feedback
                    </h1>
                    <p className="text-gray-400">Help us improve Knowvy for everyone!</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field for EmailJS */}
                    <input
                        type="hidden"
                        name="user_name"
                        value={user?.name || 'Anonymous'}
                    />

                    {/* Email Field for EmailJS */}
                    <input
                        type="hidden"
                        name="user_email"
                        value={user?.email || ''}
                    />

                    {/* Rating Field for EmailJS */}
                    <input
                        type="hidden"
                        name="rating"
                        value={rating}
                    />

                    {/* Category Field for EmailJS */}
                    <input
                        type="hidden"
                        name="service_needed"
                        value={category}
                    />

                    {/* Rating */}
                    <div className="space-y-3">
                        <label className="block text-white font-bold">Rate Your Experience</label>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={40}
                                        className={`${star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-600'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-center text-sm text-gray-400">
                                {rating === 1 && "We'll do better 😔"}
                                {rating === 2 && "Thanks for your honesty 🙏"}
                                {rating === 3 && "Good, but we can improve! 💪"}
                                {rating === 4 && "Great! We're happy 😊"}
                                {rating === 5 && "Awesome! You made our day! 🚀"}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-3">
                        <label className="block text-white font-bold">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-neon-pink transition-colors"
                        >
                            <option value="general" className="bg-dark-card text-white">General Feedback</option>
                            <option value="bug" className="bg-dark-card text-white">Bug Report</option>
                            <option value="feature" className="bg-dark-card text-white">Feature Request</option>
                            <option value="ui" className="bg-dark-card text-white">UI/UX Feedback</option>
                            <option value="performance" className="bg-dark-card text-white">Performance Issue</option>
                            <option value="other" className="bg-dark-card text-white">Other</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                        <label className="block text-white font-bold">Your Feedback</label>
                        <textarea
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you think..."
                            rows={6}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-neon-blue transition-colors resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-neon-green to-neon-blue text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                Submit Feedback
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
