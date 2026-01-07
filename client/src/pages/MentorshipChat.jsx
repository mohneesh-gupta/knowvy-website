import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Send, ArrowLeft, User, Video, Phone, CheckCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const MentorshipChat = () => {
    const { requestId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const previousMessageCountRef = useRef(0);
    const isInitialLoadRef = useRef(true);

    useEffect(() => {
        // Wait for user to be loaded before fetching data
        if (!user) return;

        fetchRequest();
        fetchMessages();
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [requestId, user]); // Added user as dependency

    useEffect(() => {
        // Only scroll if:
        // 1. It's the initial load, OR
        // 2. New messages were added (message count increased)
        if (isInitialLoadRef.current || messages.length > previousMessageCountRef.current) {
            scrollToBottom();
            isInitialLoadRef.current = false;
        }
        previousMessageCountRef.current = messages.length;
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchRequest = async () => {
        if (!user) return; // Extra safety check

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${API_BASE_URL}/api/mentorship/my-requests`, config);
            const foundRequest = data.find(r => r._id === requestId);

            if (!foundRequest) {
                toast.error('Request not found');
                navigate('/mentorship');
                return;
            }

            if (foundRequest.status !== 'accepted' && foundRequest.status !== 'completed') {
                toast.error('Chat is only available for accepted requests');
                navigate(user.userType === 'mentor' ? '/mentorship/requests' : '/mentorship/my-requests');
                return;
            }

            setRequest(foundRequest);
        } catch (error) {
            console.error('Error fetching request:', error);
            toast.error('Failed to load request details');
        }
    };

    const fetchMessages = async () => {
        if (!user) return; // Extra safety check

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${API_BASE_URL}/api/chat/${requestId}`, config);
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const { data } = await axios.post(`${API_BASE_URL}/api/chat/${requestId}`, {
                message: newMessage
            }, config);

            setMessages([...messages, data]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center mt-20">
                <div className="glass-panel p-8 border-red-500/30 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Login Required</h2>
                    <p className="text-gray-400">Please login to access chat.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center mt-20 text-neon-purple">Loading chat...</div>;
    }

    if (!request) {
        return <div className="text-center mt-20 text-red-500">Request not found</div>;
    }

    const otherUser = user.userType === 'mentor' ? request.student : request.mentor;

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-200px)] flex flex-col">
            {/* Header */}
            <div className="glass-panel p-4 mb-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link
                        to={user.userType === 'mentor' ? '/mentorship/requests' : '/mentorship/my-requests'}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <img
                        src={otherUser?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                        alt={otherUser?.name}
                        className="w-12 h-12 rounded-full border-2 border-neon-purple"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{otherUser?.name}</h2>
                        <p className="text-sm text-gray-400">{request.subject}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {request.status === 'completed' && (
                        <span className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle size={16} />
                            Completed
                        </span>
                    )}
                    {request.type === 'call' && request.meetingLink && (
                        <a
                            href={request.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 text-neon-blue px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                        >
                            <Video size={18} />
                            Join Call
                        </a>
                    )}
                </div>
            </div>

            {/* Messages Container */}
            <div
                ref={chatContainerRef}
                className="glass-panel flex-1 p-6 overflow-y-auto space-y-4 mb-4"
                style={{ maxHeight: 'calc(100vh - 350px)' }}
            >
                {messages.length === 0 ? (
                    <div className="text-center py-20">
                        <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender._id === user._id;
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <img
                                        src={msg.sender.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                        alt={msg.sender.name}
                                        className="w-8 h-8 rounded-full border border-white/20"
                                    />
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-4 py-3 rounded-2xl ${isMe
                                            ? 'bg-neon-purple/20 border border-neon-purple/50'
                                            : 'bg-white/5 border border-white/10'
                                            }`}>
                                            <p className="text-white">{msg.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {request.status === 'accepted' && (
                <form onSubmit={handleSendMessage} className="glass-panel p-4 flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="bg-neon-purple hover:bg-neon-purple/80 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                        {sending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            )}

            {request.status === 'completed' && (
                <div className="glass-panel p-4 text-center">
                    <p className="text-gray-400">This mentorship session has been completed. Chat is read-only.</p>
                </div>
            )}
        </div>
    );
};

export default MentorshipChat;
