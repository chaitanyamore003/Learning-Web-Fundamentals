import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthLayout from "./layouts/authLayout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Leaderboard from "./pages/Leaderboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Premium from "./pages/Premium";
import Report from "./pages/Report";

import ProtectedRoute from "./components/auth/ProtectedRoutes";
import PublicRoute from "./components/auth/PublicRoutes";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* Protected routes (User must be logged in) */}
      <Route element={<ProtectedRoute />}>
        {/* ✅ Added leading slashes for absolute paths */}
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/expenses" element={<Expenses />} />
        <Route path="/user/leaderboard" element={<Leaderboard />} />
        <Route path="/user/premium" element={<Premium />} />
        <Route path="/user/report" element={<Report />} />
      </Route>
    </Routes>
  );
}

export default App;
