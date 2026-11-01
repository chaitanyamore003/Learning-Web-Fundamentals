import { Link, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AuthLayout = () => {
  const { isDarkMode } = useTheme();

  const backBtnClass = `inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
    isDarkMode
      ? "border-gray-500 bg-[#191A23] text-white hover:border-[#B9FF66] hover:text-[#B9FF66]"
      : "border-[#191A23] bg-white text-[#191A23] hover:bg-[#191A23] hover:text-white"
  }`;

  return (
    <div
      className={`flex min-h-screen font-sans transition-colors duration-300 selection:bg-[#B9FF66] selection:text-[#191A23] ${
        isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
        {/* LEFT PANEL - BRAND / INFORMATION */}
        <div
          className={`relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex xl:p-16 ${
            isDarkMode ? "bg-[#191A23]" : "bg-[#F3F3F3]"
          }`}
        >
          {/* Decorative Background Elements */}
          <div
            className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#B9FF66] opacity-20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#B9FF66] opacity-20 blur-3xl"
            aria-hidden="true"
          />

          {/* Logo */}
          <div className="relative z-10">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
            >
              <img
                src="/expenseflow-logo.svg"
                alt="ExpenseFlow Logo"
                className="h-10 w-10 object-contain"
              />
              ExpenseFlow
            </Link>
          </div>

          {/* Value Proposition */}
          <div className="relative z-10 my-auto">
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
              Master your money,
              <br />
              <span className="mt-2 inline-block rounded-lg bg-[#B9FF66] px-2 text-[#191A23]">
                effortlessly.
              </span>
            </h1>
            <p
              className={`mt-6 max-w-md text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join thousands of users who let AI categorize their expenses
              automatically, so they can focus on what actually matters.
            </p>
          </div>

          {/* Trusted By / Stats */}
          <div
            className={`relative z-10 flex items-center gap-6 border-t-2 pt-8 ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    isDarkMode
                      ? "border-[#191A23] bg-gray-700 text-white"
                      : "border-white bg-gray-200 text-[#191A23]"
                  }`}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-[#B9FF66] text-xs font-bold text-[#191A23] ${
                  isDarkMode ? "border-[#191A23]" : "border-white"
                }`}
              >
                +
              </div>
            </div>
            <div>
              <p className="text-sm font-bold">10,000+ users</p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                tracking their expenses daily
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - FORM CONTENT */}
        <div className="relative flex w-full flex-col items-center justify-center p-4 py-20 sm:p-8 lg:w-1/2 lg:p-12 xl:p-16">
          {/* BACK TO HOME BUTTON (Pinned Top Left) */}
          <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
            <Link to="/" className={backBtnClass}>
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
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>

          {/* MOBILE LOGO */}
          <div className="mb-8 mt-12 lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold tracking-tight"
            >
              <img
                src="/expenseflow-logo.svg"
                alt="ExpenseFlow Logo"
                className="h-8 w-8 object-contain"
              />
              ExpenseFlow
            </Link>
          </div>

          {/* 
            FORM CARD 
            Added min-h-[500px] and flex flex-col justify-center 
            so it never collapses into a pill and stays perfectly centered.
          */}
          <div
            className={`flex min-h-[500px] w-full max-w-md flex-col justify-center rounded-[35px] border-2 p-8 transition-all duration-300 sm:p-10 ${
              isDarkMode
                ? "border-[#B9FF66] bg-[#292A32] shadow-[8px_8px_0_0_#B9FF66]"
                : "border-[#191A23] bg-white shadow-[8px_8px_0_0_#191A23]"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
