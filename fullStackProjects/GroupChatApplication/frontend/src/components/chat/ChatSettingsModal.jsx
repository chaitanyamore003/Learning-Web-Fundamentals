// src/components/chat/ChatSettingsModal.jsx
import { useState, useRef, useEffect } from "react";
import {
  X,
  Camera,
  Loader2,
  Trash2,
  Save,
  Shield,
  UserPlus,
  UserMinus,
  LogOut,
} from "lucide-react";
import api from "../../lib/axios";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { useAuth } from "../../context/AuthContext";

const ChatSettingsModal = ({
  activeChat,
  onClose,
  onChatDeleted,
  onChatUpdated,
}) => {
  const { user: currentUser } = useAuth();
  const isGroup = activeChat?.type === "GROUP";
  const isAdmin = activeChat?.myRole === "ADMIN";

  // State for Group Editing
  const [name, setName] = useState(activeChat?.name || "");
  const [groupImage, setGroupImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(activeChat?.avatar || "");
  const fileInputRef = useRef(null);

  // Member management state
  const [members, setMembers] = useState(activeChat?.members || []);
  const [showAddMember, setShowAddMember] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // UI States
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch all users for the "Add Member" panel
  useEffect(() => {
    if (showAddMember) {
      setLoadingUsers(true);
      api
        .get("/users/all")
        .then((res) => {
          // Filter out users already in the group
          const memberIds = members.map((m) => m.id);
          setAllUsers(res.data.users.filter((u) => !memberIds.includes(u.id)));
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingUsers(false));
    }
  }, [showAddMember, members]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGroupImage(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  // Save Changes (Name & Image)
  const handleSaveChanges = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      let imageUrl = activeChat.avatar;

      if (groupImage) {
        const uploaded = await uploadToCloudinary(groupImage, "said-hi/groups");
        imageUrl = uploaded.secure_url;
      }

      const res = await api.put(`/conversations/${activeChat.id}`, {
        name: isAdmin ? name : undefined, // Only send name if admin
        group_image: imageUrl,
      });

      onChatUpdated({
        ...activeChat,
        name: res.data.conversation.name,
        avatar: res.data.conversation.group_image,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update group.");
    } finally {
      setSaving(false);
    }
  };

  // Delete or Leave Group
  const handleDelete = async () => {
    const confirmMessage = isAdmin
      ? "Are you sure you want to delete this group for everyone?"
      : "Are you sure you want to leave this group?";

    if (!window.confirm(confirmMessage)) return;

    setDeleting(true);
    try {
      if (isAdmin) {
        await api.delete(`/conversations/${activeChat.id}`);
      } else {
        await api.delete(
          `/conversations/${activeChat.id}/members/${currentUser.id}`,
        );
      }
      onChatDeleted(activeChat.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Action failed.");
      setDeleting(false);
    }
  };

  // Add a member
  const handleAddMember = async (userId) => {
    try {
      await api.post(`/conversations/${activeChat.id}/members`, { userId });
      const userToAdd = allUsers.find((u) => u.id === userId);
      setMembers([...members, { ...userToAdd, role: "MEMBER" }]);
      setAllUsers(allUsers.filter((u) => u.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    }
  };

  // Remove a member
  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the group?")) return;
    try {
      await api.delete(`/conversations/${activeChat.id}/members/${userId}`);
      setMembers(members.filter((m) => m.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#09090b]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isGroup ? "Group Settings" : "Chat Settings"}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isGroup ? (
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl font-bold text-slate-400">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Click to change group icon
                </p>
              </div>

              {/* Group Name Input (Admin only) */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Group Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isAdmin}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Admin Info */}
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                <Shield className="h-4 w-4 shrink-0" />
                <p>
                  Created by{" "}
                  <span className="font-semibold">
                    {activeChat.creatorName || "Admin"}
                  </span>
                </p>
              </div>

              {/* Members List */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Members ({members.length})
                  </h3>
                  {isAdmin && (
                    <button
                      onClick={() => setShowAddMember(!showAddMember)}
                      className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <UserPlus className="h-3.5 w-3.5" /> Add Member
                    </button>
                  )}
                </div>

                {/* Add Member Panel */}
                {showAddMember && isAdmin && (
                  <div className="mb-4 rounded-xl border border-slate-200 p-2 dark:border-slate-800">
                    {loadingUsers ? (
                      <div className="flex justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : allUsers.length === 0 ? (
                      <p className="text-xs text-center text-slate-500 p-2">
                        No users available to add.
                      </p>
                    ) : (
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {allUsers.map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center justify-between p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                          >
                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                              {u.name}
                            </span>
                            <button
                              onClick={() => handleAddMember(u.id)}
                              className="cursor-pointer text-xs font-bold text-blue-600 hover:underline"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* List */}
                <div className="space-y-2">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                          {m.avatar ? (
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-xs font-bold text-slate-500">
                              {m.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {m.name}
                          </span>
                          {m.role === "ADMIN" && (
                            <span className="text-[10px] font-bold text-blue-600 uppercase">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Member Button (Admin only) */}
                      {isAdmin && m.id !== currentUser.id && (
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="cursor-pointer rounded-full p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          title="Remove member"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You cannot edit a direct chat.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 dark:border-slate-800 shrink-0">
          {isGroup && (
            <button
              onClick={handleSaveChanges}
              disabled={(!name.trim() && isAdmin) || saving || deleting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={saving || deleting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isAdmin || !isGroup ? (
              <Trash2 className="h-4 w-4" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isGroup
              ? isAdmin
                ? "Delete Group"
                : "Leave Group"
              : "Delete Chat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingsModal;
