"use client";
import { useCallback, useEffect, useState } from "react";
import { Menu, MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Trash2, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { HalviAvatar } from "./HalviAvatar";
import { HelpButton, WhatsAppIcon, waHref } from "./HelpButton";
import { BOT, HALTEV } from "@/lib/constants";
import { DICT, LANG_KEY, detectLang, type Lang } from "@/lib/i18n";
import type { HaltevUIMessage } from "@/lib/ai/ui-types";

type ChatMeta = { id: string; title: string | null; updated_at: string };
type Current = { id: string; messages: HaltevUIMessage[] };

const OWNER_KEY = "halvi_owner_id";
const LAST_CHAT_KEY = "halvi_last_chat";
const SIDEBAR_KEY = "halvi_sidebar_collapsed";

function getOwnerId() {
  try {
    let id = localStorage.getItem(OWNER_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(OWNER_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function ChatApp() {
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatMeta[]>([]);
  const [current, setCurrent] = useState<Current | null>(null);
  const [drawer, setDrawer] = useState(false); // mobile: slide-out drawer
  const [collapsed, setCollapsed] = useState(false); // desktop: sidebar hidden
  const [lang, setLang] = useState<Lang>("id");
  const t = DICT[lang];

  const refreshList = useCallback(async (owner: string) => {
    try {
      const res = await fetch(`/api/sessions?ownerId=${owner}`);
      if (res.ok) setChats(await res.json());
    } catch {
      /* sidebar is optional; ignore */
    }
  }, []);

  const openChat = useCallback(async (owner: string, id: string) => {
    setDrawer(false);
    try {
      const res = await fetch(`/api/sessions/${id}?ownerId=${owner}`);
      const { messages } = await res.json();
      setCurrent({ id, messages: messages ?? [] });
      localStorage.setItem(LAST_CHAT_KEY, id);
    } catch {
      setCurrent({ id, messages: [] });
    }
  }, []);

  const newChat = useCallback(() => {
    const id = crypto.randomUUID();
    setCurrent({ id, messages: [] });
    setDrawer(false);
    try {
      localStorage.setItem(LAST_CHAT_KEY, id);
    } catch {}
  }, []);

  useEffect(() => {
    setLang(detectLang());
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {}
    const owner = getOwnerId();
    setOwnerId(owner);
    refreshList(owner);
    let last: string | null = null;
    try {
      last = localStorage.getItem(LAST_CHAT_KEY);
    } catch {}
    if (last) openChat(owner, last);
    else newChat();
  }, [refreshList, openChat, newChat]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setSidebarCollapsed(v: boolean) {
    setCollapsed(v);
    try {
      localStorage.setItem(SIDEBAR_KEY, v ? "1" : "0");
    } catch {}
  }

  /** Mobile (< md): open/close the drawer. Desktop: show/hide the sidebar. */
  function toggleSidebar() {
    if (window.matchMedia("(min-width: 768px)").matches) setSidebarCollapsed(!collapsed);
    else setDrawer((d) => !d);
  }

  function switchLang(l: Lang) {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  }

  async function deleteChat(id: string) {
    if (!ownerId) return;
    await fetch(`/api/sessions/${id}?ownerId=${ownerId}`, { method: "DELETE" });
    setChats((c) => c.filter((x) => x.id !== id));
    if (current?.id === id) newChat();
  }

  const sidebar = (
    <aside className="flex h-full w-[min(18rem,85vw)] flex-col border-r border-ink-800 bg-ink-900/95 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] backdrop-blur md:w-72">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <HalviAvatar size={40} />
        <div className="leading-tight">
          <div className="text-lg font-extrabold tracking-tight text-white">{BOT.name}</div>
          <div className="text-xs text-ink-400">{BOT.tagline}</div>
        </div>
        <button
          className="ml-auto rounded-lg p-2 text-ink-400 hover:bg-ink-800 hover:text-white"
          onClick={() => {
            if (window.matchMedia("(min-width: 768px)").matches) setSidebarCollapsed(true);
            else setDrawer(false);
          }}
          aria-label={t.closeMenu}
          title={t.closeMenu}
        >
          <X size={20} className="md:hidden" />
          <PanelLeftClose size={19} className="hidden md:block" />
        </button>
      </div>
      <div className="px-3">
        <button
          onClick={newChat}
          className="flex w-full items-center gap-2 rounded-xl border border-volt-500/40 bg-volt-500/10 px-3 py-3 text-sm font-semibold text-volt-300 transition hover:bg-volt-500/20"
        >
          <MessageSquarePlus size={17} /> {t.newChat}
        </button>
      </div>
      <div className="mt-5 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">{t.history}</div>
      <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-2 pb-4">
        {chats.length === 0 && <p className="px-2 py-2 text-xs text-ink-400">{t.noHistory}</p>}
        {chats.map((c) => (
          <div
            key={c.id}
            className={`group flex items-center rounded-lg pr-1 text-sm transition ${
              current?.id === c.id ? "bg-ink-800 text-white" : "text-ink-300 hover:bg-ink-850"
            }`}
          >
            <button className="min-w-0 flex-1 truncate px-3 py-2.5 text-left" onClick={() => ownerId && openChat(ownerId, c.id)}>
              {c.title || t.untitled}
            </button>
            {/* Always visible on touch screens, hover-only on desktop */}
            <button
              onClick={() => deleteChat(c.id)}
              className="rounded p-2 text-ink-400 transition hover:text-red-300 md:opacity-0 md:group-hover:opacity-100"
              aria-label={t.deleteChat}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </nav>
      {/* Phones & tablets: WhatsApp help lives here (desktop uses the floating button) */}
      <div className="px-3 pb-4 lg:hidden">
        <a
          href={waHref(t)}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-sm font-bold text-white transition active:scale-[0.98]"
        >
          <WhatsAppIcon size={18} /> {t.waButton}
        </a>
      </div>
    </aside>
  );

  return (
    <div className="circuit-bg flex h-dvh overflow-hidden">
      {/* Desktop sidebar: slides closed by animating its width */}
      <div
        className={`hidden shrink-0 overflow-hidden transition-[width] duration-300 ease-out md:block ${collapsed ? "md:w-0" : "md:w-72"}`}
        aria-hidden={collapsed}
        inert={collapsed}
      >
        {sidebar}
      </div>
      {drawer && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div className="relative h-full w-fit animate-rise">{sidebar}</div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2.5 border-b border-ink-800/80 bg-ink-950/70 px-3 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] backdrop-blur sm:gap-3 sm:px-4 md:px-6">
          {/* Mobile: always shown (opens drawer). Desktop: only when the sidebar is hidden. */}
          <button
            className={`-ml-1 rounded-lg p-2 text-ink-300 hover:bg-ink-800 hover:text-white ${collapsed ? "" : "md:hidden"}`}
            onClick={toggleSidebar}
            aria-label={t.openMenu}
            title={t.openMenu}
          >
            <Menu size={22} className="md:hidden" />
            <PanelLeftOpen size={20} className="hidden md:block" />
          </button>
          <HalviAvatar size={30} />
          <div className="min-w-0 leading-tight">
            <div className="font-bold text-white">{BOT.name}</div>
            <div className="flex items-center gap-1.5 truncate text-xs text-ink-400">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /> {t.online}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-lg border border-ink-700 p-0.5 text-xs font-bold" role="group" aria-label="Language">
              {(["id", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => switchLang(l)}
                  aria-pressed={lang === l}
                  className={`rounded-md px-2.5 py-1.5 uppercase transition ${
                    lang === l ? "bg-volt-500 text-ink-950" : "text-ink-300 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <a
              href={HALTEV.website}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-lg border border-ink-700 px-3 py-1.5 text-xs text-ink-300 hover:border-volt-500/50 hover:text-white sm:block"
            >
              haltev.id ↗
            </a>
          </div>
        </header>

        {ownerId && current ? (
          <ChatWindow
            key={current.id}
            chatId={current.id}
            ownerId={ownerId}
            lang={lang}
            initialMessages={current.messages}
            onSaved={() => refreshList(ownerId)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <HalviAvatar size={56} pulse />
          </div>
        )}
      </main>
      <HelpButton t={t} />
    </div>
  );
}
