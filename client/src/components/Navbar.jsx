import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationDropdown = ({ notifications, onMarkRead }) => {
    if (notifications.length === 0) {
        return (
            <div className="absolute right-0 top-12 w-80 bg-dark-card border border-white/10 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <p className="text-gray-400 text-center text-sm">No new notifications</p>
            </div>
        );
    }

    return (
        <div className="absolute right-0 top-12 w-80 bg-dark-card border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/40">
                <h4 className="text-sm font-bold text-white">Notifications</h4>
                <button onClick={() => onMarkRead('all')} className="text-xs text-neon-blue hover:underline">Mark all read</button>
            </div>
            {notifications.map((notif) => (
                <div
                    key={notif._id}
                    onClick={() => onMarkRead(notif._id, notif.link)}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-white/[0.02]' : ''}`}
                >
                    <div className="flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.6)]' : 'bg-transparent'}`} />
                        <div>
                            <h5 className={`text-sm mb-1 ${!notif.read ? 'font-bold text-white' : 'font-medium text-gray-400'}`}>{notif.title}</h5>
                            <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-gray-600 mt-2 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Poll for notifications every 30 seconds
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/notifications', config);
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            } catch (error) {
                console.error("Failed to fetch notifications");
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifs && !event.target.closest('.notification-container')) {
                setShowNotifs(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showNotifs]);

    const handleMarkRead = async (id, link) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            if (id === 'all') {
                await axios.put('http://localhost:5000/api/notifications/read-all', {}, config);
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
                toast.success('All marked as read');
            } else {
                await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, config);
                setNotifications(prev => prev.map(n => n._id === id ? ({ ...n, read: true }) : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
                if (link) navigate(link);
            }
        } catch (error) {
            console.error("Error marking read");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel sticky top-4 z-50 px-6 py-4 mx-4 mb-8 flex justify-between items-center bg-dark-card/80 backdrop-blur-xl border-b border-white/10">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold font-display tracking-tighter bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent hover:scale-105 transition-transform">
                KNOWVY.
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <Link to="/voice-interview" className="hover:text-neon-green transition-colors">voice</Link>
                <Link to="/chat" className="hover:text-neon-green transition-colors">Chat</Link>
                <Link to="/" className="hover:text-neon-green transition-colors">Home</Link>
                <Link to="/hackathons" className="hover:text-neon-blue transition-colors">Hackathons</Link>
                <Link to="/sessions" className="hover:text-neon-pink transition-colors">Sessions</Link>
                <Link to="/mentorship" className="hover:text-neon-purple transition-colors">Mentorship</Link>

                {user ? (
                    <div className="flex items-center gap-4 ml-4">
                        {/* My Events link for organizations, mentors, and admins */}
                        {(user.userType === 'organization' || user.userType === 'mentor' || user.userType === 'admin') && (
                            <Link to="/my-events" className="text-neon-purple hover:underline">My Events</Link>
                        )}

                        {/* Mentorship Requests for Mentors */}
                        {user.userType === 'mentor' && (
                            <Link to="/mentorship/requests" className="text-neon-pink hover:underline">Requests</Link>
                        )}

                        {/* My Requests for Students */}
                        {user.userType === 'student' && (
                            <Link to="/mentorship/my-requests" className="text-neon-green hover:underline">My Requests</Link>
                        )}

                        {/* Admin Approvals link */}
                        {user.userType === 'admin' && (
                            <Link to="/admin/approvals" className="text-neon-pink hover:underline">Approvals</Link>
                        )}

                        {/* Notifications */}
                        <div className="relative notification-container">
                            <button
                                onClick={() => setShowNotifs(!showNotifs)}
                                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-dark-card">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {showNotifs && (
                                <NotificationDropdown
                                    notifications={notifications}
                                    onMarkRead={handleMarkRead}
                                />
                            )}
                        </div>

                        <Link to="/profile" className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all">
                            <img src={user?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="avatar" className="w-6 h-6 rounded-full border border-neon-purple" />
                            <span className="text-white font-bold">{user?.name?.split(' ')[0] || 'User'}</span>
                        </Link>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 ml-4">
                        <Link to="/login" className="hover:text-white">Login</Link>
                        <Link to="/signup" className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-neon-green transition-colors hover:shadow-[0_0_15px_rgba(57,255,20,0.5)]">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-5">
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-lg hover:text-neon-green">Home</Link>
                    <Link to="/hackathons" onClick={() => setIsOpen(false)} className="text-lg hover:text-neon-blue">Hackathons</Link>
                    <Link to="/sessions" onClick={() => setIsOpen(false)} className="text-lg hover:text-neon-pink">Sessions</Link>
                    <Link to="/mentorship" onClick={() => setIsOpen(false)} className="text-lg hover:text-neon-purple">Mentorship</Link>
                    <hr className="border-white/10" />
                    {user ? (
                        <>
                            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg">
                                <User size={20} className="text-neon-purple" /> My Profile
                            </Link>
                            <button onClick={handleLogout} className="text-left text-red-500 text-lg">Logout</button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-2 border border-white/20 rounded-lg">Login</Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)} className="text-center py-2 bg-neon-green text-black font-bold rounded-lg">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
