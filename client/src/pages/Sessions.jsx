import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Calendar, Clock, Video, MapPin, Search } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [filter, setFilter] = useState('all'); // all, online, offline
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchSessions = async () => {
            const { data } = await axios.get(`${API_BASE_URL}/api/sessions`);
            setSessions(data);
        };
        fetchSessions();
    }, []);

    const filteredSessions = sessions.filter(session =>
        filter === 'all' ? true : session.mode === filter
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-4xl font-display font-bold">Tech Sessions</h1>

                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-neon-pink text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                        >All</button>
                        <button
                            onClick={() => setFilter('online')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'online' ? 'bg-neon-pink text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                        >Online</button>
                        <button
                            onClick={() => setFilter('offline')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'offline' ? 'bg-neon-pink text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                        >Offline</button>
                    </div>

                    {user && (user.userType === 'organization' || user.userType === 'mentor' || user.userType === 'admin') && (
                        <Link to="/sessions/add" className="bg-white/10 hover:bg-neon-pink hover:text-black border border-white/20 px-6 py-2 rounded-lg font-bold transition-all">
                            + Add Session
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.map((session) => (
                    <Link key={session._id} to={`/sessions/${session._id}`} className="glass-panel p-6 flex flex-col gap-4 hover:border-neon-pink/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold font-display leading-tight mb-2">{session.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                                        {session.speakerImage && <img src={session.speakerImage} alt="spk" className="w-full h-full object-cover" />}
                                    </div>
                                    <span>{session.speakerName}</span>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${session.mode === 'online' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-neon-green/20 text-neon-green'}`}>
                                {session.mode.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-2">{session.description}</p>

                        <div className="space-y-2 mt-auto">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Calendar size={16} className="text-neon-pink" />
                                {new Date(session.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Clock size={16} className="text-neon-pink" />
                                {session.time}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                {session.mode === 'online' ? <Video size={16} className="text-neon-pink" /> : <MapPin size={16} className="text-neon-pink" />}
                                <span className="truncate max-w-[200px]">{session.linkOrVenue}</span>
                            </div>
                        </div>

                        <a href={session.linkOrVenue} target="_blank" rel="noreferrer" className="w-full text-center py-2 border border-neon-pink text-neon-pink rounded-lg hover:bg-neon-pink hover:text-white transition-all font-bold mt-4">
                            {session.mode === 'online' ? 'Join Link' : 'View Venue'}
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sessions;
