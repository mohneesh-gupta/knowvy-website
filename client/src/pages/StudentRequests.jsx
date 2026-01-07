import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Calendar, Clock, User, MessageSquare, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const StudentRequests = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${API_BASE_URL}/api/mentorship/my-requests`, config);
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load requests');
            setLoading(false);
        }
    };

    if (!user || user.userType !== 'student') {
        return (
            <div className="text-center mt-20">
                <div className="glass-panel p-8 border-red-500/30 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
                    <p className="text-gray-400">Only students can access this page.</p>
                    <Link to="/mentorship" className="mt-6 inline-block bg-neon-purple text-white px-6 py-2 rounded-lg">
                        Back to Mentorship
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center mt-20 text-neon-purple">Loading your requests...</div>;
    }

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const acceptedRequests = requests.filter(r => r.status === 'accepted');
    const completedRequests = requests.filter(r => r.status === 'completed');
    const rejectedRequests = requests.filter(r => r.status === 'rejected');

    const getRequestsByTab = () => {
        switch (activeTab) {
            case 'pending': return pendingRequests;
            case 'accepted': return acceptedRequests;
            case 'completed': return completedRequests;
            case 'rejected': return rejectedRequests;
            default: return [];
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'yellow', icon: AlertCircle, text: 'Pending' },
            accepted: { color: 'green', icon: CheckCircle, text: 'Accepted' },
            rejected: { color: 'red', icon: XCircle, text: 'Rejected' },
            completed: { color: 'blue', icon: CheckCircle, text: 'Completed' }
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-${badge.color}-500/20 border border-${badge.color}-500/50 text-${badge.color}-400`}>
                <Icon size={16} />
                {badge.text}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-display font-bold">My Mentorship Requests</h1>
                <Link
                    to="/mentorship"
                    className="bg-neon-purple text-white px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all"
                >
                    + Request New Mentor
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="glass-panel p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-400">{pendingRequests.length}</div>
                    <div className="text-sm text-gray-400">Pending</div>
                </div>
                <div className="glass-panel p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">{acceptedRequests.length}</div>
                    <div className="text-sm text-gray-400">Active</div>
                </div>
                <div className="glass-panel p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">{completedRequests.length}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="glass-panel p-4 text-center">
                    <div className="text-3xl font-bold text-red-400">{rejectedRequests.length}</div>
                    <div className="text-sm text-gray-400">Rejected</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'pending'
                        ? 'text-yellow-400 border-b-2 border-yellow-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Pending ({pendingRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('accepted')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'accepted'
                        ? 'text-green-400 border-b-2 border-green-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Active ({acceptedRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'completed'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Completed ({completedRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('rejected')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'rejected'
                        ? 'text-red-400 border-b-2 border-red-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Rejected ({rejectedRequests.length})
                </button>
            </div>

            {/* Requests List */}
            <div className="space-y-6">
                {getRequestsByTab().length === 0 ? (
                    <div className="text-center py-20 glass-panel">
                        <p className="text-gray-400">No {activeTab} requests</p>
                        {activeTab === 'pending' && (
                            <Link
                                to="/mentorship"
                                className="mt-4 inline-block text-neon-purple hover:underline"
                            >
                                Find a mentor →
                            </Link>
                        )}
                    </div>
                ) : (
                    getRequestsByTab().map((request) => (
                        <div key={request._id} className="glass-panel p-6 border-neon-purple/30">
                            <div className="flex gap-6">
                                <img
                                    src={request.mentor?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                    alt={request.mentor?.name}
                                    className="w-16 h-16 rounded-full border-2 border-neon-purple object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold">{request.mentor?.name}</h3>
                                            <p className="text-gray-400 text-sm">{request.mentor?.occupation || 'Mentor'}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(request.status)}
                                            <div className="flex items-center gap-2">
                                                {request.type === 'call' ? (
                                                    <Video size={20} className="text-neon-blue" />
                                                ) : (
                                                    <MessageSquare size={20} className="text-neon-pink" />
                                                )}
                                                <span className="text-sm text-gray-400 capitalize">{request.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-bold text-neon-purple mb-2">{request.subject}</h4>
                                        <p className="text-gray-300">{request.message}</p>
                                    </div>

                                    <div className="flex gap-6 text-sm text-gray-400 mb-4">
                                        {request.preferredDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-neon-green" />
                                                Preferred: {new Date(request.preferredDate).toLocaleDateString()}
                                            </div>
                                        )}
                                        {request.preferredTime && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-neon-blue" />
                                                {request.preferredTime}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-neon-pink" />
                                            Sent {new Date(request.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Scheduled Info for Accepted Requests */}
                                    {request.status === 'accepted' && request.scheduledDate && (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                                            <h5 className="text-green-400 font-bold mb-2">✅ Session Scheduled</h5>
                                            <div className="flex gap-4 text-sm">
                                                <span>📅 {new Date(request.scheduledDate).toLocaleDateString()}</span>
                                                <span>🕐 {request.scheduledTime}</span>
                                                {request.meetingLink && (
                                                    <a href={request.meetingLink} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
                                                        🔗 Meeting Link
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejection Note */}
                                    {request.status === 'rejected' && request.notes && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                                            <h5 className="text-red-400 font-bold mb-2">Mentor's Note:</h5>
                                            <p className="text-sm text-gray-300">{request.notes}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {request.status === 'pending' && (
                                            <span className="text-yellow-400 text-sm">⏳ Waiting for mentor response...</span>
                                        )}
                                        {request.status === 'accepted' && (
                                            <Link
                                                to={`/mentorship/chat/${request._id}`}
                                                className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 text-neon-purple px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                            >
                                                <MessageSquare size={18} />
                                                Open Chat
                                            </Link>
                                        )}
                                        {request.status === 'completed' && (
                                            <Link
                                                to={`/mentorship/chat/${request._id}`}
                                                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-6 py-2 rounded-lg font-bold transition-all"
                                            >
                                                View Conversation
                                            </Link>
                                        )}
                                        {request.status === 'rejected' && (
                                            <Link
                                                to="/mentorship"
                                                className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 text-neon-purple px-4 py-2 rounded-lg font-bold transition-all text-sm"
                                            >
                                                Find Another Mentor
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentRequests;
