// src/components/chat/MessageBubble.jsx
import { CheckCheck } from "lucide-react";

const MessageBubble = ({ message }) => {
  return (
    <div
      className={`flex w-full ${message.isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed shadow-sm sm:max-w-[70%] ${
          message.isMine
            ? "rounded-tr-sm bg-blue-600 text-white"
            : "rounded-tl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
            part.match(/https?:\/\/[^\s]+/) ? (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noreferrer"
                className={`underline ${
                  message.isMine
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
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            message.isMine ? "text-blue-200" : "text-slate-400"
          }`}
        >
          <span>{message.time}</span>
          {message.isMine && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
