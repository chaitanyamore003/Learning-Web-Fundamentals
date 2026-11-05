import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { isDarkMode } = useTheme();

  const productLinks = [
    { name: "Features", href: "/#features" },
    { name: "AI Categorization", href: "/#ai" },
    { name: "Premium", href: "/#premium" },
    { name: "Dashboard", href: "/user/dashboard" },
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
              ? "border-[#1E293B] bg-[#0F141E] text-white"
              : "border-gray-200 bg-white text-[#191A23] shadow-sm"
          }`}
        >
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand & Description (Spans 5 cols now for better balance) */}
            <div className="lg:col-span-5">
              <Link
                to="/"
                className="flex items-center gap-2 text-2xl font-bold tracking-tight"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isDarkMode
                      ? "bg-[#B9FF66] text-[#191A23]"
                      : "bg-[#191A23] text-[#B9FF66]"
                  }`}
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
                className={`mt-4 max-w-sm text-sm leading-relaxed ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Track and manage your expenses effortlessly with AI. Built to
                make personal finance simpler and smarter.
              </p>
            </div>

            {/* Product Links (Spans 3 cols) */}
            <div className="lg:col-span-3">
              <h4
                className={`mb-5 text-sm font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Product
              </h4>
              <ul className="flex flex-col gap-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={`text-sm transition-colors hover:text-[#B9FF66] ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials, Creator Tag & Copyright (Spans 4 cols) */}
            <div className="flex flex-col lg:col-span-4 lg:items-end">
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {/* YouTube */}
                <a
                  href="https://youtube.com" // Replace with your demo video link
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all hover:-translate-y-1 hover:border-[#090909] ${
                    isDarkMode
                      ? "border-[#1E293B] bg-[#151B2B] text-gray-300"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
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

                {/* GitHub */}
                <a
                  href="https://github.com" // Replace with your GitHub repo link
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all hover:-translate-y-1 hover:border-[#090909]  ${
                    isDarkMode
                      ? "border-[#1E293B] bg-[#151B2B] text-gray-300"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com" // Replace with your LinkedIn profile
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all hover:-translate-y-1 hover:border-[#090909] ${
                    isDarkMode
                      ? "border-[#1E293B] bg-[#151B2B] text-gray-300"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>

              {/* Creator Tag */}
              <a
                href="https://linkedin.com" // Replace with your LinkedIn profile
                target="_blank"
                rel="noopener noreferrer"
                className={`group mt-6 flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all hover:-translate-y-0.5 ${
                  isDarkMode
                    ? "border-[#1E293B] bg-[#151B2B] text-gray-300 hover:border-[#B9FF66] hover:text-[#B9FF66]"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-[#191A23] hover:text-[#191A23] hover:shadow-sm"
                }`}
              >
                Created with{" "}
                <span className="text-red-500 transition-transform group-hover:scale-125 group-hover:animate-pulse">
                  ❤️
                </span>{" "}
                by Chaitanya More
              </a>

              {/* Copyright */}
              <p
                className={`mt-6 text-[13px] lg:text-right ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                © {new Date().getFullYear()} ExpenseFlow. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Massive Edge-to-Edge Branding Text */}
      <div className="mt-10 flex w-full justify-center overflow-hidden sm:mt-14">
        <h1
          className={`select-none whitespace-nowrap text-[16vw] font-extrabold leading-[0.75] tracking-tighter transition-colors duration-300 ${
            isDarkMode ? "text-[#1A2332]" : "text-[#191A23]/10"
          }`}
          style={{ marginBottom: "-1vw" }}
        >
          Expense{" "}
          <span id="brand" className="text-[#B9FF66]">
            Flow
          </span>
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
