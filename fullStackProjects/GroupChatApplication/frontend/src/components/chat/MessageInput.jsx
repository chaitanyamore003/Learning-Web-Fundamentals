import { useState } from "react";
import { Send } from "lucide-react";
import api from "../../lib/axios";

const MessageInput = ({ conversationId, onMessageSent }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() || !conversationId || sending) return;

    setSending(true);

    try {
      const res = await api.post("/messages", {
        conversationId,
        content: text.trim(),
      });

      onMessageSent(res.data.message);
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="border-t border-slate-200/60 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20"
        />

        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
