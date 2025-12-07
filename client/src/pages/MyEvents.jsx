import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MyEvents = () => {
    const { user } = useContext(AuthContext);
    const [myHackathons, setMyHackathons] = useState([]);
    const [mySessions, setMySessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hackathons');

    useEffect(() => {
        if (user) {
            fetchMyEvents();
        }
    }, [user]);

    const fetchMyEvents = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // Fetch user's own events (both approved and pending)
            const [hackathonsRes, sessionsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/hackathons/user/my', config),
                axios.get('http://localhost:5000/api/sessions/user/my', config)
            ]);

            setMyHackathons(hackathonsRes.data);
            setMySessions(sessionsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const getStatusBadge = (approved) => {
        if (approved) {
            return (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full text-sm font-bold">
                    <CheckCircle size={16} />
                    Approved
                </span>
            );
        } else {
            return (
                <span className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-full text-sm font-bold">
                    <AlertCircle size={16} />
                    Pending Approval
                </span>
            );
        }
    };

    if (!user) {
        return (
            <div className="text-center mt-20">
                <p className="text-gray-400">Please login to view your events</p>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center mt-20 text-neon-purple">Loading your events...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-display font-bold">My Events</h1>
                <div className="flex gap-4">
                    <Link to="/hackathons/add" className="bg-neon-purple text-white px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all">
                        Add Hackathon
                    </Link>
                    <Link to="/sessions/add" className="bg-neon-pink text-white px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all">
                        Add Session
                    </Link>
                </div>
            </div>

            {/* Info Banner */}
            <div className="glass-panel p-4 border-neon-blue/30">
                <p className="text-gray-300 text-sm">
                    <strong>Note:</strong> All newly created events require admin approval before being visible to the public.
                    You can track the approval status of your submissions here.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('hackathons')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'hackathons'
                        ? 'text-neon-purple border-b-2 border-neon-purple'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    My Hackathons ({myHackathons.length})
                </button>
                <button
                    onClick={() => setActiveTab('sessions')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'sessions'
                        ? 'text-neon-pink border-b-2 border-neon-pink'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    My Sessions ({mySessions.length})
                </button>
            </div>

            {/* Hackathons Tab */}
            {activeTab === 'hackathons' && (
                <div className="space-y-6">
                    {myHackathons.length === 0 ? (
                        <div className="text-center py-20 glass-panel">
                            <p className="text-gray-400 mb-4">You haven't created any hackathons yet</p>
                            <Link to="/hackathons/add" className="bg-neon-purple text-white px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all inline-block">
                                Create Your First Hackathon
                            </Link>
                        </div>
                    ) : (
                        myHackathons.map((hackathon) => (
                            <div key={hackathon._id} className="glass-panel p-6 border-neon-purple/30">
                                <div className="flex gap-6">
                                    <img
                                        src={hackathon.banner}
                                        alt={hackathon.title}
                                        className="w-48 h-32 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold">{hackathon.title}</h3>
                                            {getStatusBadge(hackathon.approved)}
                                        </div>
                                        <p className="text-gray-400 mb-4 line-clamp-2">{hackathon.description}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-neon-purple" />
                                                <span>{new Date(hackathon.startDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-neon-purple" />
                                                <span>{hackathon.location}</span>
                                            </div>
                                        </div>
                                        {!hackathon.approved && (
                                            <p className="text-yellow-400 text-sm mt-3">
                                                ⏳ Waiting for admin approval. This event is not yet visible to the public.
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to={`/hackathons/${hackathon._id}`}
                                            className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 text-neon-purple px-6 py-2 rounded-lg font-bold transition-all text-center"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
                <div className="space-y-6">
                    {mySessions.length === 0 ? (
                        <div className="text-center py-20 glass-panel">
                            <p className="text-gray-400 mb-4">You haven't created any sessions yet</p>
                            <Link to="/sessions/add" className="bg-neon-pink text-white px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all inline-block">
                                Create Your First Session
                            </Link>
                        </div>
                    ) : (
                        mySessions.map((session) => (
                            <div key={session._id} className="glass-panel p-6 border-neon-pink/30">
                                <div className="flex gap-6">
                                    <img
                                        src={session.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                                        alt={session.title}
                                        className="w-48 h-32 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold">{session.title}</h3>
                                            {getStatusBadge(session.approved)}
                                        </div>
                                        <p className="text-gray-400 mb-4 line-clamp-2">{session.description}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-neon-pink" />
                                                <span>{new Date(session.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-neon-pink" />
                                                <span>{session.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-neon-pink" />
                                                <span>Speaker: {session.speakerName}</span>
                                            </div>
                                        </div>
                                        {!session.approved && (
                                            <p className="text-yellow-400 text-sm mt-3">
                                                ⏳ Waiting for admin approval. This session is not yet visible to the public.
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to={`/sessions/${session._id}`}
                                            className="bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/50 text-neon-pink px-6 py-2 rounded-lg font-bold transition-all text-center"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MyEvents;
