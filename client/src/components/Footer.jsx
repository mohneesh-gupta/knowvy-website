import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md mt-20 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-display tracking-tighter bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                        KNOWVY.
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        The ultimate ecosystem for student developers to build, ship, and grow together.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-white mb-6">Platform</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><a href="/hackathons" className="hover:text-neon-green transition-colors">Hackathons</a></li>
                        <li><a href="/sessions" className="hover:text-neon-blue transition-colors">Sessions</a></li>
                        <li><a href="/mentorship" className="hover:text-neon-pink transition-colors">Mentorship</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-white mb-6">Community</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-neon-green transition-colors">Discord Server</a></li>
                        <li><a href="#" className="hover:text-neon-blue transition-colors">Telegram Group</a></li>
                        <li><a href="#" className="hover:text-neon-pink transition-colors">Campus Chapter</a></li>
                        <li><a href="#" className="hover:text-neon-purple transition-colors">Code of Conduct</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-white mb-6">Connect</h3>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-green hover:text-black transition-all">
                            <Github size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-blue hover:text-black transition-all">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-purple hover:text-black transition-all">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-center items-center gap-2">
                <p>&copy; {new Date().getFullYear()} Knowvy Platform. All rights reserved.</p>
                <div className="hidden md:block w-1 h-1 bg-gray-700 rounded-full"></div>
                <p className="flex items-center gap-1">
                    Made with <Heart size={14} className="text-red-500 fill-current" /> by TechTeam
                </p>
            </div>
        </footer>
    );
};

export default Footer;
