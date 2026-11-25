// src/components/layout/SidebarNav.jsx
import { useNavigate } from "react-router-dom";
import { Users, LogOut, Sun, Moon, MessageCircle, Compass } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-4xl transition-all duration-200",
      isActive
        ? "bg-blue-600 text-white dark:bg-blue-600"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
    )}
  >
    <Icon className="h-5 w-5 transition-transform" />
    <div className="pointer-events-none absolute left-full z-50 ml-3 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
      <div className="h-2 w-2 rotate-45 bg-slate-800 dark:bg-slate-200" />
      <span className="rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm dark:bg-slate-200 dark:text-slate-900">
        {label}
      </span>
    </div>
  </button>
);

const SidebarNav = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative z-50 hidden w-[72px] flex-col items-center border-r border-slate-200/60 bg-white/60 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60 sm:flex">
      {/* Primary Navigation Links */}
      <div className="flex flex-1 flex-col gap-3">
        <NavItem
          icon={MessageCircle}
          label="Chats"
          isActive={activeTab === "chats"}
          onClick={() => setActiveTab("chats")}
        />
        <NavItem
          icon={Users}
          label="Groups"
          isActive={activeTab === "groups"}
          onClick={() => setActiveTab("groups")}
        />
        <NavItem
          icon={Compass}
          label="Find People"
          isActive={activeTab === "people"}
          onClick={() => setActiveTab("people")}
        />
      </div>

      {/* Bottom Utilities & User Profile */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <NavItem
          icon={theme === "dark" ? Sun : Moon}
          label="Toggle Theme"
          onClick={toggleTheme}
        />

        <NavItem icon={LogOut} label="Log out" onClick={handleLogout} />

        <div className="my-1 h-[1px] w-8 bg-slate-200 dark:bg-slate-800" />

        {/* User Profile Avatar -> Routes to Settings */}
        <button
          onClick={() => navigate("/settings")}
          className="cursor-pointer group relative mt-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent transition-all hover:border-blue-500"
        >
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {initials}
            </div>
          )}

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#09090b]" />

          <div className="pointer-events-none absolute left-full z-50 ml-3 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className=" h-2 w-2 rotate-45 bg-slate-800 dark:bg-slate-200" />
            <span className="whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm dark:bg-slate-200 dark:text-slate-900">
              My Account
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
