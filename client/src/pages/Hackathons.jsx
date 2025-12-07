import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const Hackathons = () => {
    const { user } = useContext(AuthContext);
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHackathons = async () => {
            const { data } = await axios.get('http://localhost:5000/api/hackathons');
            setHackathons(data);
            setLoading(false);
        };
        fetchHackathons();
    }, []);

    if (loading) return <div className="text-center mt-20 text-neon-green">Loading Hackathons...</div>;

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-display font-bold">Upcoming Hackathons</h1>
                {user && (user.userType === 'organization' || user.userType === 'mentor' || user.userType === 'admin') && (
                    <Link to="/hackathons/add" className="bg-white/10 hover:bg-neon-green hover:text-black border border-white/20 px-6 py-2 rounded-lg font-bold transition-all">
                        + Host Hackathon
                    </Link>
                )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hackathons.map((hackathon) => (
                    <div key={hackathon._id} className="glass-panel overflow-hidden group hover:border-neon-blue/50 transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={hackathon.banner}
                                alt={hackathon.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent opacity-80" />
                            <span className="absolute bottom-4 left-4 bg-neon-blue text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                                {hackathon.status}
                            </span>
                        </div>

                        <div className="p-6 space-y-4">
                            <h3 className="text-2xl font-bold font-display group-hover:text-neon-blue transition-colors">
                                {hackathon.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">{hackathon.description}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} className="text-neon-purple" />
                                    {new Date(hackathon.startDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} className="text-neon-green" />
                                    {hackathon.location}
                                </div>
                            </div>

                            <Link to={`/hackathons/${hackathon._id}`} className="block w-full text-center py-3 border border-white/10 rounded-lg hover:bg-neon-blue hover:text-black hover:font-bold transition-all mt-4">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hackathons;
