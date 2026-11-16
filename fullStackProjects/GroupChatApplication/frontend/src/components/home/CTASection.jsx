import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-7 py-16 text-center text-white shadow-[0_30px_90px_-35px_rgba(37,99,235,0.65)] sm:px-14 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-36 h-80 w-80 rounded-full bg-violet-300/25 blur-[85px]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-44 -left-20 h-96 w-96 rounded-full bg-cyan-300/20 blur-[90px]"
        />
        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-4xl border border-white/20 bg-white/10 backdrop-blur">
            <MessageCircle className="h-5 w-5" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
            Your next conversation starts here
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">
            Someone's waiting to hear from you.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
            Create your account and bring your conversations a little closer
            together.
          </p>
          <Link
            to="/signup"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
