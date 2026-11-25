// src/components/chat/MessageBubble.jsx
import { CheckCheck, FileText, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MessageBubble = ({ message }) => {
  const { user } = useAuth();

  // Determine message ownership
  const isMine =
    String(message.sender_id ?? message.senderId) === String(user?.id);

  // Message content and type
  const content = message.content || "";
  const messageType = message.message_type || message.messageType || "TEXT";

  // Format timestamp
  const formattedTime =
    message.createdAt || message.created_at
      ? new Date(message.createdAt || message.created_at).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        )
      : "";

  // Detect URLs for text messages
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Extract a readable filename from the S3 URL (e.g., "171234567-my_file.pdf" -> "my_file.pdf")
  const getFileName = (url) => {
    try {
      const decoded = decodeURIComponent(url);
      const parts = decoded.split("/").pop().split("-");
      // Remove the timestamp prefix we added in the backend (e.g., "1712345678-")
      if (parts.length > 1 && !isNaN(parts[0])) {
        return parts.slice(1).join("-");
      }
      return parts.pop();
    } catch {
      return "Download File";
    }
  };

  const renderContent = () => {
    switch (messageType) {
      case "IMAGE":
        return (
          <img
            src={content}
            alt="Shared image"
            className="max-h-[300px] w-auto max-w-full cursor-pointer rounded-xl object-cover transition hover:opacity-90"
            onClick={() => window.open(content, "_blank")}
          />
        );
      case "VIDEO":
        return (
          <video
            src={content}
            controls
            className="max-h-[300px] w-full max-w-[300px] rounded-xl bg-black/10"
          />
        );
      case "AUDIO":
        return (
          <audio src={content} controls className="mt-1 w-[240px] max-w-full" />
        );
      case "DOCUMENT":
        return (
          <a
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 rounded-xl p-3 transition ${
              isMine
                ? "bg-blue-700/50 hover:bg-blue-700/70"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700"
            }`}
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
                {getFileName(content)}
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
                  className={`underline ${
                    isMine
                      ? "text-blue-200 hover:text-white"
                      : "text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  }`}
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

  // Adjust padding based on message type (less padding for media to make it look nice)
  const isMedia = ["IMAGE", "VIDEO"].includes(messageType);
  const paddingClass = isMedia ? "p-1.5" : "px-3.5 py-2";

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl ${paddingClass} text-[14px] leading-relaxed shadow-sm sm:max-w-[70%] ${
          isMine
            ? "rounded-tr-sm bg-blue-600 text-white"
            : "rounded-tl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"
        }`}
      >
        {renderContent()}

        {/* Time and Read Receipts */}
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isMine ? "text-blue-200" : "text-slate-400"
          } ${isMedia ? "px-2 pb-1" : ""}`} // Add slight padding for timestamp on media
        >
          <span>{formattedTime}</span>
          {isMine && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
