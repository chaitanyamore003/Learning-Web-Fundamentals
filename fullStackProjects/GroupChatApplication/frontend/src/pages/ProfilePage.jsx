// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { startDirectConversation } from "../api/conversations";
import Navbar from "../components/common/Navbar";

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New state for the message button
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.id.toString() === userId.toString()) {
      navigate("/settings", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setProfileUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, currentUser, navigate]);

  const handleMessage = async () => {
    setStartingChat(true);
    try {
      const data = await startDirectConversation(profileUser.id);

      // Format the chat data for ChatPage
      const chatData = {
        id: data.conversation.id,
        name: data.targetUser.name,
        avatar: data.targetUser.profile_picture,
        targetUserId: data.targetUser.id,
      };

      // Navigate to chat and pass the conversation data
      navigate("/chat", { state: { openConversation: chatData } });
    } catch (err) {
      console.error(err);
      alert("Failed to start conversation. Please try again.");
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9ff] dark:bg-[#080b14]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-[#f7f9ff] dark:bg-[#080b14]">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 pt-32 text-center">
          <h2 className="text-2xl font-bold text-red-500">Oops!</h2>
          <p className="mt-2 text-slate-500">{error || "User not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-full bg-slate-900 px-6 py-2 text-white dark:bg-white dark:text-slate-900"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const lastSeenText = profileUser.last_seen
    ? new Date(profileUser.last_seen).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "A while ago";

  return (
    <div className="min-h-screen bg-[#f7f9ff] pb-20 font-sans text-slate-900 dark:bg-[#080b14] dark:text-white">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pt-28 sm:px-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* ── Left: Identity card ───────────────────────────── */}
          <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1019]">
            {/* Slim gradient accent */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="p-6">
              {/* Avatar */}
              <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-white/10">
                <img
                  src={
                    profileUser.profile_picture ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                      profileUser.name
                  }
                  alt={profileUser.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Name */}
              <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {profileUser.name}
              </h1>

              {/* Last seen */}
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                Last seen {lastSeenText}
              </p>

              {/* Divider */}
              <div className="my-6 h-px w-full bg-slate-100 dark:bg-white/5" />

              {/* Action */}
              <button
                onClick={handleMessage}
                disabled={startingChat}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 dark:focus-visible:ring-offset-[#0d1019]"
              >
                {startingChat ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                {startingChat ? "Opening..." : "Send Message"}
              </button>
            </div>
          </aside>

          {/* ── Right: Contact information ────────────────────── */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1019]">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-white/5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Contact information
              </h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {/* Phone */}
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Phone
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {profileUser.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Email
                  </p>
                  <p className="mt-0.5 break-all text-sm font-medium text-slate-900 dark:text-slate-100">
                    {profileUser.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
