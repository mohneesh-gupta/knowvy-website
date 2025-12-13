import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

/**
 * 🔐 Auth Provider
 * Handles login, signup, logout & auto session expiry
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  /**
   * Decode JWT expiry timestamp
   */
  const getTokenExpiry = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  };

  /**
   * Logout user completely
   */
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  };

  /**
   * Setup automatic logout based on JWT expiry
   */
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

  /**
   * Restore session on page refresh
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.token) {
        setupAutoLogout(parsedUser.token);
      }
    }

    setLoading(false);
  }, []);

  /**
   * Login
   */
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setupAutoLogout(data.token);
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  /**
   * Signup
   */
const signup = async (
  name,
  email,
  password,
  userType,
  phone,
  college,
  bio,
  skills,
  avatar,
  ...otherFields
) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/auth/signup",
      {
        name,
        email,
        password,
        userType,
        phone,
        college,
        bio,
        skills,
        avatar,
        ...otherFields,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setupAutoLogout(data.token);
  } catch (error) {
    // 🔴 THIS LINE IS IMPORTANT
    throw error.response?.data?.message || "Signup failed";
  }
};


  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
