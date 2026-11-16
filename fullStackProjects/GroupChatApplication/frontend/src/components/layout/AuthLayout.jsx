// src/components/layout/AuthLayout.jsx
import { Link } from "react-router-dom";
import { MessageCircle, CheckCircle2 } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900 dark:bg-[#080b14] dark:text-white">
      {/* ========================================= */}
      {/* LEFT SIDE - APP INFO (Hidden on Mobile)   */}
      {/* ========================================= */}
      <div className="relative hidden w-1/2 flex-col overflow-hidden bg-[#f8faff] p-12 dark:bg-[#0c0c10] lg:flex xl:p-16">
        {/* Background Effects (Glows & Grid) */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-48 left-[15%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[130px] dark:bg-blue-600/10" />
          <div className="absolute bottom-[-100px] right-[-100px] h-[450px] w-[450px] rounded-full bg-purple-400/20 blur-[140px] dark:bg-purple-600/10" />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 transition hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-4xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tighter">
              Said Hi<span className="text-blue-600">.</span>
            </span>
          </Link>
        </div>

        {/* Middle: Value Proposition (Centered Vertically) */}
        <div className="relative z-10 my-auto max-w-md">
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tighter text-slate-900 dark:text-white sm:text-5xl xl:text-[3.5rem]">
            Connect with the <br />
            people who matter.
          </h1>

          <p className="mt-5 text-[16px] font-medium leading-relaxed text-slate-600 dark:text-slate-400">
            Experience messaging designed to make every conversation feel
            effortless. Join Said Hi and start connecting today.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Lightning-fast real-time messaging",
              "Secure group conversations",
              "Share images, videos & documents",
            ].map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-[15px] font-medium text-slate-600 dark:text-slate-300"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT SIDE - AUTH FORM                    */}
      {/* ========================================= */}
      <div className="relative flex w-full flex-col items-center justify-center bg-slate-50 p-6 dark:bg-[#080b14] sm:p-12 lg:w-1/2">
        {/* Mobile Header */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-center p-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <MessageCircle className="h-4 w-4" />
            </div>
            <span className="text-lg font-extrabold tracking-tighter text-slate-900 dark:text-white">
              Said Hi<span className="text-blue-600">.</span>
            </span>
          </Link>
        </div>

        {/* The White Form Card */}
        <div className="relative z-10 w-full max-w-md mt-12 lg:mt-0">
          {/* Subtle glow behind the card */}
          <div className="absolute inset-0 -z-10 translate-y-4 rounded-[2.5rem] bg-blue-500/10 blur-[60px] dark:bg-blue-500/5" />

          <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-[#121217] dark:shadow-black/40 sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
