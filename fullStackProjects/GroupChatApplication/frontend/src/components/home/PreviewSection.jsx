import { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { DesktopMockup, MobileMockup } from "./ChatMockups";

/* ── tiny hook: returns ref + inView flag (fires once) ── */
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

export default function PreviewSection() {
  const [headRef, headInView] = useInView(0.4);
  const [deskRef, deskInView] = useInView(0.15);
  const [mobRef, mobInView] = useInView(0.3);

  return (
    <section
      id="preview"
      className="relative scroll-mt-24 overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      {/* ── Ambient background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[min(90%,900px)] animate-[glow-breathe_9s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-cyan-400/10 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 55% at 50% 55%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 55% at 50% 55%, black, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* ── Section header ── */}
        <div
          ref={headRef}
          className={`mx-auto mb-16 max-w-2xl text-center transition-all duration-700 ease-out ${
            headInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            A closer look
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
            One conversation.
            <br />
            <span className="text-blue-600">Every screen.</span>
          </h2>

          {/* Animated accent line */}
          <div
            className={`mx-auto mt-6 h-[3px] w-24 origin-center rounded-full bg-blue-600 transition-transform duration-700 ease-out ${
              headInView ? "scale-x-100" : "scale-x-0"
            }`}
            style={{ transitionDelay: "250ms" }}
          />

          <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            A familiar, focused messaging experience that feels right whether
            you're at your desk or on the move.
          </p>
        </div>

        {/* ── Device stage ── */}
        <div className="relative mx-auto max-w-5xl pb-20 sm:pb-24">
          {/* Breathing glow behind desktop */}
          <div className="absolute inset-x-10 top-20 -z-10 h-80 animate-[glow-breathe_9s_ease-in-out_infinite] rounded-full bg-blue-500/15 blur-[110px]" />

          {/* Desktop label + mockup */}
          <div
            ref={deskRef}
            className={`transition-all duration-1000 ease-out ${
              deskInView
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="mb-5 ml-3 flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200/80 bg-white/70 text-blue-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.05] dark:text-blue-400">
                <Monitor className="h-3.5 w-3.5" />
              </span>
              Desktop experience
              <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
            </div>

            <div className="group relative">
              {/* Hover spotlight on desktop frame */}
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-blue-500/0 via-blue-500/[0.06] to-cyan-400/[0.08] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="transition-transform duration-700 ease-out will-change-transform group-hover:-translate-y-1.5">
                <DesktopMockup />
              </div>
            </div>
          </div>

          {/* Mobile mockup — floats, staggers in after desktop */}
          <div
            ref={mobRef}
            className={`absolute -bottom-2 right-2 z-20 flex flex-col items-start gap-2.5 transition-all duration-1000 ease-out sm:right-10 md:right-20 ${
              mobInView
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-12 scale-90 opacity-0"
            }`}
            style={{ transitionDelay: deskInView ? "300ms" : "0ms" }}
          >
            <div className="ml-5 flex items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="grid h-5 w-5 place-items-center rounded-md border border-slate-200/80 bg-white/70 text-blue-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-blue-400">
                <Smartphone className="h-3 w-3" />
              </span>
              Mobile experience
            </div>

            {/* Floating device with glow + gentle shadow pulse */}
            <div className="animate-[float-y_7s_ease-in-out_infinite]">
              <div className="rounded-[2.4rem] shadow-[0_24px_60px_-12px_rgba(37,99,235,0.3)] ring-1 ring-slate-900/[0.06] dark:shadow-[0_24px_60px_-12px_rgba(37,99,235,0.35)] dark:ring-white/10">
                <MobileMockup />
              </div>
              {/* Reflection glow under phone */}
              <div className="mx-auto mt-4 h-3 w-2/3 rounded-full bg-blue-500/25 blur-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
