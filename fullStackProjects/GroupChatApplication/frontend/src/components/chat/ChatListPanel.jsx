// src/components/chat/ChatListPanel.jsx
import { Search, Plus, MessageSquare, Loader2 } from "lucide-react";
import ChatListItem from "./ChatListItem";
import { Link } from "react-router-dom";

const ChatListPanel = ({
  chats,
  activeChat,
  onChatSelect,
  showMobileChat,
  loading,
}) => {
  return (
    <div
      className={`w-full flex-col border-r border-slate-200/60 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/40 sm:flex sm:w-[350px] lg:w-[400px] ${
        showMobileChat ? "hidden" : "flex"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3 dark:border-white/10">
        <Link to={"/"} className="text-xl font-extrabold tracking-tighter">
          Said Hi<span className="text-blue-600">.</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="border-b border-slate-200/60 p-3 dark:border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full rounded-xl border border-slate-200 bg-white/50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20 dark:focus:border-blue-500"
          />
        </div>
        <div className="mt-3 flex gap-2">
          {["All", "Groups"].map((filter, i) => (
            <button
              key={filter}
              className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium transition ${
                i === 0
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Loading State
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : chats.length === 0 ? (
          // Empty State
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
              <MessageSquare className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              No chats yet
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Start a new conversation by clicking the +
            </p>
          </div>
        ) : (
          // Dynamic Chat List
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onClick={() => onChatSelect(chat)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatListPanel;
