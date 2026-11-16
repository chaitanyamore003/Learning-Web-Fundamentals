import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { steps } from "./homeData";

export default function HowItWorksSection() {
  return (
    <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200/70 bg-white/55 p-7 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.025] sm:p-10 lg:p-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Getting started</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">A simpler way to say hi.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Getting into a conversation should be the easiest part of your day.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map(({ number, icon: Icon, title, description }, index) => (
            <div key={number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-14 right-[-1.5rem] top-6 hidden border-t border-dashed border-blue-200 dark:border-blue-500/20 md:block" />
              )}
              <div className="relative">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Icon className="h-5 w-5" /></span>
                  <span className="text-xs font-bold tracking-[0.18em] text-blue-600 dark:text-blue-400">{number}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:gap-3 dark:text-blue-400">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
