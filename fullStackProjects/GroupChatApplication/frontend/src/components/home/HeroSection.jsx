// src/components/home/HeroSection.jsx
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  Zap,
  Globe,
  Users,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const tickerItems = [
  { icon: Sparkles, text: "AI-powered smart replies" },
  { icon: Zap, text: "Lightning-fast WebSockets" },
  { icon: MessageCircle, text: "Real-time typing indicators" },
  { icon: ImageIcon, text: "Seamless media sharing" },
  { icon: ShieldCheck, text: "Secure & private chats" },
];

export default function HeroSection() {
  const { user, loading } = useAuth();
  const isAuthed = Boolean(user);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden px-5 pb-0 pt-32 sm:px-8 sm:pt-40 lg:pt-44"
    >
      {/* ── Aurora mesh background ─────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-[#05070f]">
        {/* Living aurora blobs */}
        <div className="absolute left-1/2 top-[-180px] h-[560px] w-[min(110%,1100px)] animate-[aurora_14s_ease-in-out_infinite] rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-gradient-to-br from-blue-500/25 via-indigo-500/20 to-cyan-400/20 blur-[100px] dark:from-blue-600/30 dark:via-indigo-600/25 dark:to-cyan-500/20" />
        <div className="absolute left-1/2 top-[60px] h-[420px] w-[min(70%,700px)] animate-[aurora-2_18s_ease-in-out_infinite] rounded-[60%_40%_45%_55%/55%_60%_40%_45%] bg-gradient-to-tr from-violet-500/15 via-blue-400/15 to-fuchsia-400/10 blur-[90px]" />

        {/* Gradient hairline top edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* Grid with radial fade */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 28%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 28%, black, transparent)",
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.25]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Bottom fade into next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-[#05070f]" />
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-5xl text-center">
        {/* Live-status badge */}
        <div className="text-blue-600 mb-10 inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 py-1.5 pl-3 pr-4 text-xs font-medium shadow-[0_2px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
          <span className="h-2 w-2 animate-[pulse-dot_2.2s_ease-in-out_infinite] rounded-full bg-emerald-500" />
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          Real-time, AI-driven, and secure.
        </div>

        {/* Heading with animated gradient word */}
        <h1 className="text-balance text-[3.2rem] font-extrabold leading-[1.0] tracking-[-0.06em] text-slate-950 dark:text-white sm:text-6xl md:text-7xl lg:text-[6.2rem]">
          {isAuthed ? (
            <>
              Welcome back
              <br />
              <span className="text-blue-600">
                {(user.name || "friend").split(" ")[0]}.
              </span>
            </>
          ) : (
            <>
              Good things start
              <br />
              with a{" "}
              <span className="relative inline-block">
                {/* Animated gradient text */}
                <span className="text-blue-600">Hi.</span>
                {/* Hand-drawn underline stroke */}
                <svg
                  className="absolute -bottom-2 left-0 w-full text-blue-600"
                  viewBox="0 0 120 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9 C 30 3, 60 3, 117 7"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </>
          )}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-9 max-w-xl text-pretty text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
          {isAuthed
            ? "Your conversations are waiting. Get smart AI replies, share media instantly, and pick up right where you left off."
            : "More than just messages. Share media, get AI-powered replies, and stay connected to the people who make every day better."}
        </p>

        {/* CTAs */}
        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {loading ? (
            <div className="h-13 w-52 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
          ) : (
            <Link
              to={isAuthed ? "/chat" : "/signup"}
              className="group relative inline-flex min-h-[52px] items-center justify-center gap-2.5 overflow-hidden rounded-full bg-blue-600 px-9 py-3.5 text-sm font-semibold text-white shadow-[0_10px_36px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(37,99,235,0.4)] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 dark:bg-white dark:text-slate-950"
            >
              {/* Shine sweep on hover */}
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-y-0 w-1/3 animate-[shine_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </span>
              {isAuthed ? "Continue to chat" : "Get started for free"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}

          <a
            href="#preview"
            className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-white/60 px-9 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            Explore the experience
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 transition-transform duration-300 group-hover:scale-150" />
          </a>
        </div>
      </div>

      {/* ── Marquee ticker ─────────────────────────────────── */}
      <div className="relative mt-20 -mx-5 border-y border-slate-200/70 bg-white/50 py-4 backdrop-blur-sm dark:border-white/[0.07] dark:bg-white/[0.02] sm:mt-24 sm:-mx-8">
        {/* Edge fades — full width, zero fade in the middle */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,#f8fafc_0%,transparent_14%,transparent_86%,#f8fafc_100%)] dark:bg-[linear-gradient(to_right,#05070f_0%,transparent_14%,transparent_86%,#05070f_100%)]" />

        <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-14 pr-14 hover:[animation-play-state:paused]">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map(
            ({ icon: Icon, text }, i) => (
              <span
                key={i}
                className="flex items-center gap-2.5 whitespace-nowrap text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400"
              >
                <Icon className="h-3.5 w-3.5 text-blue-500/80" />
                {text}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
