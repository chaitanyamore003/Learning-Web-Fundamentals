// src/components/chat/ChatWindow.jsx
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { MESSAGES } from "../../data/mockChats";

const ChatWindow = ({ activeChat, showMobileChat, onBack }) => {
  return (
    <div
      className={`flex-1 flex-col bg-[#f8faff]/50 dark:bg-[#080b14]/50 sm:flex ${
        showMobileChat ? "flex" : "hidden"
      }`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 bg-white/60 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="mr-1 rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              {activeChat.name}
            </h2>
            <p className="text-[12px] text-emerald-600 dark:text-emerald-400">
              {activeChat.online ? "Online" : "Last seen recently"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 sm:gap-2">
          <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Phone className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Video className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="relative flex-1 overflow-y-auto p-4 sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col gap-2">
          <div className="mx-auto mb-4 rounded-full bg-slate-200/80 px-3 py-1 text-[11px] font-medium text-slate-600 backdrop-blur-sm dark:bg-slate-800/80 dark:text-slate-300">
            Today
          </div>

          {MESSAGES.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
