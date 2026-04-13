"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface UserContext {
  username: string;
  favoriteTeam: string | null;
  level: number;
  xp: number;
  isPro: boolean;
  streakDays: number;
  activeMissions: string[];
  conversationId: string | null;
}

interface CoachClientProps {
  initialMessages: Message[];
  userContext: UserContext;
}

const FREE_DAILY_LIMIT = 5;

const COPY = {
  en: {
    you: "You",
    title: "AI Fan Coach",
    subtitle: "Powered by GPT-4o · World Cup 2026 expert",
    leftToday: (n: number) => `${n} left today`,
    hey: (name: string) => `Hey ${name}!`,
    intro:
      "I'm your personal World Cup AI coach. Ask me anything about the tournament, your collection, trading tips, or predictions.",
    rateLimitPro: "Rate limit reached. Try again in a moment.",
    rateLimitFree: `You've used your ${FREE_DAILY_LIMIT} free messages today. Upgrade to PRO for unlimited coaching.`,
    genericError: "Something went wrong. Try again.",
    connectionError: "Connection interrupted. Please try again.",
    upgrade: "Upgrade",
    placeholderLimited: "Upgrade to PRO for unlimited messages...",
    placeholderOpen: "Ask anything about the World Cup...",
    footerHint: "Press Enter to send · Shift+Enter for new line",
    prompts: [
      { icon: "🏆", text: "Who are the favorites to win?" },
      { icon: "📈", text: "How do I level up faster?" },
      { icon: "🔄", text: "Tips for trading stickers?" },
      { icon: "📅", text: "When are the next matches?" },
      { icon: "⭐", text: "How do I get Legendary stickers?" },
      { icon: "🎯", text: "What missions should I focus on?" },
    ],
  },
  es: {
    you: "Tu",
    title: "Coach IA",
    subtitle: "Potenciado por GPT-4o · experto en Mundial 2026",
    leftToday: (n: number) => `${n} hoy`,
    hey: (name: string) => `Hola ${name}!`,
    intro:
      "Soy tu coach IA personal del Mundial. Preguntame sobre el torneo, tu coleccion, trades, estrategia o predicciones.",
    rateLimitPro: "Llegaste al limite por ahora. Intentalo de nuevo en un momento.",
    rateLimitFree: `Ya usaste tus ${FREE_DAILY_LIMIT} mensajes gratis de hoy. Hazte PRO para coaching ilimitado.`,
    genericError: "Algo salio mal. Intentalo otra vez.",
    connectionError: "La conexion se interrumpio. Intenta de nuevo.",
    upgrade: "Hazte PRO",
    placeholderLimited: "Hazte PRO para mensajes ilimitados...",
    placeholderOpen: "Pregunta lo que quieras sobre el Mundial...",
    footerHint: "Enter para enviar · Shift+Enter para nueva linea",
    prompts: [
      { icon: "🏆", text: "Quienes son los favoritos para ganar?" },
      { icon: "📈", text: "Como subo de nivel mas rapido?" },
      { icon: "🔄", text: "Consejos para intercambiar estampas?" },
      { icon: "📅", text: "Cuando son los proximos partidos?" },
      { icon: "⭐", text: "Como consigo estampas legendarias?" },
      { icon: "🎯", text: "Que misiones deberia priorizar?" },
    ],
  },
} as const;

