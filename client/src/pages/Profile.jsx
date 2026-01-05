import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Phone, BookOpen, Award, Briefcase } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div className="text-center mt-20 text-neon-pink">Please log in to view your profile.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="glass-panel p-8 flex flex-col md:flex-row items-center gap-8 border-neon-purple/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

                <div className="w-32 h-32 rounded-full border-4 border-neon-purple p-1 shrink-0">
                    <img
                        src={user.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>

                <div className="text-center md:text-left spa    ce-y-2 flex-grow">
                    <h1 className="text-4xl font-display font-bold text-white">{user.name}</h1>
                    <p className="text-neon-purple font-medium text-lg capitalize">{user.userType}</p>
                    <p className="text-gray-400 max-w-lg">{user.bio || "No bio added yet. Tell us about yourself!"}</p>
                </div>

                <div className="flex gap-4">
                    <Link to="/profile/edit" className="bg-white/10 hover:bg-neon-purple hover:text-white transition-all px-6 py-2 rounded-lg font-bold border border-white/10">
                        Edit Profile
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="glass-panel p-8 space-y-6">
                    <h2 className="text-2xl font-bold font-display text-neon-blue mb-4">Personal Info</h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-blue">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-blue">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                                <p className="font-medium">{user.phone || "Not provided"}</p>
                            </div>
                        </div>

                        {/* Role Based Info */}
                        {user.college && (
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-blue">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">College</p>
                                    <p className="font-medium">{user.college}</p>
                                </div>
                            </div>
                        )}

                        {user.userType === 'organization' && (
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-blue">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Organization</p>
                                    <p className="font-medium">{user.orgName}</p>
                                    <p className="text-sm text-gray-400">{user.location}</p>
                                </div>
                            </div>
                        )}

                        {user.userType === 'mentor' && (
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-blue">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Occupation</p>
                                    <p className="font-medium">{user.occupation}</p>
                                    <p className="text-sm text-gray-400">{user.specialtyField} • {user.experienceYears} Years Exp</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills & Stats */}
                {!['admin'].includes(user.userType) && (
                    <div className="glass-panel p-8 space-y-6">
                        <h2 className="text-2xl font-bold font-display text-neon-green mb-4">Skills & Interests</h2>

                        {/* Hide Tech Stack for Organizations and Admins */}
                        {!['organization', 'admin'].includes(user.userType) && (
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Tech Stack</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-full text-sm font-bold">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">No skills listed yet</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                            {user.userType === 'student' && (
                                <>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">0</div>
                                        <div className="text-xs text-gray-400">Hackathons Won</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Briefcase className="w-8 h-8 text-neon-pink mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">0</div>
                                        <div className="text-xs text-gray-400">Projects</div>
                                    </div>
                                </>
                            )}

                            {user.userType === 'organization' && (
                                <>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Briefcase className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">0</div>
                                        <div className="text-xs text-gray-400">Events Hosted</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <User className="w-8 h-8 text-neon-green mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">0</div>
                                        <div className="text-xs text-gray-400">Followers</div>
                                    </div>
                                </>
                            )}

                            {user.userType === 'mentor' && (
                                <>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <BookOpen className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">{user.totalSessions || 0}</div>
                                        <div className="text-xs text-gray-400">Sessions</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">{user.rating || 0}</div>
                                        <div className="text-xs text-gray-400">Rating</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* History Section - Placeholder for now, to be populated dynamically later */}
            <div className="glass-panel p-8 space-y-6">
                <h2 className="text-2xl font-bold font-display text-white mb-4">Activity History</h2>
                {user.eventsJoined && user.eventsJoined.length > 0 ? (
                    <div className="space-y-4">
                        {user.eventsJoined.map((event, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-neon-purple/50 transition-all">
                                <div>
                                    <h4 className="font-bold text-white mb-1">{event.title || 'Event Name'}</h4>
                                    <p className="text-xs text-gray-400">Joined on {new Date().toLocaleDateString()}</p>
                                </div>
                                <Link to={`/hackathons/${event._id}`} className="text-sm text-neon-purple hover:underline">View</Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 italic">
                        No activity history yet. Join hackathons or sessions to see them here!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
