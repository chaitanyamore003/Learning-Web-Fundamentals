import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom"; // Assuming you are using react-router

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "AI Categorization", href: "#ai" },
    { name: "Premium", href: "#premium" },
  ];

  return (
    <nav
      className={`relative w-full px-4 py-6 transition-colors duration-300 sm:px-8 lg:px-16 ${
        isDarkMode ? "bg-[#191A23]" : "bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`flex items-center gap-2 text-2xl font-bold tracking-tight transition-colors ${
            isDarkMode ? "text-white" : "text-[#191A23]"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isDarkMode
                ? "bg-[#B9FF66] text-[#191A23]"
                : "bg-[#191A23] text-white"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </span>
          ExpenseFlow
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`text-[16px] font-normal transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-[#191A23] hover:text-gray-600"
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
              isDarkMode
                ? "border-gray-600 text-[#B9FF66] hover:border-[#B9FF66]"
                : "border-[#191A23] text-[#191A23] hover:bg-gray-100"
            }`}
          >
            {isDarkMode ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Desktop Auth CTA Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            {isAuthenticated ? (
              <>
                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#191A23] bg-[#B9FF66] text-sm font-bold text-[#191A23] dark:border-gray-600">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span
                    className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-[#191A23]"}`}
                  >
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                </div>

                {/* Dashboard Button */}
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center justify-center rounded-xl border-2 px-6 py-2.5 text-[15px] font-bold transition-colors ${
                    isDarkMode
                      ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] hover:bg-transparent hover:text-[#B9FF66]"
                      : "border-[#191A23] bg-[#191A23] text-white hover:bg-[#B9FF66] hover:text-[#191A23]"
                  }`}
                >
                  Dashboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className={`text-[15px] font-bold underline decoration-2 underline-offset-4 transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-[#191A23]"
                  }`}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-[16px] font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-[#191A23] hover:text-gray-600"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className={`inline-flex items-center justify-center rounded-xl border-2 px-6 py-3 text-[16px] font-medium transition-colors ${
                    isDarkMode
                      ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] hover:bg-transparent hover:text-[#B9FF66]"
                      : "border-[#191A23] bg-white text-[#191A23] hover:bg-[#191A23] hover:text-white"
                  }`}
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`block p-2 lg:hidden ${
              isDarkMode ? "text-white" : "text-[#191A23]"
            }`}
          >
            {isMobileMenuOpen ? (
              // Close Icon
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // Hamburger Icon
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
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className={`absolute left-0 top-full z-50 w-full border-b-2 px-4 py-6 sm:px-8 lg:hidden ${
            isDarkMode
              ? "border-gray-700 bg-[#191A23] shadow-[0_8px_0_0_rgba(0,0,0,0.5)]"
              : "border-[#191A23] bg-white shadow-[0_8px_0_0_#191A23]"
          }`}
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-lg font-medium ${
                    isDarkMode ? "text-gray-300" : "text-[#191A23]"
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div
            className={`mt-6 flex flex-col gap-4 border-t-2 pt-6 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#191A23] bg-[#B9FF66] text-sm font-bold text-[#191A23] dark:border-gray-600">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span
                    className={`text-base font-bold ${isDarkMode ? "text-white" : "text-[#191A23]"}`}
                  >
                    {user?.name || "User"}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex w-full items-center justify-center rounded-xl border-2 py-3 text-base font-bold ${
                    isDarkMode
                      ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23]"
                      : "border-[#191A23] bg-[#191A23] text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-center text-base font-bold underline decoration-2 underline-offset-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex w-full items-center justify-center rounded-xl border-2 py-3 text-base font-bold ${
                    isDarkMode
                      ? "border-gray-600 text-white"
                      : "border-[#191A23] text-[#191A23]"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex w-full items-center justify-center rounded-xl border-2 py-3 text-base font-bold ${
                    isDarkMode
                      ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23]"
                      : "border-[#191A23] bg-[#191A23] text-white"
                  }`}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
