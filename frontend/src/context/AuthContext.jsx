import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Load user data from localStorage instead of validating token
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      setUser(userData);
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser({
          id: data.userId,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: data.fullName,
          roles: data.roles,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.userId,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: data.fullName,
            roles: data.roles,
          })
        );
        toast.success("Login successful!");
        return true;
      } else {
        toast.error(data.error || "Login failed");
        return false;
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Please login.");
        return true;
      } else {
        toast.error(data.error || "Registration failed");
        return false;
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
