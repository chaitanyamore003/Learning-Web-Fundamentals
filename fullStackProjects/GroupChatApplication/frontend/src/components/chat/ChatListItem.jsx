// src/components/chat/ChatListItem.jsx
const ChatListItem = ({ chat, isActive, onClick, lastMessagePreview }) => (
  <div
    onClick={onClick}
    className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 p-3 transition hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/50 ${
      isActive ? "bg-blue-50/50 dark:bg-blue-500/10" : ""
    }`}
  >
    <div className="relative shrink-0">
      <img
        src={chat.avatar}
        alt={chat.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      {chat.online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#09090b]" />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between">
        <h3 className="truncate text-[15px] font-semibold text-slate-900 dark:text-white">
          {chat.name}
        </h3>
        <span
          className={`text-[11px] ${chat.unread > 0 ? "font-bold text-blue-600 dark:text-blue-400" : "text-slate-500"}`}
        >
          {chat.time}
        </span>
      </div>
      <div className="mt-0.5 flex items-center justify-between">
        <p
          className={`truncate text-[13px] ${chat.unread > 0 ? "font-medium text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"}`}
        >
          {lastMessagePreview || chat.lastMessage}
        </p>
        {chat.unread > 0 && (
          <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
            {chat.unread}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default ChatListItem;
