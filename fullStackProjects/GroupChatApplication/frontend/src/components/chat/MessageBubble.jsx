import { CheckCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MessageBubble = ({ message }) => {
  const { user } = useAuth();

  // Determine message ownership
  const isMine =
    String(message.sender_id ?? message.senderId) === String(user?.id);

  // Message content
  const content = message.content || "";

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

  // Detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed shadow-sm sm:max-w-[70%] ${
          isMine
            ? "rounded-tr-sm bg-blue-600 text-white"
            : "rounded-tl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"
        }`}
      >
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

        {/* Time and Read Receipts */}
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isMine ? "text-blue-200" : "text-slate-400"
          }`}
        >
          <span>{formattedTime}</span>

          {isMine && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
