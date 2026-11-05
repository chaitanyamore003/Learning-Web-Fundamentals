import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Link } from "react-router-dom";
import api from "../services/api";

const Leaderboard = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPremiumRequired, setIsPremiumRequired] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await api.get("premium/getLeaderboard");

        if (response.data.success) {
          setLeaderboard(response.data.leaderboard || []);
        }
      } catch (err) {
        console.error("Leaderboard Error:", err);

        // Catch the 403 Forbidden error from your backend
        if (err.response?.status === 403) {
          setIsPremiumRequired(true);
        } else {
          setError(
            err.response?.data?.message || "Failed to load leaderboard.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper to get initials for the avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return `₹ ${(amount || 0).toLocaleString("en-IN")}`;
  };

  // Helper to render rank badges (Gold, Silver, Bronze)
  const getRankStyle = (rank) => {
    if (rank === 1)
      return "bg-yellow-400 text-[#191A23] border-[#191A23] shadow-[2px_2px_0_0_#191A23]";
    if (rank === 2)
      return "bg-gray-300 text-[#191A23] border-[#191A23] shadow-[2px_2px_0_0_#191A23]";
    if (rank === 3)
      return "bg-amber-600 text-white border-[#191A23] shadow-[2px_2px_0_0_#191A23]";
    return `border-transparent ${isDarkMode ? "text-gray-400" : "text-gray-500"}`;
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#B9FF66] selection:text-[#191A23] ${isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"}`}
    >
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-8 lg:px-16">
        {/* ================= HEADER ================= */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Spending Leaderboard
          </h1>
          <p
            className={`mt-3 text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            See how your spending discipline compares to others.
          </p>
        </div>

        {/* ================= LOADING STATE ================= */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            <svg
              className="h-10 w-10 animate-spin text-[#B9FF66]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* ================= PREMIUM REQUIRED STATE ================= */}
        {!loading && isPremiumRequired && (
          <div
            className={`flex flex-col items-center justify-center rounded-[35px] border-2 border-dashed p-12 text-center ${
              isDarkMode
                ? "border-[#B9FF66] bg-[#292A32]"
                : "border-[#191A23] bg-[#F3F3F3]"
            }`}
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#B9FF66]/20 text-4xl">
              🔒
            </div>
            <h2 className="text-3xl font-extrabold mb-3">Premium Feature</h2>
            <p
              className={`max-w-md text-sm mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              The leaderboard is exclusively available to Premium members.
              Upgrade your account to see where you rank!
            </p>
            <Link
              to="/premium"
              className={`flex items-center gap-2 rounded-xl border-2 px-8 py-4 text-base font-bold transition-all hover:-translate-y-1 ${
                isDarkMode
                  ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23]"
                  : "border-[#191A23] bg-[#191A23] text-white"
              }`}
            >
              Upgrade to Premium
            </Link>
          </div>
        )}

        {/* ================= GENERAL ERROR STATE ================= */}
        {!loading && error && (
          <div className="rounded-xl border-2 border-red-600 bg-red-50 p-4 text-center text-sm font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ================= UNIFIED LEADERBOARD LIST ================= */}
        {!loading && !error && !isPremiumRequired && leaderboard.length > 0 && (
          <div
            className={`overflow-hidden rounded-[35px] border-2 ${
              isDarkMode
                ? "border-gray-700 bg-[#292A32] shadow-[6px_6px_0_0_#000]"
                : "border-[#191A23] bg-white shadow-[6px_6px_0_0_#191A23]"
            }`}
          >
            <div
              className={`flex flex-col divide-y-2 ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}
            >
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = player.id === user?.id;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 sm:px-6 transition-colors ${
                      isCurrentUser
                        ? "bg-[#B9FF66] text-[#191A23]"
                        : isDarkMode
                          ? "hover:bg-[#1f222b]"
                          : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Left Side: Rank, Avatar, Name */}
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      {/* Rank Badge */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 text-sm font-black ${getRankStyle(rank)}`}
                      >
                        {rank}
                      </div>

                      {/* Avatar */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold ${
                          isCurrentUser
                            ? "border-[#191A23] bg-white text-[#191A23]"
                            : "border-gray-300 bg-gray-100 text-[#191A23] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        }`}
                      >
                        {getInitials(player.name)}
                      </div>

                      {/* Name */}
                      <div className="truncate">
                        <p
                          className={`text-base font-bold truncate ${isCurrentUser ? "text-[#191A23]" : ""}`}
                        >
                          {isCurrentUser ? "You" : player.name}
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Amount */}
                    <div className="text-right pl-4 shrink-0">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-widest ${isCurrentUser ? "text-[#191A23]/70" : "text-gray-400"}`}
                      >
                        Spent
                      </p>
                      <span className="text-base font-black tracking-tight sm:text-lg">
                        {formatCurrency(player.totalExpense)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading &&
          !error &&
          !isPremiumRequired &&
          leaderboard.length === 0 && (
            <div
              className={`flex flex-col items-center justify-center rounded-[35px] border-2 border-dashed p-12 text-center ${
                isDarkMode
                  ? "border-gray-600 bg-[#292A32]"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B9FF66]/20 text-3xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold mb-2">No rankings yet</h3>
              <p
                className={`max-w-md text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                There isn't enough data to generate a leaderboard right now.
              </p>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
