import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const MentorRequests = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
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

    const handleAccept = async (requestId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            await axios.put(`${API_BASE_URL}/api/mentorship/${requestId}`, {
                status: 'accepted'
            }, config);

            toast.success('Request accepted! You can now chat with the student.');
            fetchRequests();
        } catch (error) {
            toast.error('Failed to accept request');
        }
    };

    const handleReject = async (requestId) => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                await axios.put(`${API_BASE_URL}/api/mentorship/${requestId}`, {
                    status: 'rejected',
                    notes: 'Request declined by mentor'
                }, config);

                toast.success('Request rejected');
                fetchRequests();
            } catch (error) {
                toast.error('Failed to reject request');
            }
        }
    };

    const handleComplete = async (requestId) => {
        if (window.confirm('Mark this mentorship session as completed?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                await axios.put(`${API_BASE_URL}/api/mentorship/${requestId}`, {
                    status: 'completed'
                }, config);

                toast.success('Session marked as completed');
                fetchRequests();
            } catch (error) {
                toast.error('Failed to update status');
            }
        }
    };

    if (!user || user.userType !== 'mentor') {
        return (
            <div className="text-center mt-20">
                <div className="glass-panel p-8 border-red-500/30 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
                    <p className="text-gray-400">Only mentors can access this page.</p>
                    <Link to="/mentorship" className="mt-6 inline-block bg-neon-purple text-white px-6 py-2 rounded-lg">
                        Back to Mentorship
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center mt-20 text-neon-purple">Loading requests...</div>;
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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-display font-bold">My Mentorship Requests</h1>
                <div className="flex gap-4">
                    <div className="glass-panel px-4 py-2">
                        <span className="text-yellow-400 font-bold">{pendingRequests.length}</span>
                        <span className="text-gray-400 ml-2">Pending</span>
                    </div>
                    <div className="glass-panel px-4 py-2">
                        <span className="text-green-400 font-bold">{acceptedRequests.length}</span>
                        <span className="text-gray-400 ml-2">Active</span>
                    </div>
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
                    </div>
                ) : (
                    getRequestsByTab().map((request) => (
                        <div key={request._id} className="glass-panel p-6 border-neon-purple/30">
                            <div className="flex gap-6">
                                <img
                                    src={request.student?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                    alt={request.student?.name}
                                    className="w-16 h-16 rounded-full border-2 border-neon-purple object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold">{request.student?.name}</h3>
                                            <p className="text-gray-400 text-sm">{request.student?.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {request.type === 'call' ? (
                                                <Video size={20} className="text-neon-blue" />
                                            ) : (
                                                <MessageSquare size={20} className="text-neon-pink" />
                                            )}
                                            <span className="text-sm text-gray-400 capitalize">{request.type}</span>
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
                                                {new Date(request.preferredDate).toLocaleDateString()}
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
                                            Requested {new Date(request.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {request.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAccept(request._id)}
                                                    className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                                >
                                                    <CheckCircle size={18} />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request._id)}
                                                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                                >
                                                    <XCircle size={18} />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {request.status === 'accepted' && (
                                            <>
                                                <Link
                                                    to={`/mentorship/chat/${request._id}`}
                                                    className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 text-neon-purple px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                                >
                                                    <MessageSquare size={18} />
                                                    Open Chat
                                                </Link>
                                                <button
                                                    onClick={() => handleComplete(request._id)}
                                                    className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-6 py-2 rounded-lg font-bold transition-all"
                                                >
                                                    Mark Complete
                                                </button>
                                            </>
                                        )}
                                        {request.status === 'completed' && (
                                            <span className="text-green-400 flex items-center gap-2">
                                                <CheckCircle size={18} />
                                                Session Completed
                                            </span>
                                        )}
                                        {request.status === 'rejected' && (
                                            <span className="text-red-400 flex items-center gap-2">
                                                <XCircle size={18} />
                                                Request Rejected
                                            </span>
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

export default MentorRequests;
