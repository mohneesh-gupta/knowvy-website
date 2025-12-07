import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, AlertTriangle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="glass-panel p-8 border-neon-blue/30 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                <h2 className="text-3xl font-display font-bold text-center mb-8">Welcome Back</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertTriangle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-blue transition-colors text-white"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-blue transition-colors text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all mt-2">
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-6">
                    Don't have an account? <Link to="/signup" className="text-neon-green hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
