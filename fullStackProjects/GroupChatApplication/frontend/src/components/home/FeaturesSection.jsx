import { features } from "./homeData";

export default function FeaturesSection() {
  return (
    <section id="services" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Made for connection</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl md:text-5xl">Everything you need to stay close.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            The essentials for better conversations, brought together in one clean and easy-to-use space.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, tag }, index) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/65 p-6 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_45px_-25px_rgba(37,99,235,0.28)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:hover:border-blue-400/30 sm:p-7"
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-400/0 blur-3xl transition group-hover:bg-blue-400/10" />
              <div className="relative mb-6 flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 dark:group-hover:bg-blue-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">{tag}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
