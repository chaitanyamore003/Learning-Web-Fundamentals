// src/components/home/CTASection.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CTASection() {
  const { user, loading } = useAuth();
  const isAuthed = Boolean(user);

  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-7 py-16 text-center text-white shadow-[0_30px_90px_-35px_rgba(37,99,235,0.65)] sm:px-14 sm:py-20">
        {/* Top hairline shimmer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />

        <div className="relative mx-auto max-w-2xl">
          {/* Icon */}
          <span
            className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur transition-all duration-700 ease-out ${
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <MessageCircle className="h-5 w-5" />
          </span>

          <p
            className={`mt-6 text-xs font-bold uppercase tracking-[0.22em] text-blue-100 transition-all delay-100 duration-700 ease-out ${
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {isAuthed
              ? "Pick up where you left off"
              : "Your next conversation starts here"}
          </p>

          <h2
            className={`mt-4 text-balance text-3xl font-extrabold tracking-[-0.04em] transition-all delay-200 duration-700 ease-out sm:text-5xl ${
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {isAuthed
              ? `Welcome back, ${(user.name || "friend").split(" ")[0]}.`
              : "Someone's waiting to hear from you."}
          </h2>

          <p
            className={`mx-auto mt-5 max-w-xl text-sm leading-7 text-blue-100 transition-all delay-300 duration-700 ease-out sm:text-base ${
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {isAuthed
              ? "Your conversations are right where you left them — jump back in."
              : "Create your account and bring your conversations a little closer together."}
          </p>

          {loading ? (
            <div className="mx-auto mt-9 h-12 w-40 animate-pulse rounded-full bg-white/30" />
          ) : (
            <div
              className={`mt-9 transition-all delay-[400ms] duration-700 ease-out ${
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <Link
                to={isAuthed ? "/chat" : "/signup"}
                className="cta-btn group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl"
              >
                <span className="relative z-10">
                  {isAuthed ? "Open chat" : "Get started"}
                </span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
