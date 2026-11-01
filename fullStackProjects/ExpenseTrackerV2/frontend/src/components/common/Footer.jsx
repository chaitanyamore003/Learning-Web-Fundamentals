import { useTheme } from "../../context/ThemeContext"; // Adjust path if needed

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`w-full px-4 pb-8 pt-16 transition-colors duration-300 sm:px-8 lg:px-16 ${
        isDarkMode ? "bg-[#191A23]" : "bg-white"
      }`}
    >
      {/* Main Container */}
      <div
        className={`mx-auto max-w-7xl rounded-[45px] px-8 py-12 text-white transition-colors duration-300 sm:px-12 lg:px-16 lg:py-16 ${
          isDarkMode
            ? "bg-[#292A32] border border-[#404246]" // Lighter gray + subtle border in dark mode
            : "bg-[#191A23]"
        }`}
      >
        {/* Top Row: Logo, Nav Links, Socials */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-gray-700 pb-10 lg:flex-row">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B9FF66] text-[#191A23]">
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
          </a>

          {/* Navigation Links */}
          <ul className="flex flex-col items-center gap-6 sm:flex-row lg:gap-8">
            {["Features", "AI Categorization", "Premium", "About", "Blog"].map(
              (link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-base font-normal text-white underline-offset-4 transition-colors hover:text-[#B9FF66] hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ),
            )}
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {["LinkedIn", "Twitter", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                aria-label={social}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:bg-[#B9FF66] hover:text-[#191A23] ${
                  isDarkMode
                    ? "bg-[#191A23] text-white" // Dark background for socials in dark mode
                    : "bg-white text-[#191A23]" // White background for socials in light mode
                }`}
              >
                {social === "LinkedIn" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                )}
                {social === "Twitter" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                )}
                {social === "GitHub" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Middle Row: Contact Info & Newsletter */}
        <div className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-2 lg:gap-8">
          {/* Contact Details */}
          <div className="flex flex-col gap-5">
            <h3 className="inline-block w-max rounded-md bg-[#B9FF66] px-3 py-1.5 text-sm font-bold text-[#191A23]">
              Contact us:
            </h3>
            <ul className="space-y-3 text-base text-gray-300">
              <li>Email: hello@expenseflow.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>
                Address: 123 Finance St,
                <br />
                Tech District, Bangalore 560001
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="flex items-center justify-center lg:justify-end">
            <div
              className={`flex w-full max-w-md flex-col gap-4 rounded-2xl p-6 transition-colors duration-300 sm:flex-row sm:items-center sm:p-8 ${
                isDarkMode ? "bg-[#191A23]" : "bg-[#292A32]"
              }`}
            >
              <input
                type="email"
                placeholder="Email"
                className="w-full flex-1 rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:border-[#B9FF66] focus:outline-none"
              />
              <button className="w-full rounded-lg bg-[#B9FF66] px-6 py-3 font-bold text-[#191A23] transition-colors hover:bg-white sm:w-auto">
                Subscribe to news
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Legal */}
        <div
          className={`flex flex-col gap-4 border-t pt-8 text-sm text-gray-400 md:flex-row md:items-center ${
            isDarkMode ? "border-gray-600" : "border-gray-700"
          }`}
        >
          <p>© 2026 ExpenseFlow. All Rights Reserved.</p>
          <a
            href="#"
            className="underline underline-offset-4 transition-colors hover:text-white"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
