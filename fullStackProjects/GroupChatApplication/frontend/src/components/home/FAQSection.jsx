import { faqs } from "./homeData";

export default function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">A few answers</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.05em] sm:text-5xl">Frequently asked questions.</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Have a question about Said Hi? Start here for a quick overview of the experience.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map(({ question, answer }, index) => (
            <details
              key={question}
              open={index === 0}
              className="group rounded-2xl border border-white/80 bg-white/65 p-5 shadow-sm backdrop-blur-xl transition open:border-blue-200 dark:border-white/[0.08] dark:bg-white/[0.035] dark:open:border-blue-400/30 sm:p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 marker:hidden dark:text-white sm:text-base">
                {question}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-lg font-normal text-blue-600 transition group-open:rotate-45 dark:bg-blue-500/10 dark:text-blue-300">+</span>
              </summary>
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600 dark:border-white/[0.08] dark:text-slate-400">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
