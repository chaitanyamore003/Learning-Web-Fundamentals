// src/components/chat/MessageBubble.jsx
import { CheckCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MessageBubble = ({ message }) => {
  const { user } = useAuth();

  // 1. Dynamically determine if the message was sent by the logged-in user
  // We check both sender_id (snake_case from DB) and senderId (camelCase)
  const isMine =
    message.sender_id === user?.id || message.senderId === user?.id;

  // 2. Use `content` instead of `text` (matches our Sequelize model)
  const content = message.content || "";

  // 3. Format the real timestamp from the database
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
          {/* Parse links dynamically based on content */}
          {content.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
            part.match(/https?:\/\/[^\s]+/) ? (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noreferrer"
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

        {/* Time & Read Receipts */}
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isMine ? "text-blue-200" : "text-slate-400"
          }`}
        >
          <span>{formattedTime}</span>
          {/* Only show checks if it's our message */}
          {isMine && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
