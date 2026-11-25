// src/components/chat/DiscoverPanel.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Loader2, MessageSquare, User, Users, X } from "lucide-react";
import api from "../../lib/axios";

const DiscoverPanel = ({ onStartChat, showMobileChat }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/discover");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch discoverable users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className={`w-full flex-col overflow-hidden border-r border-slate-200/60 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/40 sm:flex sm:w-[350px] lg:w-[400px] ${
        showMobileChat ? "hidden" : "flex"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3 dark:border-white/10">
        <Link to={"/"} className="text-xl font-extrabold tracking-tighter">
          Said Hi<span className="text-blue-600">.</span>
        </Link>
      </div>

      {/* Search */}
      <div className="border-b border-slate-200/60 p-3 dark:border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/50 py-2 pl-9 pr-9 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20 dark:focus:border-blue-500"
          />
          {/* Clear Search Button */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          // 👇 Consistent Empty State
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Users className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {search ? "No users found" : "No new users"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {search
                ? "Try a different name or email."
                : "You've connected with everyone on the platform!"}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl p-3 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {/* User Info */}
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 font-semibold text-blue-600 dark:bg-blue-900/30">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 sm:px-3"
                    title="View Profile"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden text-[11px] font-semibold lg:inline">
                      Profile
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (onStartChat) onStartChat(user);
                      else navigate(`/profile/${user.id}`);
                    }}
                    className="flex cursor-pointer items-center gap-1 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 sm:px-3"
                    title="Message User"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden text-[11px] font-semibold lg:inline">
                      Message
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPanel;
