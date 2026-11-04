import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      throw error;
    }
  };

  // Restore authentication when application loads
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          await fetchCurrentUser();
        } catch (error) {
          console.error("Authentication Error:", error);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (credentials) => {
    const response = await api.post("/users/login", credentials);

    const { token } = response.data;

    localStorage.setItem("token", token);

    const user = await fetchCurrentUser();

    return user;
  };

  // Signup
  const signup = async (userData) => {
    const response = await api.post("/users/signup", userData);
    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: Boolean(user),
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthContext;
