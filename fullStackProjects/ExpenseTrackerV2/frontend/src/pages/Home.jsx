import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // Import Auth
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuth(); // Get auth state
  const isPremium = user?.premiumStatus || false; // Check if user is premium
  const navigate = useNavigate();

  // Helper to handle pricing buttons based on auth state
  const handlePlanClick = (plan) => {
    if (isAuthenticated) {
      if (plan === "free") {
        navigate("user/dashboard");
      } else {
        navigate("user/premium"); // Or wherever your upgrade checkout is
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#B9FF66] selection:text-[#191A23] ${
        isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"
      }`}
    >
      <Navbar />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section
          className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-16 lg:py-20"
          id="about"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Copy */}
            <div>
              <div
                className={`mb-6 inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "border-gray-600 bg-[#292A32] text-gray-200"
                    : "border-[#191A23] bg-white text-[#191A23]"
                }`}
              >
                <span className="flex h-2 w-2 rounded-full bg-[#B9FF66]"></span>
                {isAuthenticated
                  ? "You are logged in"
                  : "AI-powered expense tracking"}
              </div>

              {/* Dynamic Header */}
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                {isAuthenticated ? (
                  <>
                    Welcome back, <br />
                    <span className="bg-[#B9FF66] px-2 inline-block mt-2 rounded-lg text-[#191A23]">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                    .
                  </>
                ) : (
                  <>
                    Every expense, <br />
                    <span className="bg-[#B9FF66] px-2 inline-block mt-2 rounded-lg text-[#191A23]">
                      automatically
                    </span>{" "}
                    categorized.
                  </>
                )}
              </h1>

              {/* Dynamic Subtitle */}
              <p
                className={`mt-6 max-w-lg text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {isAuthenticated
                  ? "Ready to manage your finances? Head over to your dashboard to log a new expense or review your recent activity."
                  : "ExpenseFlow reads your transactions and files them into the right category in seconds. Add, edit or remove any expense with a single tap — then see exactly where your money goes."}
              </p>

              {/* Dynamic CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => navigate("user/dashboard")}
                      className={`cursor-pointer inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold transition-all hover:-translate-y-1 ${
                        isDarkMode
                          ? "bg-[#B9FF66] text-[#191A23] hover:bg-white"
                          : "bg-[#191A23] text-white hover:bg-gray-800"
                      }`}
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => navigate("user/expenses")}
                      className={`cursor-pointer inline-flex items-center justify-center rounded-xl border-2 bg-transparent px-8 py-4 text-base font-medium transition-colors ${
                        isDarkMode
                          ? "border-gray-500 text-white hover:border-white hover:bg-white hover:text-[#191A23]"
                          : "border-[#191A23] text-[#191A23] hover:bg-[#191A23] hover:text-white"
                      }`}
                    >
                      Add Expense
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/signup")}
                      className={`inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold transition-all hover:-translate-y-1 ${
                        isDarkMode
                          ? "bg-[#B9FF66] text-[#191A23] hover:bg-white"
                          : "bg-[#191A23] text-white hover:bg-gray-800"
                      }`}
                    >
                      Start free
                    </button>
                    <button
                      onClick={() => navigate("/login")}
                      className={`inline-flex items-center justify-center rounded-xl border-2 bg-transparent px-8 py-4 text-base font-medium transition-colors ${
                        isDarkMode
                          ? "border-gray-500 text-white hover:border-white hover:bg-white hover:text-[#191A23]"
                          : "border-[#191A23] text-[#191A23] hover:bg-[#191A23] hover:text-white"
                      }`}
                    >
                      View live demo
                    </button>
                  </>
                )}
              </div>

              {/* Stats (Only show if not authenticated to keep UI clean for returning users) */}
              {!isAuthenticated && (
                <div
                  className={`mt-12 flex flex-wrap gap-8 border-t-2 pt-8 ${
                    isDarkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  {[
                    ["98.4%", "Auto-categorization"],
                    ["< 2s", "Categorization time"],
                    ["24", "Smart categories"],
                  ].map(([val, label]) => (
                    <div key={label}>
                      <strong className="block text-3xl font-bold">
                        {val}
                      </strong>
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Dashboard Preview (Themed) - Kept static as a marketing mockup */}
            <div className="relative">
              <div
                className={`rounded-[45px] border-2 p-6 transition-all sm:p-8 ${
                  isDarkMode
                    ? "border-gray-700 bg-[#292A32] shadow-[8px_8px_0_0_#000]"
                    : "border-[#191A23] bg-[#F3F3F3] shadow-[8px_8px_0_0_#191A23]"
                }`}
              >
                {/* Header */}
                <div
                  className={`flex items-center justify-between border-b-2 pb-4 ${
                    isDarkMode ? "border-gray-700" : "border-[#191A23]"
                  }`}
                >
                  <h3 className="text-lg font-bold">Financial overview</h3>
                  <span
                    className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${
                      isDarkMode
                        ? "border-gray-600 bg-[#191A23] text-white"
                        : "border-[#191A23] bg-white text-[#191A23]"
                    }`}
                  >
                    March 2026
                  </span>
                </div>

                {/* Balance */}
                <div
                  className={`mt-6 rounded-2xl border-2 p-5 ${
                    isDarkMode
                      ? "border-gray-700 bg-[#191A23]"
                      : "border-[#191A23] bg-white"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Total balance
                  </p>
                  <h2 className="mt-1 text-3xl font-bold">₹ 45,850.00</h2>
                  <span className="mt-1 inline-block rounded-md bg-[#B9FF66] px-2 py-0.5 text-xs font-bold text-[#191A23]">
                    + ₹12,400 vs. last month
                  </span>
                </div>

                {/* Income / Expense */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border-2 border-[#191A23] bg-[#B9FF66] p-4 text-[#191A23]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#191A23]/70">
                      Income
                    </p>
                    <h4 className="mt-1 text-xl font-bold">₹ 60,000</h4>
                  </div>
                  <div
                    className={`rounded-xl border-2 p-4 ${
                      isDarkMode
                        ? "border-gray-700 bg-[#191A23]"
                        : "border-[#191A23] bg-white"
                    }`}
                  >
                    <p
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Expenses
                    </p>
                    <h4 className="mt-1 text-xl font-bold">₹ 14,150</h4>
                  </div>
                </div>

                {/* Chart (Themed bars) */}
                <div
                  className={`mt-6 flex h-24 items-end gap-2 border-b-2 pb-2 ${
                    isDarkMode ? "border-gray-700" : "border-[#191A23]"
                  }`}
                >
                  {[40, 70, 50, 90, 60, 100, 75].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-t-md border-2 ${
                        i === 5
                          ? "border-[#B9FF66] bg-[#B9FF66]"
                          : isDarkMode
                            ? "border-gray-600 bg-[#292A32]"
                            : "border-[#191A23] bg-white"
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Recent Transactions */}
                <div className="mt-4 space-y-3">
                  {[
                    {
                      icon: "🍽",
                      title: "Swiggy order",
                      cat: "Food & Dining",
                      amt: "− ₹450",
                      neg: true,
                    },
                    {
                      icon: "🚕",
                      title: "Uber ride",
                      cat: "Transport",
                      amt: "− ₹280",
                      neg: true,
                    },
                    {
                      icon: "💼",
                      title: "Monthly salary",
                      cat: "Income",
                      amt: "+ ₹60,000",
                      neg: false,
                    },
                  ].map((tx) => (
                    <div
                      key={tx.title}
                      className={`flex items-center justify-between rounded-xl border-2 p-3 ${
                        isDarkMode
                          ? "border-gray-700 bg-[#191A23]"
                          : "border-[#191A23] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
                        >
                          {tx.icon}
                        </span>
                        <div>
                          <p className="text-sm font-bold">{tx.title}</p>
                          <span
                            className={`text-[10px] font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {tx.cat}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${tx.neg ? (isDarkMode ? "text-white" : "text-[#191A23]") : "text-green-500"}`}
                      >
                        {tx.amt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        {/* Kept as static marketing material for all users */}
        <section
          className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-16"
          id="features"
        >
          <div className="mb-12 text-center">
            <span className="inline-block rounded-lg bg-[#B9FF66] px-3 py-1 text-lg font-bold text-[#191A23]">
              Core features
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Built for how you actually spend
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI categorization",
                desc: "Every new transaction is analysed and tagged automatically — Food, Transport, Utilities and 21 more categories.",
                type: "light",
                icon: "🤖",
              },
              {
                title: "Full expense control",
                desc: "Add an expense in seconds, edit any detail later, or delete a duplicate instantly. Your ledger stays exactly how you want it.",
                type: "green",
                icon: "✏️",
              },
              {
                title: "Live spending insights",
                desc: "See totals update in real time as you add or change entries, so your balance and category breakdowns are never out of date.",
                type: "dark",
                icon: "📊",
              },
              {
                title: "Secure by default",
                desc: "Your records live behind an authenticated account. Sign in securely and access your expense history only from your session.",
                type: "light",
                icon: "🔒",
              },
              {
                title: "Spending leaderboard",
                desc: "Premium members can compare spending discipline on a live leaderboard and see how their habits stack up against others.",
                type: "dark",
                premium: true,
                icon: "🏆",
              },
              {
                title: "Detailed reports",
                desc: "Generate monthly and category-level reports, track trends over time, and export a clean summary whenever you need it.",
                type: "green",
                premium: true,
                icon: "📈",
              },
            ].map((feature, i) => {
              let cardClass = "";
              let descClass = "";

              if (feature.type === "green") {
                cardClass =
                  "bg-[#B9FF66] border-[#191A23] shadow-[4px_4px_0_0_#191A23] text-[#191A23]";
                descClass = "text-[#191A23]/80";
              } else if (feature.type === "dark") {
                cardClass = `bg-[#191A23] text-white shadow-[4px_4px_0_0_#191A23] ${isDarkMode ? "border-[#B9FF66] shadow-[4px_4px_0_0_#B9FF66]" : "border-[#191A23]"}`;
                descClass = "text-gray-300";
              } else {
                if (isDarkMode) {
                  cardClass =
                    "bg-[#292A32] border-gray-700 shadow-[4px_4px_0_0_#000] text-white";
                  descClass = "text-gray-400";
                } else {
                  cardClass =
                    "bg-[#F3F3F3] border-[#191A23] shadow-[4px_4px_0_0_#191A23] text-[#191A23]";
                  descClass = "text-gray-600";
                }
              }

              return (
                <div
                  key={i}
                  className={`flex flex-col justify-between rounded-[35px] border-2 p-8 transition-colors duration-300 ${cardClass}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{feature.icon}</span>
                      {feature.premium && (
                        <span className="rounded-full border-2 border-current px-3 py-1 text-xs font-bold uppercase">
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 text-2xl font-bold">{feature.title}</h3>
                    <p className={`mt-3 text-sm ${descClass}`}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= AI SECTION ================= */}
        {/* Kept as static marketing material */}
        <section
          className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-16"
          id="ai"
        >
          <div
            className={`rounded-[45px] border-2 p-8 transition-colors duration-300 sm:p-12 lg:p-16 ${isDarkMode ? "border-gray-700 bg-[#292A32] shadow-[8px_8px_0_0_#000]" : "border-[#191A23] bg-[#F3F3F3] shadow-[8px_8px_0_0_#191A23]"}`}
          >
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span
                  className={`inline-block rounded-lg border-2 px-3 py-1 text-sm font-bold transition-colors ${isDarkMode ? "border-gray-600 bg-[#191A23] text-white" : "border-[#191A23] bg-white text-[#191A23]"}`}
                >
                  AI Categorization
                </span>
                <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                  Stop sorting expenses by hand
                </h2>
                <p
                  className={`mt-4 text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Our model looks at the merchant, amount and timing of each
                  transaction and assigns the most likely category — instantly.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Automatic tagging on every new expense.",
                    "Learns your corrections over time.",
                    "Cleaner reports with consistent categories.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-base font-medium"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B9FF66] text-xs font-bold border-2 border-[#191A23] text-[#191A23]">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`rounded-[35px] border-2 p-6 transition-colors duration-300 sm:p-8 ${isDarkMode ? "border-gray-700 bg-[#191A23] shadow-[4px_4px_0_0_#000]" : "border-[#191A23] bg-white shadow-[4px_4px_0_0_#191A23]"}`}
              >
                <div
                  className={`flex items-center justify-between border-b-2 pb-4 ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
                >
                  <h4 className="font-bold">New expense detected</h4>
                  <span className="rounded-full bg-[#B9FF66] px-3 py-1 text-xs font-bold border border-[#191A23] text-[#191A23]">
                    Auto
                  </span>
                </div>
                <div
                  className={`mt-6 rounded-xl border-2 border-dashed p-4 ${isDarkMode ? "border-gray-600 bg-[#292A32]" : "border-[#191A23] bg-gray-50"}`}
                >
                  <p
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Merchant
                  </p>
                  <p className="text-xl font-bold">Swiggy · ₹450</p>
                  <p
                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Yesterday, 8:42 PM
                  </p>
                </div>
                <div className="my-4 flex items-center gap-2">
                  <div
                    className={`h-0.5 flex-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  ></div>
                  <span
                    className={`text-xs font-bold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    ANALYSING
                  </span>
                  <div
                    className={`h-0.5 flex-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  ></div>
                </div>
                <div className="rounded-xl border-2 border-[#191A23] bg-[#B9FF66] p-4 text-[#191A23]">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold">Categorized</h5>
                    <span className="text-xs font-bold">98% confidence</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold border-2 border-[#191A23]">
                      🍽 Food & Dining
                    </span>
                    <span className="rounded-lg bg-white/50 px-3 py-1.5 text-sm font-medium">
                      Online delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PREMIUM / PRICING ================= */}
        <section
          className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-16"
          id="premium"
        >
          <div className="mb-12 text-center">
            <span className="inline-block rounded-lg bg-[#B9FF66] px-3 py-1 text-lg font-bold text-[#191A23]">
              Plans
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Free to start. Premium to go deeper.
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <div
              className={`flex flex-col rounded-[35px] border-2 p-8 transition-colors duration-300 ${isDarkMode ? "border-gray-700 bg-[#191A23] shadow-[4px_4px_0_0_#000]" : "border-[#191A23] bg-white shadow-[4px_4px_0_0_#191A23]"}`}
            >
              <h3 className="text-2xl font-bold">Free</h3>
              <p
                className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Everything you need to stay organized
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <strong className="text-5xl font-bold">₹0</strong>
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                >
                  / forever
                </span>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {[
                  "Add, edit and delete expenses",
                  "AI categorization",
                  "Basic monthly totals",
                  "Secure account",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-[#191A23]"}`}
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
                {["Spending leaderboard", "Detailed reports"].map((item) => (
                  <li
                    key={item}
                    className={`flex items-center gap-3 text-sm font-medium line-through ${isDarkMode ? "text-gray-600 decoration-gray-600" : "text-gray-400 decoration-gray-400"}`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
                    >
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-xl border-2 py-4 font-bold transition-colors cursor-pointer ${isDarkMode ? "border-gray-500 hover:border-white hover:bg-white hover:text-[#191A23]" : "border-[#191A23] hover:bg-[#191A23] hover:text-white"}`}
                onClick={() => handlePlanClick("free")}
              >
                {isAuthenticated ? "Go to Dashboard" : "Create free account"}
              </button>
            </div>

            {/* Premium Plan */}
            <div
              className={`relative flex flex-col rounded-[35px] border-2 p-8 transition-colors duration-300 ${isDarkMode ? "border-[#B9FF66] bg-[#292A32] text-white shadow-[4px_4px_0_0_#B9FF66]" : "border-[#191A23] bg-[#191A23] text-white shadow-[4px_4px_0_0_#B9FF66]"}`}
            >
              <span className="absolute -top-3 left-8 rounded-full bg-[#B9FF66] px-3 py-1 text-xs font-bold text-[#191A23]">
                Most popular
              </span>
              <h3 className="text-2xl font-bold text-[#B9FF66]">Premium</h3>
              <p className="mt-1 text-sm text-gray-400">
                For people who want the full picture
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <strong className="text-5xl font-bold">₹299</strong>
                <span className="text-gray-400">/ month</span>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {[
                  "Everything in Free",
                  "Unlimited expense history",
                  "Spending leaderboard access",
                  "Detailed reports & export",
                  "Priority support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-gray-200"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B9FF66] text-[10px] font-bold text-[#191A23]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="mt-8 w-full rounded-xl bg-[#B9FF66] py-4 font-bold text-[#191A23] transition-transform hover:-translate-y-1 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0"
                onClick={() => handlePlanClick("premium")}
                disabled={isAuthenticated && isPremium}
              >
                {isAuthenticated && isPremium
                  ? "You are Premium"
                  : isAuthenticated
                    ? "Upgrade Now"
                    : "Sign up to Upgrade"}
              </button>
            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-16">
          <div
            className={`rounded-[45px] border-2 bg-[#B9FF66] p-10 text-center text-[#191A23] sm:p-16 ${isDarkMode ? "border-[#191A23] shadow-[8px_8px_0_0_#000]" : "border-[#191A23] shadow-[8px_8px_0_0_#191A23]"}`}
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Your expenses, finally in order
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-[#191A23]/80">
              {isAuthenticated
                ? "You're all set up. Head back to your dashboard to continue managing your finances."
                : "Create a free account and let AI categorize your first expenses in under a minute. Upgrade any time for leaderboards and full reports."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {isAuthenticated ? (
                <button
                  className="rounded-xl bg-[#191A23] px-8 py-4 font-bold text-white transition-transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate("user/dashboard")}
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    className="rounded-xl bg-[#191A23] px-8 py-4 font-bold text-white transition-transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate("/signup")}
                  >
                    Get started free
                  </button>
                  <button
                    className="rounded-xl border-2 border-[#191A23] bg-transparent px-8 py-4 font-bold text-[#191A23] transition-colors hover:bg-[#191A23] hover:text-white cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
