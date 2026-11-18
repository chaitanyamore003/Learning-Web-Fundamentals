// src/components/layout/SidebarNav.jsx
import { useState } from "react";
import {
  Users,
  Star,
  Archive,
  Settings,
  LogOut,
  Sun,
  Moon,
  MessageCircle,
} from "lucide-react";
import { CURRENT_USER } from "../../data/mockChats";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/* Reusable Nav Item with Tooltip                                      */
/* ------------------------------------------------------------------ */
/**
 * NavItem component
 * Represents a single clickable icon button in the sidebar.
 *
 * @param {Object} props
 * @param {React.ElementType} props.icon - The Lucide icon component to render.
 * @param {string} props.label - The text to display in the tooltip.
 * @param {boolean} props.isActive - Whether this tab is currently selected.
 * @param {Function} props.onClick - Click handler to change the active tab.
 */
const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      // Base styles: sizing, centering, and hover transitions
      "group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-4xl transition-all duration-200",
      // Active state: solid blue background with white text
      isActive
        ? "bg-blue-600 text-white dark:bg-blue-600"
        : // Inactive state: slate text with subtle hover backgrounds
          "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
    )}
  >
    {/* Icon Element */}
    <Icon className="h-5 w-5 transition-transform" />

    {/* Hover Tooltip Container */}
    <div className="pointer-events-none absolute left-full z-50 ml-3 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
      {/* Tooltip Arrow pointing left */}
      <div className="h-2 w-2 rotate-45 bg-slate-800 dark:bg-slate-200" />
      {/* Tooltip Text Box */}
      <span className="rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm dark:bg-slate-200 dark:text-slate-900">
        {label}
      </span>
    </div>
  </button>
);

/* ------------------------------------------------------------------ */
/* Main Sidebar Component                                              */
/* ------------------------------------------------------------------ */
const SidebarNav = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("chats");

  return (
    /* Sidebar Container:
       - `relative z-50`: Elevates the sidebar above the chat list to prevent tooltip blur.
       - Hidden on mobile (`hidden sm:flex`)
       - Fixed width (`w-[72px]`)
       - Glassmorphic effect with border and blur
    */
    <div className="relative z-50 hidden w-[72px] flex-col items-center border-r border-slate-200/60 bg-white/60 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60 sm:flex">
      {/* ========================================= */}
      {/* Primary Navigation Links                  */}
      {/* ========================================= */}
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
          icon={Star}
          label="Starred"
          isActive={activeTab === "starred"}
          onClick={() => setActiveTab("starred")}
        />
        <NavItem
          icon={Archive}
          label="Archived"
          isActive={activeTab === "archived"}
          onClick={() => setActiveTab("archived")}
        />
      </div>

      {/* ========================================= */}
      {/* Bottom Utilities & User Profile           */}
      {/* ========================================= */}
      <div className="flex flex-col items-center gap-3 pb-2">
        {/* Theme & App Settings */}
        <NavItem
          icon={theme === "dark" ? Sun : Moon}
          label="Toggle Theme"
          onClick={toggleTheme}
        />
        <NavItem icon={Settings} label="Settings" />
        <NavItem icon={LogOut} label="Log out" />

        {/* Horizontal Divider Line */}
        <div className="my-1 h-[1px] w-8 bg-slate-200 dark:bg-slate-800" />

        {/* User Profile Avatar with Online Status */}
        <button className="group relative mt-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent transition-all hover:border-blue-500">
          <img
            src={CURRENT_USER.avatar}
            alt="Profile"
            className="h-full w-full rounded-full object-cover"
          />

          {/* Green Online Indicator Dot */}
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#09090b]" />

          {/* Profile Hover Tooltip */}
          <div className="pointer-events-none absolute left-full z-50 ml-3 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="h-2 w-2 rotate-45 bg-slate-800 dark:bg-slate-200" />
            <span className="whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm dark:bg-slate-200 dark:text-slate-900">
              {CURRENT_USER.name}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
