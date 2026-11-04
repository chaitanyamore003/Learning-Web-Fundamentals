import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Link } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isPremium = user?.premiumStatus || false;

  // Fetch dynamic expenses from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Replace with your actual endpoint for fetching expenses
        // Assuming it returns an array of objects matching the Expenses model
        const response = await api.get("/expenses?limit=5");
        setRecentExpenses(response.data.expenses || response.data || []);
      } catch (err) {
        console.error("Dashboard Error:", err);
        // If the backend route doesn't exist yet, we catch the error
        // so the dashboard doesn't crash, and default to empty state
        setRecentExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center font-sans ${isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"}`}
      >
        <div className="flex flex-col items-center gap-4">
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
          <p className="font-bold text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#B9FF66] selection:text-[#191A23] ${isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"}`}
    >
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-16">
        {/* ================= PREMIUM UPGRADE BANNER ================= */}
        {!isPremium && (
          <div
            className={`mb-10 flex flex-col items-start justify-between gap-6 rounded-[25px] border-2 p-6 sm:flex-row sm:items-center sm:p-8 ${
              isDarkMode
                ? "border-[#B9FF66] bg-[#292A32] shadow-[6px_6px_0_0_#B9FF66]"
                : "border-[#191A23] bg-[#B9FF66] shadow-[6px_6px_0_0_#191A23]"
            }`}
          >
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                Upgrade to Premium
              </h3>
              <p
                className={`mt-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-[#191A23]/80"}`}
              >
                Unlock detailed reports, full expense history, and the live
                spending leaderboard.
              </p>
            </div>
            <Link
              to="/user/premium"
              className={`flex shrink-0 items-center gap-2 rounded-xl border-2 px-6 py-3 text-sm font-bold transition-all hover:-translate-y-1 ${
                isDarkMode
                  ? "border-[#191A23] bg-[#B9FF66] text-[#191A23] hover:bg-white"
                  : "border-[#191A23] bg-[#191A23] text-white hover:bg-white hover:text-[#191A23]"
              }`}
            >
              Upgrade Now
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Welcome back, <br className="sm:hidden" />
              <div className="flex items-center gap-3 mt-1">
                <span className="bg-[#B9FF66] px-3 inline-block rounded-lg text-[#191A23]">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
                {isPremium && (
                  <span className="text-sm font-black uppercase tracking-widest bg-[#191A23] text-[#B9FF66] px-3 py-1 rounded-full border-2 border-[#B9FF66]">
                    Pro
                  </span>
                )}
              </div>
            </h1>
            <p
              className={`mt-2 text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Here's a summary of your expenses.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Generate Report Button (Premium Only) */}
            {isPremium && (
              <button
                className={`cursor-pointer flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-3.5 text-base font-bold transition-all hover:-translate-y-1 ${
                  isDarkMode
                    ? "border-gray-600 bg-[#292A32] text-white hover:border-[#B9FF66]"
                    : "border-gray-300 bg-white text-[#191A23] hover:border-[#191A23]"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Report
              </button>
            )}

            {/* Add Expense Button */}
            <Link
              to="/user/expenses"
              className={`flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-3.5 text-base font-bold transition-all hover:-translate-y-1 ${
                isDarkMode
                  ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#ffffff]"
                  : "border-[#191A23] bg-[#191A23] text-white shadow-[4px_4px_0_0_#B9FF66]"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Expense
            </Link>
          </div>
        </div>

        {/* ================= STATS CARDS (Strictly Total Expense) ================= */}
        <div className="grid gap-6 md:grid-cols-3">
          <div
            className={`md:col-span-2 rounded-[35px] border-2 p-6 sm:p-8 transition-all ${
              isDarkMode
                ? "border-[#191A23] bg-[#B9FF66] text-[#191A23] shadow-[6px_6px_0_0_#B9FF66]"
                : "border-[#191A23] bg-[#B9FF66] text-[#191A23] shadow-[6px_6px_0_0_#191A23]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#191A23] bg-white/50 text-3xl">
                💸
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold uppercase tracking-wider text-[#191A23]/70">
                Total Expenses
              </p>
              <h3 className="mt-1 text-5xl font-extrabold tracking-tight">
                ₹ {user?.totalExpense?.toLocaleString("en-IN") || "0"}
              </h3>
            </div>
          </div>
        </div>

        {/* ================= RECENT TRANSACTIONS (Dynamic) ================= */}
        <div className="mt-8">
          <div
            className={`rounded-[35px] border-2 p-6 sm:p-8 ${
              isDarkMode
                ? "border-gray-700 bg-[#292A32] shadow-[6px_6px_0_0_#000]"
                : "border-[#191A23] bg-white shadow-[6px_6px_0_0_#191A23]"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Expenses</h3>
              <Link
                to="/user/expenses"
                className="text-sm font-bold underline decoration-2 underline-offset-4 hover:text-[#B9FF66]"
              >
                View all
              </Link>
            </div>

            {recentExpenses && recentExpenses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className={`flex flex-col justify-between rounded-xl border-2 p-4 transition-colors ${
                      isDarkMode
                        ? "border-gray-700 bg-[#191A23] hover:border-gray-500"
                        : "border-gray-200 bg-gray-50 hover:border-[#191A23]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold">
                          {expense.description || "No description"}
                        </p>
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 mt-2 inline-block rounded-md ${
                            isDarkMode
                              ? "bg-gray-800 text-gray-300"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {expense.category}
                        </span>
                      </div>
                      <span
                        className={`text-lg font-extrabold ${isDarkMode ? "text-white" : "text-[#191A23]"}`}
                      >
                        - ₹{expense.expenseAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B9FF66]/20 text-3xl">
                  📝
                </div>
                <h4 className="text-xl font-bold mb-2">No expenses found</h4>
                <p
                  className={`text-sm max-w-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  You haven't added any expenses yet. Add your first expense to
                  see it here.
                </p>
                <Link
                  to="/user/expenses"
                  className={`mt-6 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-1 ${
                    isDarkMode
                      ? "bg-[#B9FF66] text-[#191A23]"
                      : "bg-[#191A23] text-white"
                  }`}
                >
                  Add Expense
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
