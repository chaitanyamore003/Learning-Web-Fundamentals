// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // brief flash while /me resolves
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
