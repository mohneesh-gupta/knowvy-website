import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Users, Calendar, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../config/api';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, hackathons: 0, requests: 0 });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.userType !== 'admin') {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            try {
                const reqs = await axios.get(`${API_BASE_URL}/api/host`, config);
                setRequests(reqs.data);

                // Mock stats for now as we don't have a stats endpoint yet
                setStats({
                    users: 12, // Mock
                    hackathons: 5, // Mock
                    requests: reqs.data.length
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate]);

    if (loading) return <div className="text-center mt-20 text-neon-blue">Loading Admin Panel...</div>;

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-display font-bold text-white">Admin Dashboard</h1>
                <button
                    onClick={() => navigate('/admin/approvals')}
                    className="bg-neon-purple text-white px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(188,19,254,0.5)] transition-all"
                >
                    Detailed Approvals
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-neon-blue/20 text-neon-blue flex items-center justify-center">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <h3 className="text-3xl font-bold">{stats.users}</h3>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-neon-green/20 text-neon-green flex items-center justify-center">
                        <Calendar size={32} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Active Hackathons</p>
                        <h3 className="text-3xl font-bold">{stats.hackathons}</h3>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-neon-pink/20 text-neon-pink flex items-center justify-center">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Pending Requests</p>
                        <h3 className="text-3xl font-bold">{stats.requests}</h3>
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            <div className="glass-panel p-8">
                <h2 className="text-2xl font-bold mb-6">Host Requests</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/10">
                                <th className="py-4">Event Name</th>
                                <th className="py-4">Type</th>
                                <th className="py-4">Organizer</th>
                                <th className="py-4">Status</th>
                                <th className="py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 font-bold">{req.eventName}</td>
                                    <td className="py-4 capitalize">{req.eventType}</td>
                                    <td className="py-4">{req.user?.name || 'Unknown'}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                            {req.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button className="text-sm bg-neon-green text-black px-3 py-1 rounded font-bold hover:shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">No pending requests</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
