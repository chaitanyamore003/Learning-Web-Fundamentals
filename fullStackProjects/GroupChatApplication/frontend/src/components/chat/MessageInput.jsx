// src/components/chat/MessageInput.jsx
import { Paperclip, Smile, Send } from "lucide-react";

const MessageInput = () => {
  return (
    <div className="border-t border-slate-200/60 bg-white/60 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60">
      <div className="flex items-end gap-2">
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <Paperclip className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <Smile className="h-5 w-5" />
        </button>

        <div className="flex flex-1 items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 dark:text-white"
          />
        </div>

        <button className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700">
          <Send className="ml-0.5 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
