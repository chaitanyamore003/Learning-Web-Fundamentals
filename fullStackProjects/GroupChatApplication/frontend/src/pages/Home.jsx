import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HomeBackground from "../components/home/HomeBackground";
import HeroSection from "../components/home/HeroSection";
import PreviewSection from "../components/home/PreviewSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CTASection from "../components/home/CTASection";
import FAQSection from "../components/home/FAQSection";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Preview", href: "#preview" },
  { label: "Features", href: "#services" },
  { label: "FAQ", href: "#faq" },
];

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f7f9ff] font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-950 dark:bg-[#080b14] dark:text-white">
      <HomeBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar links={navLinks} />

        <main className="flex-1">
          <HeroSection />
          <PreviewSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CTASection />
          <FAQSection />
        </main>

        {/* Social links and creator credit are configured inside Footer.jsx. */}
        <Footer />
      </div>
    </div>
  );
}
