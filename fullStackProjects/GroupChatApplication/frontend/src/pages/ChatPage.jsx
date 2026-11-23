// src/pages/ChatPage.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarNav from "../components/layout/SidebarNav";
import ChatListPanel from "../components/chat/ChatListPanel";
import ChatWindow from "../components/chat/ChatWindow";
import DiscoverPanel from "../components/chat/DiscoverPanel";
import { startDirectConversation } from "../api/conversations";
import api from "../lib/axios"; // Added import

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Added loading state
  const [loadingChats, setLoadingChats] = useState(true);

  const location = useLocation();

  // 1. Fetch the user's conversations when the page loads
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/conversations");
        setChats(res.data.conversations);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, []);

  // 2. If redirected from ProfilePage, open the specific chat and add to list if missing
  useEffect(() => {
    if (location.state?.openConversation) {
      const newChat = location.state.openConversation;

      setActiveChat(newChat);
      setShowMobileChat(true);
      setActiveTab("chats");

      // Add to chats list if it's a brand new conversation
      setChats((prev) => {
        if (!prev.find((c) => c.id === newChat.id)) {
          return [newChat, ...prev];
        }
        return prev;
      });
    }
  }, [location.state]);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setShowMobileChat(true);
  };

  // Called when clicking "Message" in DiscoverPanel
  const handleStartChat = async (targetUser) => {
    try {
      const data = await startDirectConversation(targetUser.id);

      const newChat = {
        id: data.conversation.id,
        name: data.targetUser.name,
        avatar: data.targetUser.profile_picture,
        targetUserId: data.targetUser.id,
        lastMessage: "No messages yet",
        time: "",
        online: false,
      };

      setChats((prev) => {
        if (!prev.find((c) => c.id === newChat.id)) {
          return [newChat, ...prev];
        }
        return prev;
      });

      handleChatSelect(newChat);
    } catch (err) {
      console.error("Failed to start chat", err);
      alert("Failed to start conversation.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8faff] font-sans text-slate-900 dark:bg-[#080b14] dark:text-white">
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {(activeTab === "chats" || activeTab === "groups") && (
        <ChatListPanel
          chats={chats}
          loading={loadingChats} // Pass the loading state down
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          showMobileChat={showMobileChat}
        />
      )}

      {activeTab === "people" && (
        <DiscoverPanel onStartChat={handleStartChat} />
      )}

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
