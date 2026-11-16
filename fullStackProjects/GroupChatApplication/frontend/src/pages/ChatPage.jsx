// src/pages/ChatPage.jsx
import { useState } from "react";
import SidebarNav from "../components/layout/SidebarNav";
import ChatListPanel from "../components/chat/ChatListPanel";
import ChatWindow from "../components/chat/ChatWindow";
import { CHATS } from "../data/mockChats";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setShowMobileChat(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8faff] font-sans text-slate-900 dark:bg-[#080b14] dark:text-white">
      {/* 1. Left Navigation Rail */}
      <SidebarNav />

      {/* 2. Chat List Pane */}
      <ChatListPanel
        chats={CHATS}
        activeChat={activeChat}
        onChatSelect={handleChatSelect}
        showMobileChat={showMobileChat}
      />

      {/* 3. Main Chat Window */}
      <ChatWindow
        activeChat={activeChat}
        showMobileChat={showMobileChat}
        onBack={() => setShowMobileChat(false)}
      />
    </div>
  );
};

export default ChatPage;
