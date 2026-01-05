import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => { },
  signup: async () => { },
  logout: () => { },
  fetchProfile: async () => { },
});

const API_BASE = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const getTokenExpiry = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  };

  const setupAutoLogout = (token) => {
    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) return;
    const remainingTime = expiryTime - Date.now();
    if (remainingTime <= 0) {
      logout();
      return;
    }
    logoutTimerRef.current = setTimeout(() => {
      logout();
      window.location.href = "/login";
    }, remainingTime);
  };

  const fetchProfile = async (token) => {
    if (!token) return null;
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data } = await axios.get(`${API_BASE}/api/profile`);

      const { _id: profileId, ...profileData } = data.profile || {};
      const userData = {
        ...data.user,
        ...profileData,
        userType: data.user.role || data.user.userType, // Double safety
        token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setupAutoLogout(token);
      return userData;
    } catch (error) {
      console.error("Error fetching profile:", error);
      logout();
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");

      if (tokenFromUrl) {
        window.history.replaceState({}, document.title, window.location.pathname);
        await fetchProfile(tokenFromUrl);
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
          setupAutoLogout(parsedUser.token);
          // Refresh in background to get latest profile data
          fetchProfile(parsedUser.token).catch(() => { });
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      await fetchProfile(data.token);
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const signup = async (name, email, password, role, phone, college, bio, skills, avatar, ...otherFields) => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/signup`, {
        name, email, password, role, phone, college, bio, skills, avatar,
        ...Object.assign({}, ...otherFields),
      });
      await fetchProfile(data.token);
    } catch (error) {
      throw error.response?.data?.message || "Signup failed";
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
