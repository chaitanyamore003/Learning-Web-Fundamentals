// src/components/chat/MessageInput.jsx
import { useState, useRef } from "react";
import { Send, Paperclip, Loader2, X, Sparkles } from "lucide-react";
import api from "../../lib/axios";
import { uploadToS3 } from "../../utils/s3Upload";
import { useAISuggestions } from "../../hooks/useAISuggestions";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

const MessageInput = ({
  conversationId,
  onMessageSent,
  lastIncomingMessage,
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket } = useSocket();
  const { user } = useAuth();

  const { suggestion, smartReplies, clearReplies } = useAISuggestions(
    text,
    lastIncomingMessage,
  );

  // Handle typing with debounce
  const handleTyping = (e) => {
    setText(e.target.value);

    if (!socket || !conversationId || !user) return;

    // Emit typing event
    socket.emit("typing", {
      conversationId,
      userName: user.name || user.username || "Someone",
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { conversationId });
    }, 2000);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 25 * 1024 * 1024)
      return alert("File too large (max 25MB)");
    setFile(selected);
    e.target.value = "";
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!text.trim() && !file) || !conversationId || sending || uploading)
      return;

    setSending(true);

    // Stop typing immediately when sending
    if (socket) socket.emit("stop_typing", { conversationId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      let messageType = "TEXT";
      let attachmentData = null;

      if (file) {
        setUploading(true);
        const { secure_url } = await uploadToS3(file, "chat-media");
        if (file.type.startsWith("image/")) messageType = "IMAGE";
        else if (file.type.startsWith("video/")) messageType = "VIDEO";
        else if (file.type.startsWith("audio/")) messageType = "AUDIO";
        else messageType = "DOCUMENT";

        attachmentData = {
          file_url: secure_url,
          file_name: file.name,
          mime_type: file.type,
          file_size: file.size,
          storage_provider: "S3",
        };
      }

      const res = await api.post("/messages", {
        conversationId,
        content: text.trim(),
        message_type: messageType,
        attachment: attachmentData,
      });

      onMessageSent(res.data.message);
      setText("");
      setFile(null);
      clearReplies();
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      setText((prev) => {
        const trimmed = prev.trimEnd();
        const separator = /^[.,!?;:]/.test(suggestion) ? "" : " ";
        return `${trimmed}${separator}${suggestion}`;
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      applySuggestion();
    }
  };

  return (
    <div className="border-t border-slate-200/60 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60">
      {/* SMART REPLIES UI */}
      {smartReplies.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex w-full items-center gap-1 text-[11px] font-semibold text-blue-500 mb-1">
            <Sparkles className="h-3 w-3" /> AI Smart Replies
          </div>
          {smartReplies.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setText(reply);
                clearReplies();
              }}
              className="cursor-pointer rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-700 transition hover:bg-blue-100 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* PREDICTIVE TEXT UI */}
      {suggestion && text.length > 2 && (
        <div className="mb-2 flex items-center gap-2 px-2">
          <span className="text-xs text-slate-400 italic">Suggestion:</span>
          <button
            type="button"
            onClick={applySuggestion}
            className="cursor-pointer flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          >
            {suggestion} <span className=" text-[10px] opacity-50">(Tab)</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSend}>
        {file && (
          <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            <span className="truncate max-w-[200px] font-medium">
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending || uploading}
            className="cursor-pointer grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={text}
            onChange={handleTyping} // Use handleTyping instead of setText
            onKeyDown={handleKeyDown}
            placeholder={file ? "Add a caption..." : "Type a message..."}
            disabled={sending || uploading}
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20"
          />

          <button
            type="submit"
            disabled={(!text.trim() && !file) || sending || uploading}
            className="cursor-pointer grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {sending || uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
