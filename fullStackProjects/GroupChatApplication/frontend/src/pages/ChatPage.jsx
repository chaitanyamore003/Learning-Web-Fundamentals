// src/pages/ChatPage.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarNav from "../components/layout/SidebarNav";
import ChatListPanel from "../components/chat/ChatListPanel";
import ChatWindow from "../components/chat/ChatWindow";
import ChatSettingsModal from "../components/chat/ChatSettingsModal";
import DiscoverPanel from "../components/chat/DiscoverPanel";
import CreateGroupModal from "../components/chat/CreateGroupModal";
import { startDirectConversation } from "../api/conversations";
import api from "../lib/axios";

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);

  // Modals state
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        const type = activeTab === "chats" ? "DIRECT" : "GROUP";
        const res = await api.get(`/conversations?type=${type}`);
        setChats(res.data.conversations);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoadingChats(false);
      }
    };

    if (activeTab === "chats" || activeTab === "groups") {
      fetchChats();
    }
  }, [activeTab]);

  useEffect(() => {
    if (location.state?.openConversation) {
      const newChat = location.state.openConversation;
      setActiveChat(newChat);
      setShowMobileChat(true);
      setActiveTab("chats");

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

  const handleChatDeleted = (deletedChatId) => {
    setChats((prev) => prev.filter((c) => c.id !== deletedChatId));
    setActiveChat(null);
    setShowMobileChat(false);
  };

  const handleChatUpdated = (updatedChat) => {
    setChats((prev) =>
      prev.map((c) => (c.id === updatedChat.id ? updatedChat : c)),
    );
    setActiveChat(updatedChat);
  };

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
        type: "DIRECT",
        online: false,
      };

      setChats((prev) => {
        if (!prev.find((c) => c.id === newChat.id)) {
          return [newChat, ...prev];
        }
        return prev;
      });

      setActiveTab("chats");
      handleChatSelect(newChat);
    } catch (err) {
      console.error("Failed to start chat", err);
      alert("Failed to start conversation.");
    }
  };

  const handleGroupCreated = (conversation) => {
    const newGroupChat = {
      id: conversation.id,
      name: conversation.name,
      type: "GROUP",
      avatar: conversation.group_image || null,
      lastMessage: "Group created",
      time: "Just now",
    };
    setChats((prev) => [newGroupChat, ...prev]);
    handleChatSelect(newGroupChat);
  };

  // 👇 NEW: Handler for the "All" / "Groups" tabs inside ChatListPanel
  const handleChatListTabChange = (isGroup) => {
    setActiveTab(isGroup ? "groups" : "chats");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8faff] font-sans text-slate-900 dark:bg-[#080b14] dark:text-white">
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {(activeTab === "chats" || activeTab === "groups") && (
        <ChatListPanel
          chats={chats}
          loading={loadingChats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          showMobileChat={showMobileChat}
          onCreateGroup={() => setShowGroupModal(true)}
          isGroupTab={activeTab === "groups"}
          onTabChange={handleChatListTabChange} // 👈 Wire up the tab change
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
          onEditClick={() => setShowSettingsModal(true)}
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

      {/* Create Group Modal */}
      {showGroupModal && (
        <CreateGroupModal
          onClose={() => setShowGroupModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}

      {/* Chat Settings Modal */}
      {showSettingsModal && activeChat && (
        <ChatSettingsModal
          activeChat={activeChat}
          onClose={() => setShowSettingsModal(false)}
          onChatDeleted={handleChatDeleted}
          onChatUpdated={handleChatUpdated}
        />
      )}
    </div>
  );
};

export default ChatPage;
