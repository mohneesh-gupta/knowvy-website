import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    };

    const signup = async (name, email, password, userType, phone, college, bio, skills, avatar, ...otherFields) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('http://localhost:5000/api/auth/signup', {
            name,
            email,
            password,
            userType, // Changed from 'role' to 'userType'
            phone,
            college,
            bio,
            skills,
            avatar,
            ...otherFields
        }, config);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
