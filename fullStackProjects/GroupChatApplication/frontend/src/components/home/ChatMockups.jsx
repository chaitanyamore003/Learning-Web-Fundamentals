import {
  ArrowLeft,
  BatteryFull,
  CheckCheck,
  Image as ImageIcon,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Video,
  Wifi,
} from "lucide-react";

const avatar = "https://i.pravatar.cc/100?img=47";

const contacts = [
  {
    name: "Sophia Williams",
    image: 44,
    time: "10:20",
    message: "Are we meeting today?",
    unread: "2",
  },
  {
    name: "Daniel Smith",
    image: 12,
    time: "09:45",
    message: "Sent you the documents.",
  },
  {
    name: "Emma Johnson",
    image: 32,
    time: "Yesterday",
    message: "Thanks for sharing!",
  },
  {
    name: "Development Team",
    image: 5,
    time: "Yesterday",
    message: "You: Let's ship it 🚀",
  },
];

function ContactRow({ person }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-slate-100/80 dark:hover:bg-white/[0.04]">
      <img
        src={`https://i.pravatar.cc/100?img=${person.image}`}
        alt=""
        className="h-9 w-9 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
            {person.name}
          </span>
          <span className="shrink-0 text-[9px] text-slate-400">
            {person.time}
          </span>
        </div>
        <p className="mt-1 truncate text-[10px] text-slate-400">
          {person.message}
        </p>
      </div>
      {person.unread && (
        <span className="grid h-4 min-w-4 place-items-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
          {person.unread}
        </span>
      )}
    </div>
  );
}

function MessageBubble({ outgoing = false, children, time, image }) {
  return (
    <div className={`max-w-[78%] ${outgoing ? "self-end" : "self-start"}`}>
      <div
        className={
          outgoing
            ? "rounded-2xl rounded-br-sm bg-blue-600 px-4 py-3 text-white shadow-lg shadow-blue-600/10"
            : "rounded-2xl rounded-bl-sm border border-slate-200/70 bg-white px-4 py-3 text-slate-700 shadow-sm dark:border-white/[0.06] dark:bg-[#1b2433] dark:text-slate-200"
        }
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Shared workspace"
              className="mb-2 h-24 w-48 rounded-lg object-cover"
            />
            <p className="text-xs leading-5">
              Here's the workspace inspiration!
            </p>
          </>
        ) : (
          <p className="text-xs leading-5">{children}</p>
        )}
      </div>
      <div
        className={`mt-1 flex items-center gap-1 text-[9px] text-slate-400 ${outgoing ? "justify-end" : ""}`}
      >
        {time}
        {outgoing && <CheckCheck className="h-3 w-3 text-blue-500" />}
      </div>
    </div>
  );
}

