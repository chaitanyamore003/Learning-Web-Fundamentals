// src/components/home/HowItWorksSection.jsx
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { steps } from "./homeData";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
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
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export default function HowItWorksSection() {
  const { user, loading } = useAuth();
  const isAuthed = Boolean(user);
  const [sectionRef, sectionInView] = useInView(0.2);

  return (
    <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div
        ref={sectionRef}
        className={`mx-auto max-w-6xl rounded-[2rem] border border-slate-200/70 bg-white/60 p-7 backdrop-blur-xl transition-all duration-700 ease-out dark:border-white/[0.08] dark:bg-white/[0.03] sm:p-12 lg:p-16 ${
          sectionInView
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Getting started
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
            A simpler way to <span className="text-blue-600">say hi.</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Getting into a conversation should be the easiest part of your day.
          </p>
          {/* Accent line that grows in */}
          <div
            className={`mx-auto mt-6 h-[2px] rounded-full bg-blue-600 transition-all duration-700 ease-out ${
              sectionInView ? "w-16 opacity-100" : "w-0 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          />
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connector line behind the icon chips (desktop) */}
          <div className="absolute left-[16%] right-[16%] top-6 hidden h-px bg-slate-200 dark:bg-white/10 md:block" />
          <div
            className={`absolute left-[16%] right-[16%] top-6 hidden h-px origin-left bg-blue-600 transition-transform duration-1000 ease-out md:block ${
              sectionInView ? "scale-x-100" : "scale-x-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map(({ number, icon: Icon, title, description }, index) => (
              <div
                key={number}
                className={`group relative text-center transition-all duration-700 ease-out ${
                  sectionInView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: sectionInView
                    ? `${400 + index * 200}ms`
                    : "0ms",
                }}
              >
                {/* Icon chip with number badge */}
                <div className="relative mx-auto w-fit">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-blue-600/40">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-bold text-blue-600 ring-1 ring-blue-600/30 dark:bg-slate-900 dark:text-blue-400 dark:ring-blue-400/30">
                    {number.replace(/^0/, "")}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mx-auto mt-2 max-w-[260px] text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`mt-14 flex justify-center transition-all duration-700 ease-out ${
            sectionInView
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: sectionInView ? "1000ms" : "0ms" }}
        >
          {loading ? (
            <div className="h-11 w-44 animate-pulse rounded-full bg-blue-600/20" />
          ) : (
            <Link
              to={isAuthed ? "/chat" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
            >
              {isAuthed ? "Go to your chats" : "Create your account"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
