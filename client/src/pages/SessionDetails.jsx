import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, User, ArrowLeft } from 'lucide-react';

const SessionDetails = () => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/sessions/${id}`);
                setSession(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching session:', error);
                setLoading(false);
            }
        };
        fetchSession();
    }, [id]);

    if (loading) return <div className="text-center mt-20 text-neon-pink">Loading Session Details...</div>;
    if (!session) return <div className="text-center mt-20 text-red-500">Session Not Found</div>;

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <Link to="/sessions" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                Back to Sessions
            </Link>

            {/* Banner Hero */}
            <div className="h-[300px] w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <img
                    src={session.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                    alt={session.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase mb-4 inline-block ${session.mode === 'online' ? 'bg-neon-blue text-black' : 'bg-neon-green text-black'
                        }`}>
                        {session.mode}
                    </span>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">{session.title}</h1>
                    <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-neon-pink">
                            {session.speakerImage && <img src={session.speakerImage} alt={session.speakerName} className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-medium">{session.speakerName}</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <div className="glass-panel p-8">
                        <h2 className="text-2xl font-bold mb-4">About This Session</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{session.description}</p>
                    </div>

                    {/* Organizer Details */}
                    {session.createdBy && (
                        <div className="glass-panel p-6 border-neon-pink/30">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-pink">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Organized By
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-neon-pink/20 border-2 border-neon-pink/50 flex items-center justify-center overflow-hidden">
                                        {session.createdBy.avatar ? (
                                            <img src={session.createdBy.avatar} alt={session.createdBy.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-neon-pink font-bold text-lg">{session.createdBy.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{session.createdBy.name}</p>
                                        <p className="text-sm text-gray-400">{session.createdBy.email}</p>
                                    </div>
                                </div>
                                {session.createdBy.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        <span>{session.createdBy.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 space-y-6 sticky top-24">
                        <a
                            href={session.linkOrVenue}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full text-center bg-neon-pink text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all"
                        >
                            {session.mode === 'online' ? 'Join Meeting' : 'View Location'}
                        </a>

                        <div className="space-y-4 border-t border-white/10 pt-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Calendar size={18} className="text-neon-pink" />
                                    <span>Date</span>
                                </div>
                                <p className="font-bold text-white pl-6">{new Date(session.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Clock size={18} className="text-neon-pink" />
                                    <span>Time</span>
                                </div>
                                <p className="font-bold text-white pl-6">{session.time}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    {session.mode === 'online' ? <Video size={18} className="text-neon-pink" /> : <MapPin size={18} className="text-neon-pink" />}
                                    <span>{session.mode === 'online' ? 'Meeting Link' : 'Venue'}</span>
                                </div>
                                <p className="font-bold text-white pl-6 break-all">{session.linkOrVenue}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <User size={18} className="text-neon-pink" />
                                    <span>Speaker</span>
                                </div>
                                <p className="font-bold text-white pl-6">{session.speakerName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionDetails;
