// src/components/chat/ChatListPanel.jsx
import { useState, useEffect } from "react";
import { Search, Plus, MessageSquare, Loader2 } from "lucide-react";
import ChatListItem from "./ChatListItem";
import { Link } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

const getMessagePreview = (message) => {
  if (!message) return "No messages yet";
  const type = message.message_type || message.messageType || "TEXT";
  const text = message.content || "";

  if (type === "TEXT" && text.startsWith("http")) {
    if (text.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return "📷 Image";
    if (text.match(/\.(mp4|webm|ogg|mov)$/i)) return "🎥 Video";
    if (text.match(/\.(mp3|wav|m4a)$/i)) return "🎵 Audio";
    if (text.match(/\.(pdf|doc|docx|xls|xlsx|txt)$/i)) return "📄 Document";
  }

  if (type === "IMAGE") return text ? `📷 ${text}` : "📷 Image";
  if (type === "VIDEO") return text ? `🎥 ${text}` : "🎥 Video";
  if (type === "AUDIO") return text ? `🎵 ${text}` : "🎵 Audio";
  if (type === "DOCUMENT") return text ? `📄 ${text}` : "📄 Document";
  return text;
};

const ChatListPanel = ({
  chats,
  activeChat,
  onChatSelect,
  showMobileChat,
  loading,
  onCreateGroup,
  isGroupTab,
  onTabChange, // 👈 NEW PROP: Pass this from parent to switch tabs
}) => {
  const { socket } = useSocket();
  const [onlineStatuses, setOnlineStatuses] = useState({});

  // 👇 NEW: State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Listen to socket for online statuses
  useEffect(() => {
    if (!socket) return;

    const handleInitialOnlineUsers = (onlineUserIds) => {
      const statuses = {};
      onlineUserIds.forEach((id) => (statuses[String(id)] = true));
      setOnlineStatuses(statuses);
    };

    const handleStatusChange = ({ userId, isOnline }) => {
      setOnlineStatuses((prev) => ({
        ...prev,
        [String(userId)]: isOnline,
      }));
    };

    socket.on("initial_online_users", handleInitialOnlineUsers);
    socket.on("user_status_change", handleStatusChange);

    return () => {
      socket.off("initial_online_users", handleInitialOnlineUsers);
      socket.off("user_status_change", handleStatusChange);
    };
  }, [socket]);

  // 👇 NEW: Filter chats based on the search query
  const filteredChats = chats.filter((chat) => {
    const nameMatch = (chat.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return nameMatch;
  });

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
        {isGroupTab && (
          <button
            onClick={onCreateGroup}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search & Tabs */}
      <div className="border-b border-slate-200/60 p-3 dark:border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // 👈 Update search state
            className="w-full rounded-xl border border-slate-200 bg-white/50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20 dark:focus:border-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="mt-3 flex gap-2">
          {[
            { label: "All", value: false },
            { label: "Groups", value: true },
          ].map((tab) => {
            const isActive = isGroupTab === tab.value;
            return (
              <button
                key={tab.label}
                onClick={() => onTabChange && onTabChange(tab.value)} // 👈 Switch tabs
                className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : filteredChats.length === 0 ? (
          // 👇 Handle empty state for search
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
              <MessageSquare className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {searchQuery
                ? "No results found"
                : isGroupTab
                  ? "No groups yet"
                  : "No chats yet"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? "Try a different search term"
                : isGroupTab
                  ? "Create a new group by clicking the +"
                  : "Start a new conversation from the Discover tab"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const partnerId = String(
              chat.partnerId ||
                chat.user_id ||
                chat.otherUser?.id ||
                chat.members?.[0]?.id ||
                "",
            );

            const isOnline =
              onlineStatuses[partnerId] !== undefined
                ? onlineStatuses[partnerId]
                : chat.online;

            return (
              <ChatListItem
                key={chat.id}
                chat={{ ...chat, online: isOnline }}
                isActive={activeChat?.id === chat.id}
                onClick={() => onChatSelect(chat)}
                lastMessagePreview={getMessagePreview(
                  chat.lastMessage || chat.last_message,
                )}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatListPanel;
