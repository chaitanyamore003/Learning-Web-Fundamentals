// src/components/home/HeroSection.jsx
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const assurances = ["Simple to use", "Stay in sync", "Made for conversations"];

export default function HeroSection() {
  const { user, loading } = useAuth();
  const isAuthed = Boolean(user);

  return (
    <section
      id="home"
      className="relative scroll-mt-24 px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:pt-44"
    >
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/75 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-900/5 backdrop-blur-xl dark:border-blue-400/20 dark:bg-blue-500/[0.08] dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />A better way to stay connected
        </div>

        <h1 className="text-balance text-5xl font-extrabold leading-[1.04] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
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
              A little hello.
              <br />A lot of{" "}
              <span className="bg-gradient-to-r bg-blue-600 bg-clip-text text-transparent">
                connection.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
          {isAuthed
            ? "Your conversations are waiting. Pick up where you left off — or start something new."
            : "Good conversations make a difference. Say hello, share moments, and stay close to the people who matter with a messaging experience that feels effortless."}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {/* Primary CTA — swaps with auth state. Skeleton while loading
              to avoid a flash of the wrong destination on refresh. */}
          {loading ? (
            <div className="h-12 w-44 animate-pulse rounded-full bg-blue-600/30" />
          ) : isAuthed ? (
            <Link
              to="/chat"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25"
            >
              Continue to chat
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              to="/signup"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25"
            >
              Start chatting
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <a
            href="#preview"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200/90 bg-white/70 px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-blue-400/40 dark:hover:text-blue-300"
          >
            Explore the experience
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {assurances.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                <Check className="h-2.5 w-2.5" />
              </span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-[min(90vw,850px)] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400/20 via-violet-400/20 to-cyan-300/20 blur-[100px]" />
    </section>
  );
}
