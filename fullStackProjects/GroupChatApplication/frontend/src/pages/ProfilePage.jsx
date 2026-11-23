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
import Navbar from "../components/common/Navbar"; // Fixed import path

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // The logged-in user

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // If the user is trying to view their own profile, send them to Settings
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

  const handleMessage = () => {
    // We will wire this up to the "Create Conversation" API next!
    alert(`Creating conversation with ${profileUser.name}...`);
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

  // Format "Last seen"
  const lastSeenText = profileUser.last_seen
    ? new Date(profileUser.last_seen).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "A while ago";

  return (
    <div className="min-h-screen bg-[#f7f9ff] pb-20 font-sans text-slate-900 dark:bg-[#080b14] dark:text-white">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 pt-28">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Main Profile Card */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/70 shadow-2xl shadow-slate-200/20 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/70 dark:shadow-black/40">
          {/* Cover Banner */}
          <div className="h-40 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-90 dark:opacity-70" />

          <div className="px-6 pb-10 text-center sm:px-12">
            {/* Avatar */}
            <div className="-mt-20 mb-5 flex justify-center">
              <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl dark:border-[#09090b] dark:bg-slate-800">
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
            </div>

            {/* Name & Status */}
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {profileUser.name}
            </h1>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              Last seen {lastSeenText}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={handleMessage}
                className="inline-flex w-full max-w-[250px] cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" /> Send Message
              </button>
            </div>

            {/* Info Section */}
            <div className="mt-10 grid gap-4 rounded-2xl bg-slate-50/80 p-6 text-left dark:bg-slate-900/60 sm:grid-cols-2">
              {/* Phone */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone
                  </p>
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {profileUser.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </p>
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {profileUser.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
