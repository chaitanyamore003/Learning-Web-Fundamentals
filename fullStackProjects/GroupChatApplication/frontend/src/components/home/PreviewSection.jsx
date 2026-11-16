import { Monitor, Smartphone } from "lucide-react";
import { DesktopMockup, MobileMockup } from "./ChatMockups";

export default function PreviewSection() {
  return (
    <section id="preview" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">A closer look</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl md:text-5xl">One conversation. Every screen.</h2>
          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            A familiar, focused messaging experience that feels right whether you're at your desk or on the move.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl pb-16 sm:pb-20">
          <div className="absolute inset-x-10 top-16 -z-10 h-72 rounded-full bg-blue-500/15 blur-[100px]" />
          <div className="mb-4 ml-3 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Monitor className="h-4 w-4" /> Desktop experience
          </div>
          <DesktopMockup />
          <div className="absolute -bottom-2 right-2 z-20 flex flex-col items-start gap-2 sm:right-10 md:right-20">
            <div className="ml-5 flex items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <Smartphone className="h-3.5 w-3.5" /> Mobile experience
            </div>
            <MobileMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
