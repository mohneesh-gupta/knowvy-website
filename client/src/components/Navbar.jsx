import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

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

                        {/* Admin Approvals link */}
                        {user.userType === 'admin' && (
                            <Link to="/admin/approvals" className="text-neon-pink hover:underline">Approvals</Link>
                        )}

                        <Link to="/profile" className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all">
                            <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full border border-neon-purple" />
                            <span className="text-white font-bold">{user.name.split(' ')[0]}</span>
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
