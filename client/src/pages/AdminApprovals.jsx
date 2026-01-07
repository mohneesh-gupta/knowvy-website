import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { CheckCircle, XCircle, Calendar, MapPin, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const AdminApprovals = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('hackathons');
    const [pendingHackathons, setPendingHackathons] = useState([]);
    const [pendingSessions, setPendingSessions] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingItems();
    }, []);

    const fetchPendingItems = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const [hackathonsRes, sessionsRes, usersRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/hackathons/admin/pending`, config),
                axios.get(`${API_BASE_URL}/api/sessions/admin/pending`, config),
                axios.get(`${API_BASE_URL}/api/admin/pending-users`, config)
            ]);

            setPendingHackathons(hackathonsRes.data);
            setPendingSessions(sessionsRes.data);
            setPendingUsers(usersRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pending items:', error);
            setLoading(false);
        }
    };

    const handleApproveUser = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_BASE_URL}/api/admin/approve-user/${id}`, {}, config);
            toast.success('User approved successfully!');
            fetchPendingItems();
        } catch (error) {
            toast.error('Error approving user');
        }
    };

    const handleRejectUser = async (id) => {
        if (window.confirm('Are you sure you want to reject this user? Their account will be deleted.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_BASE_URL}/api/admin/reject-user/${id}`, config);
                toast.success('User rejected and deleted');
                fetchPendingItems();
            } catch (error) {
                toast.error('Error rejecting user');
            }
        }
    };

    const handleApproveHackathon = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.put(`${API_BASE_URL}/api/hackathons/${id}/approve`, {}, config);
            toast.success('Hackathon approved successfully!');
            fetchPendingItems();
        } catch (error) {
            toast.error('Error approving hackathon');
        }
    };

    const handleRejectHackathon = async (id) => {
        if (window.confirm('Are you sure you want to reject this hackathon? This action cannot be undone.')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                await axios.delete(`${API_BASE_URL}/api/hackathons/${id}/reject`, config);
                toast.success('Hackathon rejected and deleted');
                fetchPendingItems();
            } catch (error) {
                toast.error('Error rejecting hackathon');
            }
        }
    };

    const handleApproveSession = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.put(`${API_BASE_URL}/api/sessions/${id}/approve`, {}, config);
            toast.success('Session approved successfully!');
            fetchPendingItems();
        } catch (error) {
            toast.error('Error approving session');
        }
    };

    const handleRejectSession = async (id) => {
        if (window.confirm('Are you sure you want to reject this session? This action cannot be undone.')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                await axios.delete(`${API_BASE_URL}/api/sessions/${id}/reject`, config);
                toast.success('Session rejected and deleted');
                fetchPendingItems();
            } catch (error) {
                toast.error('Error rejecting session');
            }
        }
    };

    if (!user || user.userType !== 'admin') {
        return (
            <div className="text-center mt-20">
                <div className="glass-panel p-8 border-red-500/30 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
                    <p className="text-gray-400">Only admins can access this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center mt-20 text-neon-purple">Loading pending approvals...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-display font-bold">Pending Approvals</h1>
                <div className="flex gap-4">
                    <div className="glass-panel px-4 py-2">
                        <span className="text-neon-purple font-bold">{pendingHackathons.length}</span>
                        <span className="text-gray-400 ml-2">Hackathons</span>
                    </div>
                    <div className="glass-panel px-4 py-2">
                        <span className="text-neon-pink font-bold">{pendingSessions.length}</span>
                        <span className="text-gray-400 ml-2">Sessions</span>
                    </div>
                    <div className="glass-panel px-4 py-2">
                        <span className="text-neon-green font-bold">{pendingUsers.length}</span>
                        <span className="text-gray-400 ml-2">Users</span>
                    </div>
                </div>
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
                    Hackathons ({pendingHackathons.length})
                </button>
                <button
                    onClick={() => setActiveTab('sessions')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'sessions'
                        ? 'text-neon-pink border-b-2 border-neon-pink'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Sessions ({pendingSessions.length})
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'users'
                        ? 'text-neon-green border-b-2 border-neon-green'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Users ({pendingUsers.length})
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-6">
                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-20 glass-panel">
                            <p className="text-gray-400">No pending user requests</p>
                        </div>
                    ) : (
                        pendingUsers.map((pUser) => (
                            <div key={pUser._id} className="glass-panel p-6 border-neon-green/30">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full border-2 border-neon-green p-0.5">
                                        <img
                                            src={pUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pUser.name)}&size=128&background=39ff14&color=000&bold=true`}
                                            alt={pUser.name}
                                            className="w-full h-full object-cover rounded-full"
                                            onError={(e) => {
                                                e.target.src = 'https://ui-avatars.com/api/?name=User&size=128&background=39ff14&color=000&bold=true';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold">{pUser.name}</h3>
                                        <p className="text-gray-400">{pUser.email}</p>
                                        <div className="flex gap-2 mt-2">
                                            {pUser.role === 'mentor' && (
                                                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-400 border border-purple-500/30 flex items-center gap-1">
                                                    👨‍🏫 Mentor Account
                                                </span>
                                            )}
                                            {pUser.role === 'organization' && (
                                                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-400 border border-blue-500/30 flex items-center gap-1">
                                                    🏢 Organization Account
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApproveUser(pUser._id)}
                                            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-6 py-2 rounded-lg font-bold transition-all"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectUser(pUser._id)}
                                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg font-bold transition-all"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Hackathons Tab */}
            {activeTab === 'hackathons' && (
                <div className="space-y-6">
                    {pendingHackathons.length === 0 ? (
                        <div className="text-center py-20 glass-panel">
                            <p className="text-gray-400">No pending hackathons to review</p>
                        </div>
                    ) : (
                        pendingHackathons.map((hackathon) => (
                            <div key={hackathon._id} className="glass-panel p-6 border-neon-purple/30">
                                <div className="flex gap-6">
                                    <img
                                        src={hackathon.banner}
                                        alt={hackathon.title}
                                        className="w-48 h-32 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-2">{hackathon.title}</h3>
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
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-neon-purple" />
                                                <span>By: {hackathon.createdBy?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => handleApproveHackathon(hackathon._id)}
                                            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectHackathon(hackathon._id)}
                                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                        >
                                            <XCircle size={18} />
                                            Reject
                                        </button>
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
                    {pendingSessions.length === 0 ? (
                        <div className="text-center py-20 glass-panel">
                            <p className="text-gray-400">No pending sessions to review</p>
                        </div>
                    ) : (
                        pendingSessions.map((session) => (
                            <div key={session._id} className="glass-panel p-6 border-neon-pink/30">
                                <div className="flex gap-6">
                                    <img
                                        src={session.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                                        alt={session.title}
                                        className="w-48 h-32 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-2">{session.title}</h3>
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
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-neon-pink" />
                                                <span>By: {session.createdBy?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => handleApproveSession(session._id)}
                                            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectSession(session._id)}
                                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                        >
                                            <XCircle size={18} />
                                            Reject
                                        </button>
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

export default AdminApprovals;
