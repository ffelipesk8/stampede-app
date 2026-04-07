"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const QUICK_PROMPTS = [
  { icon: "🏆", text: "Who are the favorites to win?" },
  { icon: "📈", text: "How do I level up faster?" },
  { icon: "🔄", text: "Tips for trading stickers?" },
  { icon: "📅", text: "When are the next matches?" },
  { icon: "⭐", text: "How do I get Legendary stickers?" },
  { icon: "🎯", text: "What missions should I focus on?" },
];

const FREE_DAILY_LIMIT = 5;

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isUser
            ? "bg-[#FF5E00]/20 border border-[#FF5E00]/40"
            : "bg-gradient-to-br from-[#E8003D] to-[#FF5E00]"
        }`}
      >
        {isUser ? "You" : "🤖"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-[#FF5E00]/20 border border-[#FF5E00]/30 text-white ml-auto"
            : "bg-white/5 border border-white/10 text-white/90"
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
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#E8003D] to-[#FF5E00] flex items-center justify-center text-sm">
        🤖
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, delay, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white/40 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

export default function CoachClient({ initialMessages, userContext }: CoachClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [dailyCount, setDailyCount] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(
    userContext.conversationId
  );
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

  // Fetch daily count
  useEffect(() => {
    fetch("/api/coach/status")
      .then((r) => r.json())
      .then((d) => setDailyCount(d.count ?? 0))
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
          setError(
            userContext.isPro
              ? "Rate limit reached. Try again in a moment."
              : `You've used your ${FREE_DAILY_LIMIT} free messages today. Upgrade to PRO for unlimited coaching! 🚀`
          );
        } else {
          setError(err.error || "Something went wrong. Try again.");
        }
        setIsStreaming(false);
        return;
      }

      // SSE streaming
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let newConvId = conversationId;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.conversationId) newConvId = parsed.conversationId;
                if (parsed.content) {
                  fullContent += parsed.content;
                  setStreamingContent(fullContent);
                }
              } catch {}
            }
          }
        }
      }

      // Finalize
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: fullContent,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingContent("");
      setConversationId(newConvId);
      setDailyCount((c) => c + 1);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Connection interrupted. Please try again.");
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
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8003D] to-[#FF5E00] flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <h1 className="text-white font-black text-lg">AI Fan Coach</h1>
              <p className="text-white/40 text-xs">
                Powered by GPT-4o · World Cup 2026 expert
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!userContext.isPro && (
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                <div
                  className="h-1 rounded-full bg-white/20 overflow-hidden"
                  style={{ width: 60 }}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E8003D] to-[#FF5E00] transition-all"
                    style={{
                      width: `${Math.min((dailyCount / FREE_DAILY_LIMIT) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-white/50 text-xs">
                  {Math.max(FREE_DAILY_LIMIT - dailyCount, 0)} left today
                </span>
              </div>
            )}
            {userContext.isPro && (
              <div className="flex items-center gap-1.5 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-full px-3 py-1.5">
                <span className="text-[#FFB800] text-xs font-bold">⚡ PRO</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {isEmpty && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center gap-6 py-10"
          >
            <div className="text-6xl">🤖</div>
            <div>
              <h2 className="text-2xl font-black text-white mb-2">
                Hey {userContext.username}! ⚽
              </h2>
              <p className="text-white/50 max-w-sm">
                I&apos;m your personal World Cup AI coach. Ask me anything about
                the tournament, your collection, trading tips, or predictions!
              </p>
            </div>

            {/* Quick prompts */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handleSend(prompt.text)}
                  disabled={isAtLimit}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3 text-left hover:bg-white/10 hover:border-white/20 transition-all text-sm text-white/70 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-base flex-shrink-0">{prompt.icon}</span>
                  <span className="line-clamp-2 text-xs">{prompt.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {!isEmpty && (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isStreaming && streamingContent && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#E8003D] to-[#FF5E00] flex items-center justify-center text-sm">
                  🤖
                </div>
                <div className="max-w-[75%] bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm leading-relaxed text-white/90">
                  {streamingContent}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-1 h-4 bg-white/60 ml-0.5 align-text-bottom"
                  />
                </div>
              </div>
            )}
            {isStreaming && !streamingContent && <TypingIndicator />}
          </>
        )}

        {/* Suggested follow-ups (only when there are messages and not streaming) */}
        {!isEmpty && !isStreaming && messages.length > 0 && messages.length < 4 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {QUICK_PROMPTS.slice(0, 3).map((p) => (
              <button
                key={p.text}
                onClick={() => handleSend(p.text)}
                disabled={isAtLimit}
                className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
              >
                {p.icon} {p.text}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-shrink-0 mx-6 mb-2"
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
              <span className="text-red-400 flex-shrink-0">⚠️</span>
              <p className="text-red-400 text-sm">{error}</p>
              {!userContext.isPro && isAtLimit && (
                <a
                  href="/upgrade"
                  className="ml-auto flex-shrink-0 text-xs bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white px-3 py-1.5 rounded-full font-bold hover:opacity-90"
                >
                  Upgrade
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-white/10">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isAtLimit
                  ? "Upgrade to PRO for unlimited messages…"
                  : "Ask anything about the World Cup…"
              }
              disabled={isAtLimit || isStreaming}
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-[#FF5E00]/50 focus:bg-white/8 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
          {isStreaming ? (
            <button
              onClick={handleStop}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <span className="w-3 h-3 bg-white rounded-sm" />
            </button>
          ) : (
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isAtLimit}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-r from-[#E8003D] to-[#FF5E00] flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#FF5E00]/20"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        <p className="text-white/20 text-xs mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
