export default function HomeBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-56 left-[8%] h-[620px] w-[620px] rounded-full bg-blue-400/20 blur-[150px] dark:bg-blue-600/15" />
      <div className="absolute top-[24rem] -right-64 h-[560px] w-[560px] rounded-full bg-violet-400/20 blur-[150px] dark:bg-violet-600/10" />
      <div className="absolute top-[76rem] -left-64 h-[520px] w-[520px] rounded-full bg-cyan-300/20 blur-[145px] dark:bg-cyan-600/10" />
      <div className="absolute bottom-[-18rem] right-[8%] h-[600px] w-[600px] rounded-full bg-indigo-400/15 blur-[155px] dark:bg-indigo-700/10" />
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 to-transparent dark:from-[#080b14]/40" />
    </div>
  );
}
