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
      className="relative isolate overflow-hidden px-5 pb-28 pt-36 sm:px-8 sm:pb-36 sm:pt-44 lg:pt-48"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Focused spotlight */}
        <div className="absolute left-1/2 top-[-100px] h-[520px] w-[min(100%,1000px)] -translate-x-1/2 rounded-full bg-blue-500/[0.12] blur-[130px] dark:bg-blue-500/[0.18]" />

        {/* Inner indigo glow */}
        <div className="absolute left-1/2 top-[40px] h-[380px] w-[min(80%,700px)] -translate-x-1/2 rounded-full bg-indigo-400/[0.10] blur-[110px] dark:bg-indigo-500/[0.13]" />

        {/* Subtle cyan highlight */}
        <div className="absolute left-1/2 top-[100px] h-[220px] w-[min(55%,500px)] -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-[90px] dark:bg-cyan-400/[0.08]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 55% 45% at 50% 30%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 45% at 50% 30%, black, transparent)",
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative mx-auto max-w-5xl text-center">
        {/* Eyebrow */}
        <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/75 px-4 py-2 text-xs font-semibold text-blue-700 shadow-[0_4px_20px_rgba(37,99,235,0.07)] backdrop-blur-xl dark:border-blue-400/20 dark:bg-blue-500/[0.08] dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          Conversations, made better.
        </div>

        {/* Heading */}
        <h1 className="text-balance text-[3.5rem] font-extrabold leading-[1.02] tracking-[-0.065em] text-slate-950 sm:text-6xl md:text-7xl lg:text-[6rem] dark:text-white">
          {isAuthed ? (
            <>
              Welcome back
              <br />
              <span className="text-blue-600 ">
                {(user.name || "friend").split(" ")[0]}.
              </span>
            </>
          ) : (
            <>
              Good things start
              <br />
              with a <span className="text-blue-600">Hi.</span>
            </>
          )}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
          {isAuthed
            ? "Your conversations are waiting. Pick up where you left off — or start something new."
            : "More than just messages. Share moments, exchange ideas, and stay close to the people who make every day better."}
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {loading ? (
            <div className="h-12 w-48 animate-pulse rounded-full bg-blue-600/30" />
          ) : (
            <Link
              to={isAuthed ? "/chat" : "/signup"}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.28)] transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-[0_12px_40px_rgba(37,99,235,0.38)] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25"
            >
              {isAuthed ? "Continue to chat" : "Get started for free"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <a
            href="#preview"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200/90 bg-white/70 px-8 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-blue-400/40 dark:hover:text-blue-300"
          >
            Explore the experience
          </a>
        </div>

        {/* Assurances */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
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
    </section>
  );
}
