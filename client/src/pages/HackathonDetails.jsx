import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Globe, User, Clock, CheckCircle } from 'lucide-react';

const HackathonDetails = () => {
    const { id } = useParams();
    const [hackathon, setHackathon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHackathon = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/hackathons/${id}`);
                setHackathon(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchHackathon();
    }, [id]);

    if (loading) return <div className="text-center mt-20 text-neon-green">Loading Details...</div>;
    if (!hackathon) return <div className="text-center mt-20 text-red-500">Hackathon Not Found</div>;

    return (
        <div className="space-y-8">
            {/* Banner Hero */}
            <div className="h-[400px] w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <img src={hackathon.banner} alt={hackathon.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                    <span className="bg-neon-green text-black px-3 py-1 rounded-full text-sm font-bold uppercase mb-4 inline-block">
                        {hackathon.status}
                    </span>
                    <h1 className="text-5xl font-display font-bold text-white mb-2">{hackathon.title}</h1>
                    <p className="text-xl text-gray-300 font-light">{hackathon.theme}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <div className="glass-panel p-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            About The Event
                        </h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {hackathon.description}
                        </p>
                    </div>

                    <div className="glass-panel p-8">
                        <h2 className="text-2xl font-bold mb-4">Timeline</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center text-neon-purple">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Starts</p>
                                    <p className="text-lg font-bold">{new Date(hackathon.startDate).toDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center text-neon-purple">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Ends</p>
                                    <p className="text-lg font-bold">{new Date(hackathon.endDate).toDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 space-y-6 sticky top-24">
                        <a href={hackathon.website} target="_blank" rel="noreferrer" className="block w-full text-center bg-neon-green text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] transition-all">
                            Visit Website & Register
                        </a>

                        <div className="space-y-4 border-t border-white/10 pt-4">
                            <div className="flex items-center justify-between text-gray-300">
                                <span className="flex items-center gap-2"><MapPin size={18} className="text-gray-500" /> Location</span>
                                <span className="font-bold">{hackathon.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-300">
                                <span className="flex items-center gap-2"><User size={18} className="text-gray-500" /> Team Size</span>
                                <span className="font-bold">1 - 4 Members</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-300">
                                <span className="flex items-center gap-2"><Globe size={18} className="text-gray-500" /> Entry Fee</span>
                                <span className="font-bold text-neon-green">{hackathon.entryFee === 0 ? 'Free' : `$${hackathon.entryFee}`}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">Organized By</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neon-purple/20 rounded-full border border-neon-purple/50 flex items-center justify-center overflow-hidden">
                                    {hackathon.createdBy?.avatar ? (
                                        <img src={hackathon.createdBy.avatar} alt={hackathon.createdBy.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-neon-purple font-bold">{hackathon.createdBy?.name?.charAt(0) || 'O'}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{hackathon.createdBy?.name || "Organizer"}</p>
                                    {hackathon.createdBy?.email && (
                                        <p className="text-xs text-gray-500">{hackathon.createdBy.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HackathonDetails;
