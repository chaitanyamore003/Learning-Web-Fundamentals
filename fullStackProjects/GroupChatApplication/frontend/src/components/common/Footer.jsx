import { Link } from "react-router-dom";
import { MessageCircle, ArrowUpRight, Heart } from "lucide-react";
import { Github, Linkedin, Youtube, Mail } from "../icons/BrandIcons";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

function Brand() {
  return (
    <Link
      to="/"
      aria-label="Said Hi — home"
      className="group inline-flex items-center gap-3"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-4xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-blue-600/40">
        <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
      </div>

      <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Said Hi<span className="text-blue-600">.</span>
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Social Links Configuration                                         */
/* ------------------------------------------------------------------ */

// Update your social URLs here whenever required.

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    icon: Github,
    href: "https://github.com/YOUR_USERNAME",
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com/in/YOUR_PROFILE",
  },
  {
    label: "YouTube",
    icon: Youtube,
    href: "https://youtube.com/@YOUR_CHANNEL",
  },
  {
    label: "Email",
    icon: Mail,
    href: "mailto:your-email@example.com",
  },
];

/* ------------------------------------------------------------------ */
/* Social Links Component                                             */
/* ------------------------------------------------------------------ */

function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {SOCIAL_LINKS.map((item) => {
        const Icon = item.icon;

        return (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={
              item.href.startsWith("mailto:")
                ? undefined
                : "noopener noreferrer"
            }
            aria-label={item.label}
            title={item.label}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/60 text-slate-500 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
          >
            <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
          </a>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Default Navigation                                                  */
/* ------------------------------------------------------------------ */

const DEFAULT_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#services" },
      { label: "Preview", href: "/#preview" },
      { label: "How it works", href: "/#about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Contact", href: "/#contact" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/signup" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const Footer = ({
  columns = DEFAULT_COLUMNS,
  maxWidth = "max-w-7xl",
  showSocial = true,
  className,
}) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative mt-24 overflow-hidden border-t border-slate-200/60 bg-white/30 pt-16 backdrop-blur-2xl dark:border-white/[0.07] dark:bg-[#080b14]/30",
        className,
      )}
    >
      {/* Ambient Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-48 left-[10%] h-[350px] w-[350px] rounded-full bg-blue-400/15 blur-[120px] dark:bg-blue-600/10" />

        <div className="absolute -bottom-48 right-[10%] h-[350px] w-[350px] rounded-full bg-purple-400/15 blur-[120px] dark:bg-purple-600/10" />
      </div>

      <div className={cn("relative mx-auto px-6 sm:px-8", maxWidth)}>
        {/* Main Footer Content */}
        <div className="grid gap-14 pb-16 lg:grid-cols-12 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Brand />

            <p className="mt-6 max-w-sm text-[14px] leading-8 text-slate-500 dark:text-slate-400">
              Bringing people closer, one conversation at a time. Experience a
              smarter, simpler, and more meaningful way to stay connected with
              the people who matter.
            </p>

            {showSocial && (
              <div className="mt-7">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                  Connect with us
                </p>

                <SocialLinks />
              </div>
            )}

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1.5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                Built for real conversations
              </span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:pl-12">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-slate-900 dark:text-white">
                  {column.title}
                </h3>

                <ul className="mt-6 flex flex-col gap-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-[13px] font-medium text-slate-500 transition-colors duration-200 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                      >
                        {link.label}

                        <ArrowUpRight className="h-3 w-3 -translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-200/60 py-7 dark:border-white/10 sm:flex-row">
          <p className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
            © {year} Said Hi. All rights reserved.
          </p>

          {/* Creator Credit */}
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Designed & built with
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            by
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Chaitanya More
            </span>
          </p>
        </div>
      </div>

      {/* Oversized Brand Watermark */}
      <div className="pointer-events-none relative mt-4 w-full select-none overflow-hidden">
        <h2
          className="whitespace-nowrap text-center text-[19vw] font-black leading-[0.78] tracking-[-0.085em] text-slate-900/[0.045] dark:text-white/[0.035]"
          style={{ marginBottom: "-1.5vw" }}
          aria-hidden="true"
        >
          Said <span className="text-blue-600/20">Hi.</span>
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
