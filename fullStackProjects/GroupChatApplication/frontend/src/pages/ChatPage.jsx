// src/pages/ChatPage.jsx
import { useState } from "react";
import SidebarNav from "../components/layout/SidebarNav";
import ChatListPanel from "../components/chat/ChatListPanel";
import ChatWindow from "../components/chat/ChatWindow";
import DiscoverPanel from "../components/chat/DiscoverPanel";

const ChatPage = () => {
  // 1. New state to control which middle panel is visible
  const [activeTab, setActiveTab] = useState("chats"); // "chats" | "groups" | "people"

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setShowMobileChat(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8faff] font-sans text-slate-900 dark:bg-[#080b14] dark:text-white">
      {/* Left Rail: Pass the activeTab and setter down */}
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Middle Panel: Render based on activeTab */}
      {(activeTab === "chats" || activeTab === "groups") && (
        <ChatListPanel
          chats={chats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          showMobileChat={showMobileChat}
        />
      )}

      {activeTab === "people" && (
        <DiscoverPanel onChatSelect={handleChatSelect} />
      )}

      {/* Right Panel: Chat Window */}
      {activeChat ? (
        <ChatWindow
          activeChat={activeChat}
          showMobileChat={showMobileChat}
          onBack={() => setShowMobileChat(false)}
        />
      ) : (
        <div className="hidden flex-1 flex-col items-center justify-center bg-slate-50/50 dark:bg-[#080b14] md:flex">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Your messages
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Select a conversation or find new people to chat with.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
