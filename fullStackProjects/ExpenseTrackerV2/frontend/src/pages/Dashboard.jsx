import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Link } from "react-router-dom"; // Import Link for the upgrade button

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Balance",
      amount: "₹ 45,850.00",
      trend: "+12.4%",
      icon: "💰",
      color: "bg-[#B9FF66]",
    },
    {
      title: "Total Income",
      amount: "₹ 60,000.00",
      trend: "+4.2%",
      icon: "📈",
      color: "bg-white dark:bg-[#292A32]",
    },
    {
      title: "Total Expenses",
      amount: "₹ 14,150.00",
      trend: "-2.1%",
      icon: "📉",
      color: "bg-white dark:bg-[#292A32]",
    },
  ];

  const chartBars = [40, 70, 45, 90, 65, 100, 80, 50, 75, 60, 85, 95];

  const recentTransactions = [
    {
      id: 1,
      name: "Swiggy Order",
      category: "Food & Dining",
      date: "Today, 8:42 PM",
      amount: "- ₹450",
      type: "expense",
      icon: "🍽",
    },
    {
      id: 2,
      name: "Uber Ride",
      category: "Transport",
      date: "Yesterday, 10:15 AM",
      amount: "- ₹280",
      type: "expense",
      icon: "🚕",
    },
    {
      id: 3,
      name: "Monthly Salary",
      category: "Income",
      date: "Mar 1, 2026",
      amount: "+ ₹60,000",
      type: "income",
      icon: "💼",
    },
    {
      id: 4,
      name: "Amazon Purchase",
      category: "Shopping",
      date: "Feb 28, 2026",
      amount: "- ₹1,200",
      type: "expense",
      icon: "📦",
    },
  ];

  const isPremium = user?.isPremium;

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#B9FF66] selection:text-[#191A23] ${isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"}`}
    >
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-16">
        {/* ================= PREMIUM UPGRADE BANNER (Only for Free Users) ================= */}
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
              to="/#premium"
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
                <span className="bg-[#B9FF66] px-2 inline-block rounded-lg text-[#191A23]">
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
              Here's what's happening with your money today.
            </p>
          </div>

          <button
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
          </button>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`rounded-[35px] border-2 p-6 sm:p-8 transition-all ${
                isDarkMode
                  ? `border-gray-700 ${stat.color === "bg-[#B9FF66]" ? "bg-[#B9FF66] text-[#191A23] border-[#191A23]" : "bg-[#292A32]"} shadow-[6px_6px_0_0_#B9FF66]`
                  : `border-[#191A23] ${stat.color} shadow-[6px_6px_0_0_#191A23]`
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl ${
                    isDarkMode && stat.color !== "bg-[#B9FF66]"
                      ? "border-gray-600 bg-[#191A23]"
                      : "border-[#191A23] bg-white/50"
                  }`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`rounded-full border-2 px-2.5 py-1 text-xs font-bold ${
                    stat.trend.startsWith("+")
                      ? "border-green-600 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "border-red-600 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <div className="mt-6">
                <p
                  className={`text-sm font-bold uppercase tracking-wider ${stat.color === "bg-[#B9FF66]" ? "text-[#191A23]/70" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {stat.title}
                </p>
                <h3 className="mt-1 text-3xl font-extrabold">{stat.amount}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CHART & TRANSACTIONS & LEADERBOARD ================= */}
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Chart Section (Spans 3 columns) */}
          <div
            className={`lg:col-span-3 rounded-[35px] border-2 p-6 sm:p-8 ${
              isDarkMode
                ? "border-gray-700 bg-[#292A32] shadow-[6px_6px_0_0_#000]"
                : "border-[#191A23] bg-white shadow-[6px_6px_0_0_#191A23]"
            }`}
          >
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold">Spending Overview</h3>
              <select
                className={`rounded-xl border-2 px-3 py-1.5 text-sm font-bold outline-none ${
                  isDarkMode
                    ? "border-gray-600 bg-[#191A23] text-white"
                    : "border-[#191A23] bg-white text-[#191A23]"
                }`}
              >
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>

            {/* Mock Bar Chart */}
            <div className="flex h-64 items-end gap-2 sm:gap-3">
              {chartBars.map((height, i) => (
                <div
                  key={i}
                  className="group relative flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="absolute -top-8 hidden rounded bg-[#191A23] px-2 py-1 text-xs font-bold text-white group-hover:block dark:bg-[#B9FF66] dark:text-[#191A23]">
                    ₹{height * 100}
                  </div>
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-t-md border-2 transition-all group-hover:bg-[#B9FF66] ${
                      i % 2 === 0
                        ? "border-[#191A23] bg-[#B9FF66]"
                        : isDarkMode
                          ? "border-gray-600 bg-[#191A23]"
                          : "border-[#191A23] bg-gray-100"
                    }`}
                  ></div>
                  <span
                    className={`text-[10px] font-bold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {
                      [
                        "J",
                        "F",
                        "M",
                        "A",
                        "M",
                        "J",
                        "J",
                        "A",
                        "S",
                        "O",
                        "N",
                        "D",
                      ][i]
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Transactions OR Leaderboard */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Recent Transactions (Visible to ALL users) */}
            <div
              className={`rounded-[35px] border-2 p-6 sm:p-8 ${
                isDarkMode
                  ? "border-gray-700 bg-[#292A32] shadow-[6px_6px_0_0_#000]"
                  : "border-[#191A23] bg-white shadow-[6px_6px_0_0_#191A23]"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent</h3>
                <a
                  href="#"
                  className="text-sm font-bold underline decoration-2 underline-offset-4 hover:text-[#B9FF66]"
                >
                  View all
                </a>
              </div>

              <div className="space-y-3">
                {recentTransactions.slice(0, 3).map((tx) => (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between rounded-xl border-2 p-3 transition-colors ${
                      isDarkMode
                        ? "border-gray-700 bg-[#191A23]"
                        : "border-gray-200 bg-gray-50 hover:border-[#191A23]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 text-sm ${isDarkMode ? "border-gray-600 bg-[#292A32]" : "border-[#191A23] bg-white"}`}
                      >
                        {tx.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{tx.name}</p>
                        <p
                          className={`text-[10px] font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {tx.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-extrabold ${tx.type === "income" ? "text-green-500" : isDarkMode ? "text-white" : "text-[#191A23]"}`}
                    >
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Leaderboard Widget */}
            {isPremium ? (
              <div
                className={`rounded-[35px] border-2 p-6 sm:p-8 ${
                  isDarkMode
                    ? "border-[#B9FF66] bg-[#292A32] shadow-[6px_6px_0_0_#B9FF66]"
                    : "border-[#191A23] bg-[#191A23] text-white shadow-[6px_6px_0_0_#B9FF66]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#B9FF66]">
                    Leaderboard
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    This Month
                  </span>
                </div>
                <div className="space-y-2">
                  {/* Mock Leaderboard Data */}
                  <div className="flex items-center justify-between rounded-lg bg-black/20 p-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-[#B9FF66]">#1</span>
                      <span>Ananya K.</span>
                    </div>
                    <span className="font-bold">92 pts</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-black/20 p-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-[#B9FF66]">#2</span>
                      <span>Rahul S.</span>
                    </div>
                    <span className="font-bold">88 pts</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#B9FF66] p-2 text-[#191A23]">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold">#3</span>
                      <span className="font-bold">You</span>
                    </div>
                    <span className="font-bold">84 pts</span>
                  </div>
                </div>
              </div>
            ) : (
              // Locked state for free users
              <div
                className={`flex flex-col items-center justify-center rounded-[35px] border-2 border-dashed p-6 text-center ${isDarkMode ? "border-gray-600 bg-[#191A23]" : "border-gray-300 bg-gray-50"}`}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#B9FF66]/20 text-[#B9FF66]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>
                </div>
                <h4 className="font-bold">Leaderboard Locked</h4>
                <p
                  className={`mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Upgrade to Premium to compare your spending with others.
                </p>
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
