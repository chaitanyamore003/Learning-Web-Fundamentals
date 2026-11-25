// src/components/chat/CreateGroupModal.jsx
import { useEffect, useState, useRef } from "react";
import { X, Search, Loader2, Check, Camera } from "lucide-react";
import api from "../../lib/axios";
// 1. CHANGED IMPORT HERE
import { uploadToS3 } from "../../utils/s3Upload";

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Image states
  const [groupImage, setGroupImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch ALL users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError(err.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleUser = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be 5 MB or smaller");
      return;
    }

    setGroupImage(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = ""; // Reset input so same file can be selected again
  };

  const handleCreate = async () => {
    if (!name.trim() || selectedIds.length === 0) return;
    setCreating(true);

    try {
      let imageUrl = null;
      let imagePublicId = null;

      // 2. CHANGED UPLOAD LOGIC HERE (and folder name to "groups")
      if (groupImage) {
        const uploaded = await uploadToS3(groupImage, "groups");
        imageUrl = uploaded.secure_url;
        imagePublicId = uploaded.public_id;
      }

      // Create the group in the database
      const res = await api.post("/conversations/group", {
        name,
        memberIds: selectedIds,
        group_image: imageUrl,
        group_image_public_id: imagePublicId,
      });

      onGroupCreated(res.data.conversation);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#09090b]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Create New Group
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Group Image & Name */}
        <div className="flex items-center gap-4 border-b border-slate-200 p-4 dark:border-slate-800">
          {/* Image Upload Circle */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 transition hover:bg-slate-200 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="h-6 w-6 text-slate-400 transition group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Group Name Input */}
          <input
            type="text"
            placeholder="Group Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* User Search */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* User List */}
        <div className="min-h-[200px] max-h-[300px] flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-red-500">
              {error}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-slate-500">
              {users.length === 0
                ? "No users exist."
                : "No users match your search."}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className="flex cursor-pointer items-center justify-between rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-100">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-xs font-bold text-blue-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div
                  className={`grid h-5 w-5 place-items-center rounded border ${selectedIds.includes(user.id) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}
                >
                  {selectedIds.includes(user.id) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            onClick={handleCreate}
            disabled={!name.trim() || selectedIds.length === 0 || creating}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create Group ({selectedIds.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
