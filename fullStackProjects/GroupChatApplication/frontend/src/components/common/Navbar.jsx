// src/components/layout/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function Brand({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Said Hi — home"
      className="flex items-center gap-2"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/20">
        <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-extrabold tracking-tighter text-slate-900 dark:text-slate-100">
        Said Hi<span className="text-blue-600">.</span>
      </span>
    </Link>
  );
}

function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
        "dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
        className,
        "cursor-pointer",
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

const getInitials = (name = "") => {
  const trimmed = name.trim();
  if (!trimmed) return "U";
  return (
    trimmed
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
};

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const displayName = user?.name || user?.email || "User";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="cursor-pointer flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {user?.profile_picture ? (
          <img
            src={user.profile_picture}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
        ) : (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            {getInitials(displayName)}
          </span>
        )}
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-slate-400 transition-transform sm:block",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/90"
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {user?.name || "User"}
            </p>
            {user?.email && (
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            )}
          </div>

          <div className="p-1">
            <Link
              to="/chat"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <MessageCircle className="h-4 w-4" /> Go to Chats
            </Link>
            <Link
              to="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Settings className="h-4 w-4" /> My Account
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="cursor-pointer flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className=" h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const Navbar = ({ links = [], sticky = true, maxWidth = "max-w-5xl" }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isAuthed = Boolean(user);

  return (
    <header
      className={cn(
        "z-50 px-4 sm:px-6 pointer-events-none",
        sticky ? "fixed inset-x-0 top-4 md:top-6" : "relative w-full mb-6",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex h-16 items-center justify-between rounded-full px-5 sm:px-6",
          "border border-white/50 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-xl",
          "dark:border-white/10 dark:bg-[#09090b]/70 dark:shadow-black/40",
          maxWidth,
        )}
      >
        <Brand onClick={() => setMobileOpen(false)} />

        {links.length > 0 && (
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70" />
          ) : isAuthed ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link
                to="/login"
                className="hidden px-3 py-2 text-[14px] font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:inline-block"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-full bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:inline-block"
              >
                Sign Up
              </Link>
            </>
          )}

          {(links.length > 0 || !isAuthed) && (
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="pointer-events-auto absolute left-4 right-4 top-[72px] z-50 sm:left-6 sm:right-6 md:hidden">
          <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/90 p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/90">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {link.label}
                </a>
              ))}

              {!isAuthed && (
                <div className="mt-2 flex gap-2 border-t border-slate-200/50 p-2 dark:border-slate-700/50">
                  <Link
                    to="/login"
                    className="flex-1 rounded-full border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 rounded-full bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
