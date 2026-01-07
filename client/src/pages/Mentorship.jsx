import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Search, Briefcase, Calendar, Linkedin } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Mentorship = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchMentors = async () => {
            const { data } = await axios.get(`${API_BASE_URL}/api/mentors`);
            setMentors(data);
            setLoading(false);
        };
        fetchMentors();
    }, []);

    if (loading) return <div className="text-center mt-20 text-neon-purple">Loading Mentors...</div>;

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-display font-bold">Find Your Mentor</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">Connect with experienced seniors and industry professionals to guide your career path.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                    <div key={mentor._id} className="glass-panel p-6 flex flex-col gap-4 text-center hover:border-neon-purple/50 transition-colors relative group">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gray-700 overflow-hidden border-2 border-neon-purple">
                            <img src={mentor.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={mentor.name} className="w-full h-full object-cover" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold font-display">{mentor.name}</h3>
                            <p className="text-neon-purple text-sm font-medium">{mentor.college || mentor.email}</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {mentor.skills && mentor.skills.length > 0 ? (
                                mentor.skills.map((skill, index) => (
                                    <span key={index} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/5">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-500 italic">No skills listed</span>
                            )}
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-2">{mentor.bio || "Experienced mentor ready to help you grow."}</p>

                        <div className="pt-4 border-t border-white/5 w-full mt-auto space-y-3">

                            {/* Booking Buttons - Hidden for mentors */}
                            {user && user.userType !== 'mentor' ? (
                                <div className="flex gap-2">
                                    <Link
                                        to={`/mentorship/book/${mentor._id}`}
                                        className="flex-1 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 text-neon-blue px-3 py-2 rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        Book Call
                                    </Link>
                                    <Link
                                        to={`/mentorship/book/${mentor._id}`}
                                        className="flex-1 bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/50 text-neon-pink px-3 py-2 rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                        Chat
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 italic">
                                    {user?.role === 'mentor' ? 'You are a mentor' : 'Login to book'}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {mentors.length === 0 && (
                <div className="text-center text-gray-500 py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p>No mentors found yet. Be the first to join!</p>
                </div>
            )}
        </div>
    );
};

export default Mentorship;
