import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Calendar, MapPin, ArrowRight, Filter, SlidersHorizontal } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Hackathons = () => {
    const { user } = useContext(AuthContext);
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [locationFilter, setLocationFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-asc'); // date-asc, date-desc, location-asc, location-desc

    useEffect(() => {
        const fetchHackathons = async () => {
            const { data } = await axios.get(`${API_BASE_URL}/api/hackathons`);
            setHackathons(data);
            setLoading(false);
        };
        fetchHackathons();
    }, []);

    // Get unique locations and types for filter options
    const uniqueLocations = ['all', ...new Set(hackathons.map(h => h.location))];
    // Define proper hackathon statuses
    const uniqueTypes = ['all', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

    // Apply filters and sorting
    const filteredHackathons = hackathons
        .filter(h => locationFilter === 'all' || h.location === locationFilter)
        .filter(h => typeFilter === 'all' || h.status === typeFilter)
        .sort((a, b) => {
            if (sortBy === 'date-asc') return new Date(a.startDate) - new Date(b.startDate);
            if (sortBy === 'date-desc') return new Date(b.startDate) - new Date(a.startDate);
            if (sortBy === 'location-asc') return a.location.localeCompare(b.location);
            if (sortBy === 'location-desc') return b.location.localeCompare(a.location);
            return 0;
        });

    if (loading) return <div className="text-center mt-20 text-neon-green">Loading Hackathons...</div>;

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-4xl font-display font-bold">Upcoming Hackathons</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg font-bold transition-all"
                        >
                            <SlidersHorizontal size={18} />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                        {user && (
                            <Link to="/hackathons/add" className="bg-white/10 hover:bg-neon-green hover:text-black border border-white/20 px-6 py-2 rounded-lg font-bold transition-all">
                                + Host Hackathon
                            </Link>
                        )}
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="glass-panel p-6 space-y-4 animate-in slide-in-from-top-5">
                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Location Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                    <MapPin size={16} className="text-neon-green" />
                                    Location
                                </label>
                                <select
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-neon-green transition-colors"
                                >
                                    {uniqueLocations.map(loc => (
                                        <option key={loc} value={loc} className="bg-dark-card text-white">
                                            {loc === 'all' ? 'All Locations' : loc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                    <Filter size={16} className="text-neon-blue" />
                                    Status
                                </label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-neon-blue transition-colors"
                                >
                                    {uniqueTypes.map(type => (
                                        <option key={type} value={type} className="bg-dark-card text-white">
                                            {type === 'all' ? 'All Types' : type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                    <Calendar size={16} className="text-neon-pink" />
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-neon-pink transition-colors"
                                >
                                    <option value="date-asc" className="bg-dark-card text-white">Date (Oldest First)</option>
                                    <option value="date-desc" className="bg-dark-card text-white">Date (Newest First)</option>
                                    <option value="location-asc" className="bg-dark-card text-white">Location (A-Z)</option>
                                    <option value="location-desc" className="bg-dark-card text-white">Location (Z-A)</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Filter size={14} />
                            Showing {filteredHackathons.length} of {hackathons.length} hackathons
                        </div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHackathons.map((hackathon) => (
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
