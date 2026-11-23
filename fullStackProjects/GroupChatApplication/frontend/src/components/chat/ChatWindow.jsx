import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Loader2, Settings2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import api from "../../lib/axios";
import { useSocket } from "../../context/SocketContext";

const ChatWindow = ({ activeChat, showMobileChat, onBack, onEditClick }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  // Join and leave conversation rooms
  useEffect(() => {
    if (!socket || !activeChat?.id) return;

    const conversationId = activeChat.id;

    const joinRoom = () => {
      console.log("Joining conversation:", conversationId);
      socket.emit("join_conversation", conversationId);
    };

    const leaveRoom = () => {
      console.log("Leaving conversation:", conversationId);
      socket.emit("leave_conversation", conversationId);
    };

    // Join immediately if already connected
    if (socket.connected) {
      joinRoom();
    }

    // Rejoin automatically after reconnection
    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);

      if (socket.connected) {
        leaveRoom();
      }
    };
  }, [socket, activeChat?.id]);

  // Fetch messages whenever active chat changes
  useEffect(() => {
    if (!activeChat?.id) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    const fetchMessages = async () => {
      setMessages([]);
      setLoading(true);

      try {
        const res = await api.get(`/messages/${activeChat.id}`);

        if (!cancelled) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load messages", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [activeChat?.id]);

  // Listen for incoming real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (String(message.conversation_id) !== String(activeChat?.id)) {
        return;
      }

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === message.id)) {
          return prev;
        }

        return [...prev, message];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, activeChat?.id]);

  // Handle messages sent by current user
  const handleMessageSent = (newMessage) => {
    setMessages((prev) => {
      if (prev.some((msg) => msg.id === newMessage.id)) {
        return prev;
      }

      return [...prev, newMessage];
    });
  };

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

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

          {activeChat?.avatar ? (
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {activeChat?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}

          <div>
            <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              {activeChat?.name || "Chat"}
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              {activeChat?.online ? "Online" : "Last seen recently"}
            </p>
          </div>
        </div>

        <button
          onClick={onEditClick}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
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

        <div className="relative z-10 flex h-full flex-col gap-2">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
              <div className="mb-4 rounded-full bg-slate-200/80 px-4 py-2 text-[13px] font-medium text-slate-600 backdrop-blur-sm dark:bg-slate-800/80 dark:text-slate-300">
                No messages yet
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Say hi to {activeChat?.name?.split(" ")[0] || "them"} to start
                the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput
        conversationId={activeChat?.id}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default ChatWindow;