export function DesktopMockup() {
  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white/90 shadow-[0_35px_100px_-35px_rgba(30,64,175,0.35)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#101522]/95">
      <div className="flex h-12 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 dark:border-white/10 dark:bg-white/[0.025]">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff605c]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd44]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00ca4e]" />
        </div>
        <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-md border border-slate-200/70 bg-slate-50 px-3 py-1.5 text-[10px] text-slate-400 dark:border-white/5 dark:bg-black/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          said-hi.app / chat
        </div>
        <div className="w-8" />
      </div>

      <div className="flex h-[420px] sm:h-[470px]">
        <aside className="hidden w-[225px] shrink-0 flex-col border-r border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.02] sm:flex">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-4xl bg-blue-600 text-white">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Messages
              </span>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/5">
              <Plus className="h-4 w-4" />
            </span>
          </div>
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400">
              Search messages...
            </span>
          </div>
          <div className="mb-2 flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400">
            <span>Recent chats</span>
            <span>See all</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/80 p-2.5 dark:border-blue-500/20 dark:bg-blue-500/10">
              <div className="relative">
                <img
                  src={avatar}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#101522]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Alex Morgan
                  </span>
                  <span className="text-[9px] text-slate-400">10:42</span>
                </div>
                <p className="mt-1 truncate text-[10px] text-blue-600 dark:text-blue-400">
                  That looks amazing!
                </p>
              </div>
            </div>
            {contacts.map((person) => (
              <ContactRow key={person.name} person={person} />
            ))}
          </div>
          <div className="mt-auto flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <img
              src="https://i.pravatar.cc/100?img=11"
              alt=""
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                Your profile
              </p>
              <p className="text-[10px] text-slate-400">Available</p>
            </div>
            <MoreHorizontal className="ml-auto h-4 w-4 text-slate-400" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-slate-50/70 dark:bg-[#0b101b]">
          <header className="flex items-center justify-between border-b border-slate-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.02] sm:px-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#0b101b]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Alex Morgan
                </h3>
                <p className="mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                  Online now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Phone className="h-4 w-4" />
              <Video className="h-4 w-4" />
              <MoreHorizontal className="h-4 w-4" />
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
            <span className="self-center rounded-full bg-slate-200/70 px-3 py-1 text-[9px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
              Today · 10:38 AM
            </span>
            <MessageBubble time="10:38 AM">
              Hey! Have you checked out the new design?
            </MessageBubble>
            <MessageBubble outgoing time="10:39 AM">
              Yes! Just finished working on it. Really happy with the result!
            </MessageBubble>
            <MessageBubble time="10:40 AM">That's awesome! 🔥</MessageBubble>
            <MessageBubble
              outgoing
              time="10:42 AM"
              image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&q=80"
            />
          </div>

          <div className="border-t border-slate-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.02] sm:p-4">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-white/10 dark:bg-[#151d2b] sm:px-4">
              <Paperclip className="h-4 w-4 text-slate-400" />
              <span className="flex-1 text-[11px] text-slate-400">
                Type your message...
              </span>
              <Smile className="h-4 w-4 text-slate-400" />
              <Mic className="h-4 w-4 text-slate-400" />
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white">
                <Send className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileMockup() {
  return (
    <div className="w-[178px] overflow-hidden rounded-[2rem] border-[5px] border-slate-800 bg-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.45)] dark:border-slate-600 dark:bg-[#0b101b] sm:w-[205px]">
      <div className="relative flex h-8 items-center justify-between bg-white px-4 pt-1 dark:bg-[#101522]">
        <span className="text-[8px] font-bold text-slate-900 dark:text-white">
          9:41
        </span>
        <span className="absolute left-1/2 top-1.5 h-3.5 w-14 -translate-x-1/2 rounded-full bg-slate-900 dark:bg-black" />
        <span className="flex items-center gap-1 text-slate-700 dark:text-white">
          <Wifi className="h-2.5 w-2.5" />
          <BatteryFull className="h-3 w-3" />
        </span>
      </div>
      <div className="flex h-[330px] flex-col sm:h-[360px]">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-2.5 py-2.5 dark:border-white/10 dark:bg-[#101522]">
          <ArrowLeft className="h-3.5 w-3.5 text-blue-600" />
          <img src={avatar} alt="" className="h-7 w-7 rounded-full" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold text-slate-900 dark:text-white">
              Alex Morgan
            </p>
            <p className="text-[8px] text-emerald-500">Online</p>
          </div>
          <Phone className="h-3 w-3 text-slate-400" />
          <Video className="h-3 w-3 text-slate-400" />
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-hidden bg-slate-50/80 p-2.5 dark:bg-[#0b101b]">
          <span className="self-center rounded-full bg-slate-200/70 px-2 py-1 text-[7px] text-slate-500 dark:bg-white/5">
            Today
          </span>
          <div className="max-w-[85%] self-start rounded-xl rounded-tl-sm bg-white px-2.5 py-2 shadow-sm dark:bg-[#1b2433]">
            <p className="text-[9px] leading-4 text-slate-700 dark:text-slate-200">
              Hey! Are you free today?
            </p>
          </div>
          <div className="max-w-[85%] self-end rounded-xl rounded-tr-sm bg-blue-600 px-2.5 py-2">
            <p className="text-[9px] leading-4 text-white">
              Absolutely! What's up?
            </p>
          </div>
          <div className="max-w-[90%] self-start rounded-xl rounded-tl-sm bg-white px-2.5 py-2 shadow-sm dark:bg-[#1b2433]">
            <p className="text-[9px] leading-4 text-slate-700 dark:text-slate-200">
              Let's catch up over coffee! ☕
            </p>
          </div>
          <div className="max-w-[85%] self-end rounded-xl rounded-tr-sm bg-blue-600 px-2.5 py-2">
            <p className="text-[9px] leading-4 text-white">
              Sounds like a plan! 🚀
            </p>
          </div>
          <div className="flex w-fit items-center gap-1 rounded-full bg-white px-2.5 py-2 shadow-sm dark:bg-[#1b2433]">
            <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
          </div>
        </div>
        <div className="border-t border-slate-100 bg-white p-2 dark:border-white/10 dark:bg-[#101522]">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-2 dark:border-white/10 dark:bg-white/[0.04]">
            <Paperclip className="h-2.5 w-2.5 text-slate-400" />
            <span className="flex-1 text-[8px] text-slate-400">Message...</span>
            <Smile className="h-2.5 w-2.5 text-slate-400" />
            <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white">
              <Send className="h-2.5 w-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
