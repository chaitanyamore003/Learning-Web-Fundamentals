// src/components/chat/MessageInput.jsx
import { useState, useRef } from "react";
import { Send, Paperclip, Loader2, X } from "lucide-react";
import api from "../../lib/axios";
import { uploadToS3 } from "../../utils/s3Upload";

const MessageInput = ({ conversationId, onMessageSent }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 25 * 1024 * 1024) {
      alert("File is too large. Maximum size is 25MB.");
      return;
    }

    setFile(selected);
    e.target.value = ""; // Reset input
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !file) || !conversationId || sending || uploading)
      return;

    setSending(true);

    try {
      let messageType = "TEXT";
      let attachmentData = null;

      // 1. If there's a file, upload it to S3 first and prepare metadata
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

      // 2. Send both the text (content) and the attachment data to the backend
      const res = await api.post("/messages", {
        conversationId,
        content: text.trim(),
        message_type: messageType,
        attachment: attachmentData,
      });

      onMessageSent(res.data.message);
      setText("");
      setFile(null);
    } catch (err) {
      console.error("Failed to send message", err);
      alert(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  const clearFile = () => setFile(null);

  return (
    <form
      onSubmit={handleSend}
      className="border-t border-slate-200/60 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60"
    >
      {file && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          <span className="truncate max-w-[200px] font-medium">
            {file.name}
          </span>
          <button
            type="button"
            onClick={clearFile}
            className="rounded-full p-1 hover:bg-blue-100 dark:hover:bg-blue-800"
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
          className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={file ? "Add a caption..." : "Type a message..."}
          disabled={sending || uploading}
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20"
        />

        <button
          type="submit"
          disabled={(!text.trim() && !file) || sending || uploading}
          className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {sending || uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
