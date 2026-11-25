// src/pages/SettingsPage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// 1. CHANGED IMPORT HERE
import { uploadToS3 } from "../utils/s3Upload";
import api from "../lib/axios";
import Navbar from "../components/common/Navbar"; // Fixed path

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // 1. Update Profile Details
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/users/profile", { name, phone });
      setUser(res.data.user); // Instantly updates Navbar & Sidebar
      showMessage("success", "Profile updated successfully");
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      return showMessage("error", "New password must be at least 8 characters");
    }

    setLoading(true);
    try {
      await api.put("/users/password", { currentPassword, newPassword });
      showMessage("success", "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message || "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. Update Avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // 2. CHANGED UPLOAD LOGIC HERE (and folder name to "avatars")
      const { secure_url, public_id } = await uploadToS3(file, "avatars");

      // 3. Send URL + public_id to backend
      const res = await api.put("/users/avatar", { secure_url, public_id });

      setUser(res.data.user);
      showMessage("success", "Avatar updated!");
    } catch (err) {
      showMessage("error", "Failed to upload image");
    } finally {
      setLoading(false);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] pb-20 font-sans text-slate-900 dark:bg-[#080b14] dark:text-white">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 pt-28">
        <button
          onClick={() => navigate("/chat")}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Chats
        </button>

        <h1 className="text-3xl font-extrabold tracking-tight">My Account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage your account settings and preferences.
        </p>

        {message.text && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-8 space-y-6">
          {/* AVATAR SECTION */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60">
            <h2 className="text-lg font-bold">Profile Picture</h2>
            <div className="mt-4 flex items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-slate-100 dark:ring-slate-800">
                <img
                  src={
                    user?.profile_picture ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                      user?.name
                  }
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Upload new picture
                </button>
                <p className="mt-2 text-xs text-slate-500">
                  JPG, PNG or GIF. Max 5MB.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </section>

          {/* PROFILE DETAILS SECTION */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60">
            <h2 className="text-lg font-bold">Profile Details</h2>
            <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* PASSWORD SECTION */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/60">
            <h2 className="text-lg font-bold">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-black/20"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading || !currentPassword || !newPassword}
                  className="cursor-pointer rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Update Password
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
