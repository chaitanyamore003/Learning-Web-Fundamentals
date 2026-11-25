// src/components/chat/MessageBubble.jsx
import { useState, useEffect, useRef } from "react";
import {
  CheckCheck,
  FileText,
  Download,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios";

const MessageBubble = ({ message, onDeleteSuccess }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMine =
    String(message.sender_id ?? message.senderId) === String(user?.id);
  const messageType = message.message_type || message.messageType || "TEXT";

  const attachments = message.attachments || message.Attachment;
  const attachment = Array.isArray(attachments) ? attachments[0] : attachments;

  const fileUrl = attachment?.file_url;
  const fileName = attachment?.file_name || "Download File";
  const content = message.content || "";
  const showCaption = content.trim() !== "" && content !== fileUrl;

  const formattedTime =
    message.createdAt || message.created_at
      ? new Date(message.createdAt || message.created_at).toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" },
        )
      : "";

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const handleDelete = async () => {
    setShowMenu(false);
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await api.delete(`/messages/${message.id}`);
      // 👇 Instantly remove from UI (Optimistic Update)
      if (onDeleteSuccess) onDeleteSuccess(message.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert(error.response?.data?.message || "Could not delete message.");
    }
  };

  const renderContent = () => {
    switch (messageType) {
      case "IMAGE":
        return (
          <div className="flex flex-col gap-2">
            <img
              src={fileUrl || content}
              alt={fileName}
              className="max-h-[300px] w-auto max-w-full cursor-pointer rounded-xl object-cover transition hover:opacity-90"
              onClick={() => window.open(fileUrl || content, "_blank")}
            />
            {showCaption && (
              <p className="px-1 text-sm whitespace-pre-wrap break-words">
                {content}
              </p>
            )}
          </div>
        );
      case "VIDEO":
        return (
          <div className="flex flex-col gap-2">
            <video
              src={fileUrl || content}
              controls
              className="max-h-[300px] w-full max-w-[300px] rounded-xl bg-black/10"
            />
            {showCaption && (
              <p className="px-1 text-sm whitespace-pre-wrap break-words">
                {content}
              </p>
            )}
          </div>
        );
      case "AUDIO":
        return (
          <div className="flex flex-col gap-2">
            <audio
              src={fileUrl || content}
              controls
              className="mt-1 w-[240px] max-w-full"
            />
            {showCaption && (
              <p className="px-1 text-sm whitespace-pre-wrap break-words">
                {content}
              </p>
            )}
          </div>
        );
      case "DOCUMENT":
        return (
          <div className="flex flex-col gap-2">
            <a
              href={fileUrl || content}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 rounded-xl p-3 transition ${isMine ? "bg-blue-700/50 hover:bg-blue-700/70" : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700"}`}
            >
              <div
                className={`rounded-lg p-2 ${isMine ? "bg-blue-600" : "bg-white dark:bg-slate-800"}`}
              >
                <FileText
                  className={`h-5 w-5 ${isMine ? "text-white" : "text-blue-600 dark:text-blue-400"}`}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold max-w-[150px]">
                  {fileName}
                </span>
                <span
                  className={`text-[11px] ${isMine ? "text-blue-200" : "text-slate-500"}`}
                >
                  Click to download
                </span>
              </div>
              <Download
                className={`h-4 w-4 shrink-0 ${isMine ? "text-blue-200" : "text-slate-400"}`}
              />
            </a>
            {showCaption && (
              <p className="px-1 text-sm whitespace-pre-wrap break-words">
                {content}
              </p>
            )}
          </div>
        );
      case "TEXT":
      default:
        return (
          <div className="whitespace-pre-wrap break-words">
            {content.split(urlRegex).map((part, i) =>
              part.match(urlRegex) ? (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline ${isMine ? "text-blue-200 hover:text-white" : "text-blue-600 hover:text-blue-700 dark:text-blue-400"}`}
                >
                  {part}
                </a>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </div>
        );
    }
  };

  const isMedia = ["IMAGE", "VIDEO"].includes(messageType);
  const paddingClass = isMedia ? "p-1.5" : "px-3.5 py-2";

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[85%] rounded-2xl ${paddingClass} text-[14px] leading-relaxed shadow-sm sm:max-w-[70%] ${isMine ? "rounded-tr-sm bg-blue-600 text-white" : "rounded-tl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}
      >
        {renderContent()}
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMine ? "text-blue-200" : "text-slate-400"} ${isMedia ? "px-2 pb-1" : ""}`}
        >
          <span>{formattedTime}</span>
          {isMine && <CheckCheck className="h-3 w-3" />}
          {isMine && (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`cursor-pointer flex items-center justify-center rounded-full p-0.5 transition hover:bg-black/10 dark:hover:bg-white/10 ${isMine ? "text-blue-200 hover:text-white" : "text-slate-400 hover:text-slate-600"}`}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
              {showMenu && (
                <div className="absolute bottom-full right-0 mb-1 w-28 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5 dark:bg-slate-800 z-50 animate-in fade-in zoom-in-95">
                  <button
                    onClick={handleDelete}
                    className="cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
