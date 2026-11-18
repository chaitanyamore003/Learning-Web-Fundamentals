// src/components/chat/ChatListPanel.jsx
import { Search, Plus, MoreVertical } from "lucide-react";
import ChatListItem from "./ChatListItem";

const ChatListPanel = ({ chats, activeChat, onChatSelect, showMobileChat }) => {
  return (
    <div
      className={`w-full flex-col border-r border-slate-200/60 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/40 sm:flex sm:w-[350px] lg:w-[400px] ${
        showMobileChat ? "hidden" : "flex"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3 dark:border-white/10">
        <h1 className="text-xl font-extrabold tracking-tighter">
          Said Hi<span className="text-blue-600">.</span>
        </h1>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Plus className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
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
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={activeChat.id === chat.id}
            onClick={() => onChatSelect(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatListPanel;
