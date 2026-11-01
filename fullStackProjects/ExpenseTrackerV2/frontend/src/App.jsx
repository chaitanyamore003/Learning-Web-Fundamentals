import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthLayout from "./layouts/authLayout"; // Ensure casing matches your file name

import ProtectedRoute from "./components/auth/ProtectedRoutes";
import PublicRoute from "./components/auth/PublicRoutes";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      <Route element={<PublicRoute />}>
        {/* Notice how AuthLayout is the parent, and Login/Signup are children */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>

      {/* Protected routes */}
      {/* <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route> */}
    </Routes>
  );
}

export default App;
