// src/components/home/FeaturesSection.jsx
import { useEffect, useRef, useState } from "react";
import { features } from "./homeData";

export default function FeaturesSection() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      {/* Decorative background orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-500/10" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-400/10" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-600 transition-all duration-700 ease-out dark:text-blue-400 ${
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <span className="h-px w-6 bg-blue-600 dark:bg-blue-400" />
              Built for the future
            </p>
            <h2
              className={`mt-4 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-3xl font-extrabold tracking-[-0.04em] text-transparent transition-all delay-100 duration-700 ease-out dark:from-white dark:via-slate-100 dark:to-blue-200 sm:text-4xl md:text-5xl ${
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Everything you need to stay close.
            </h2>
          </div>
          <p
            className={`max-w-md text-sm leading-7 text-slate-600 transition-all delay-200 duration-700 ease-out dark:text-slate-400 sm:text-base ${
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            From AI-powered suggestions to lightning-fast real-time connections,
            discover the tools that make your conversations effortless.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, tag }, index) => (
            <article
              key={title}
              style={{ transitionDelay: `${300 + index * 90}ms` }}
              className={`group relative overflow-hidden rounded-2xl border border-white/80 bg-white/65 p-6 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-all duration-700 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_45px_-25px_rgba(37,99,235,0.35)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:hover:border-blue-400/30 sm:p-7 ${
                inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {/* Hover glow */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-400/0 blur-3xl transition-all duration-500 group-hover:bg-blue-400/20 dark:group-hover:bg-blue-500/20" />

              {/* Hover top accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent transition-all duration-500 group-hover:via-blue-500/70" />

              <div className="relative mb-6 flex items-center justify-between">
                <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:border-transparent group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 dark:group-hover:bg-blue-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-base font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {description}
              </p>

              <p className="relative mt-6 inline-block text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                {tag}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-blue-600 transition-all duration-300 group-hover:w-full dark:bg-blue-400" />
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
