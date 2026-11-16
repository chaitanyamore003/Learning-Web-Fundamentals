// src/components/layout/SidebarNav.jsx
import { MessageSquare, Settings, LogOut } from "lucide-react";
import { CURRENT_USER } from "../../data/mockChats";

const SidebarNav = () => (
  <div className="hidden w-16 flex-col items-center border-r border-slate-200/60 bg-white/60 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60 sm:flex">
    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
      <MessageSquare className="h-5 w-5" />
    </div>

    <div className="flex flex-1 flex-col gap-4">
      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
        <MessageSquare className="h-5 w-5" />
      </button>
    </div>

    <div className="flex flex-col gap-4 pb-2">
      <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300">
        <Settings className="h-5 w-5" />
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300">
        <LogOut className="h-5 w-5" />
      </button>
      <img
        src={CURRENT_USER.avatar}
        alt="Profile"
        className="mt-2 h-9 w-9 rounded-full border-2 border-white shadow-sm dark:border-slate-700"
      />
    </div>
  </div>
);

export default SidebarNav;
