import { Link } from 'react-router-dom';
import { ArrowRight, Code, Calendar, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="flex flex-col gap-20">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center text-center pt-20 pb-10 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block px-4 py-1.5 rounded-full border border-neon-purple/50 bg-neon-purple/10 text-neon-purple text-sm font-bold tracking-wide mb-4"
                >
                    🚀 THE ULTIMATE STUDENT COMMUNITY
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-display font-black leading-[1.1] tracking-tight">
                    Ignite Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple">Tech Journey</span>.
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                    Join the fastest-growing community for hackathons, workshops, and peer mentorship. Build, learn, and grow with thousands of student developers.
                </p>

                <div className="flex gap-4 mt-8">
                    <Link to="/hackathons" className="neon-button neon-button-primary flex items-center gap-2">
                        Explore Hackathons <ArrowRight size={18} />
                    </Link>
                    <Link to="/signup" className="neon-button neon-button-secondary">
                        Join Community
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 flex flex-col gap-4 hover:border-neon-green/50 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green group-hover:scale-110 transition-transform">
                        <Code size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">Hackathons</h3>
                    <p className="text-gray-400">Discover and participate in top-tier coding battles globally. Win prizes and earn glory.</p>
                </div>
                <div className="glass-panel p-8 flex flex-col gap-4 hover:border-neon-blue/50 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">Live Sessions</h3>
                    <p className="text-gray-400">Attend workshops and seminars from industry experts and senior students.</p>
                </div>
                <div className="glass-panel p-8 flex flex-col gap-4 hover:border-neon-pink/50 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-neon-pink/10 flex items-center justify-center text-neon-pink group-hover:scale-110 transition-transform">
                        <Users size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">Mentorship</h3>
                    <p className="text-gray-400">Connect with mentors who can guide you through your career and projects.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