function MessageBubble({ message, youLabel }: { message: Message; youLabel: string }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isUser ? "border border-[#FF5E00]/40 bg-[#FF5E00]/20" : "bg-gradient-to-br from-[#E8003D] to-[#FF5E00]"
        }`}
      >
        {isUser ? youLabel : "🤖"}
      </div>

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "ml-auto border border-[#FF5E00]/30 bg-[#FF5E00]/20 text-white"
            : "border border-white/10 bg-white/5 text-white/90"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8003D] to-[#FF5E00] text-sm">
        🤖
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, delay, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-white/40"
          />
        ))}
      </div>
    </div>
  );
}

export default function CoachClient({ initialMessages, userContext }: CoachClientProps) {
  const { locale } = useLanguage();
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [dailyCount, setDailyCount] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(userContext.conversationId);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    fetch("/api/coach/status")
      .then((r) => r.json())
      .then((data) => setDailyCount(data.count ?? 0))
      .catch(() => {});
  }, []);

  const handleSend = async (content?: string) => {
    const messageText = (content ?? input).trim();
    if (!messageText || isStreaming) return;

    setInput("");
    setError(null);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingContent("");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          conversationId,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setError(userContext.isPro ? copy.rateLimitPro : copy.rateLimitFree);
        } else {
          setError(err.error || copy.genericError);
        }
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let newConversationId = conversationId;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.conversationId) newConversationId = parsed.conversationId;
              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingContent(fullContent);
              }
            } catch {}
          }
        }
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: fullContent,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingContent("");
      setConversationId(newConversationId);
      setDailyCount((count) => count + 1);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(copy.connectionError);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setStreamingContent("");
  };

  const isAtLimit = !userContext.isPro && dailyCount >= FREE_DAILY_LIMIT;
  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full max-h-[calc(100vh-4rem)] flex-col">
      <div className="flex-shrink-0 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8003D] to-[#FF5E00] text-lg">
              🤖
            </div>
            <div>
              <h1 className="text-lg font-black text-white">{copy.title}</h1>
              <p className="text-xs text-white/40">{copy.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!userContext.isPro && (
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <div className="h-1 overflow-hidden rounded-full bg-white/20" style={{ width: 60 }}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E8003D] to-[#FF5E00] transition-all"
                    style={{ width: `${Math.min((dailyCount / FREE_DAILY_LIMIT) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-white/50">{copy.leftToday(Math.max(FREE_DAILY_LIMIT - dailyCount, 0))}</span>
              </div>
            )}

            {userContext.isPro && (
              <div className="flex items-center gap-1.5 rounded-full border border-[#FFB800]/30 bg-[#FFB800]/10 px-3 py-1.5">
                <span className="text-xs font-bold text-[#FFB800]">⚡ PRO</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {isEmpty && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-full flex-col items-center justify-center gap-6 py-10 text-center"
          >
            <div className="text-6xl">🤖</div>
            <div>
              <h2 className="mb-2 text-2xl font-black text-white">{copy.hey(userContext.username)} ⚽</h2>
              <p className="max-w-sm text-white/50">{copy.intro}</p>
            </div>

            <div className="grid w-full max-w-md grid-cols-2 gap-2">
              {copy.prompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handleSend(prompt.text)}
                  disabled={isAtLimit}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-left text-sm text-white/70 transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="flex-shrink-0 text-base">{prompt.icon}</span>
                  <span className="line-clamp-2 text-xs">{prompt.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {!isEmpty && (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} youLabel={copy.you} />
            ))}

            {isStreaming && streamingContent && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8003D] to-[#FF5E00] text-sm">
                  🤖
                </div>
                <div className="max-w-[75%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/90">
                  {streamingContent}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="ml-0.5 inline-block h-4 w-1 bg-white/60 align-text-bottom"
                  />
                </div>
              </div>
            )}

            {isStreaming && !streamingContent && <TypingIndicator />}
          </>
        )}

        {!isEmpty && !isStreaming && messages.length < 4 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {copy.prompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => handleSend(prompt.text)}
                disabled={isAtLimit}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:opacity-30"
              >
                {prompt.icon} {prompt.text}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-6 mb-2 flex-shrink-0"
          >
            <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <span className="flex-shrink-0 text-red-400">⚠️</span>
              <p className="text-sm text-red-400">{error}</p>
              {!userContext.isPro && isAtLimit && (
                <a
                  href="/upgrade"
                  className="ml-auto flex-shrink-0 rounded-full bg-gradient-to-r from-[#E8003D] to-[#FF5E00] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                >
                  {copy.upgrade}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-shrink-0 border-t border-white/10 px-6 py-4">
        <div className="flex items-end gap-3">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={isAtLimit ? copy.placeholderLimited : copy.placeholderOpen}
              disabled={isAtLimit || isStreaming}
              rows={1}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition-all focus:border-[#FF5E00]/50 focus:bg-white/8 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            />
          </div>

          {isStreaming ? (
            <button
              onClick={handleStop}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <span className="h-3 w-3 rounded-sm bg-white" />
            </button>
          ) : (
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isAtLimit}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white shadow-lg shadow-[#FF5E00]/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        <p className="mt-2 text-center text-xs text-white/20">{copy.footerHint}</p>
      </div>
    </div>
  );
}
