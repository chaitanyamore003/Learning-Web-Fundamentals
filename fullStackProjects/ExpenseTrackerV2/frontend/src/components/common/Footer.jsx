import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { isDarkMode } = useTheme();

  const productLinks = [
    { name: "Features", href: "/#features" },
    { name: "AI Categorization", href: "/#ai" },
    { name: "Premium", href: "/#premium" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer
      className={`w-full overflow-hidden pt-16 transition-colors duration-300 ${
        isDarkMode ? "bg-[#0B0F19]" : "bg-[#FAFAFA]"
      }`}
    >
      {/* 1. Main Links Container (The Card) */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-[24px] border p-8 transition-colors duration-300 sm:p-10 lg:p-12 ${
            isDarkMode
              ? "border-[#1E293B] bg-[#0F141E] text-white" // Clean, flat dark card matching the image
              : "border-gray-200 bg-white text-[#191A23] shadow-sm" // Clean, flat light card
          }`}
        >
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand & Description (Spans 4 cols) */}
            <div className="lg:col-span-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-2xl font-bold tracking-tight"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDarkMode ? "bg-[#B9FF66] text-[#191A23]" : "bg-[#191A23] text-[#B9FF66]"}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </span>
                ExpenseFlow
              </Link>
              <p
                className={`mt-4 max-w-xs text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Track and manage your expenses effortlessly with AI. Built to
                make personal finance simpler and smarter.
              </p>
            </div>

            {/* Product Links (Spans 3 cols) */}
            <div className="lg:col-span-3 lg:col-start-6">
              <h4
                className={`mb-5 text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
              >
                Product
              </h4>
              <ul className="flex flex-col gap-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={`text-sm transition-colors hover:text-[#B9FF66] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links (Spans 3 cols) */}
            <div className="lg:col-span-3">
              <h4
                className={`mb-5 text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
              >
                Company
              </h4>
              <ul className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={`text-sm transition-colors hover:text-[#B9FF66] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials & Copyright (Spans 2 cols) */}
            <div className="flex flex-col lg:col-span-2 lg:items-end">
              <div className="flex items-center gap-3">
                {/* YouTube */}
                <a
                  href="#"
                  aria-label="YouTube"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:-translate-y-0.5 hover:border-[#B9FF66] hover:text-[#B9FF66] ${isDarkMode ? "border-[#1E293B] bg-[#151B2B] text-gray-300" : "border-gray-200 bg-gray-50 text-gray-600"}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                {/* Twitter */}
                <a
                  href="#"
                  aria-label="Twitter"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:-translate-y-0.5 hover:border-[#B9FF66] hover:text-[#B9FF66] ${isDarkMode ? "border-[#1E293B] bg-[#151B2B] text-gray-300" : "border-gray-200 bg-gray-50 text-gray-600"}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:-translate-y-0.5 hover:border-[#B9FF66] hover:text-[#B9FF66] ${isDarkMode ? "border-[#1E293B] bg-[#151B2B] text-gray-300" : "border-gray-200 bg-gray-50 text-gray-600"}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:-translate-y-0.5 hover:border-[#B9FF66] hover:text-[#B9FF66] ${isDarkMode ? "border-[#1E293B] bg-[#151B2B] text-gray-300" : "border-gray-200 bg-gray-50 text-gray-600"}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>

              <p
                className={`mt-6 text-[13px] lg:text-right ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                © 2026 ExpenseFlow.
                <br className="hidden lg:block" /> All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Massive Edge-to-Edge Branding Text */}
      <div className="mt-16 flex w-full justify-center overflow-hidden sm:mt-24">
        <h1
          className={`select-none whitespace-nowrap text-[16vw] font-extrabold leading-[0.65] tracking-tighter transition-colors duration-300 ${
            isDarkMode ? "text-[#1A2332]" : "text-[#191A23]/10"
          }`}
          // Pushes the text slightly below the screen to crop it exactly like the picture
          style={{ marginBottom: "-3vw" }}
        >
          ExpenseFlow
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
