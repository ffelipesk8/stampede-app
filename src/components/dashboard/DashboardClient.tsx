"use client";

import {
  ArrowRight,
  BookOpen,
  Bot,
  CalendarDays,
  Crown,
  Flame,
  PackageOpen,
  ShoppingBag,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useLanguage } from "@/contexts/LanguageContext";

interface MissionItem {
  id: string;
  progress: number;
  target: number;
  title: string;
  description: string;
  xpReward: number;
}

interface ActivityItem {
  id: string;
  username: string;
  stickerName: string;
  rarity: "EPIC" | "LEGENDARY";
  acquiredAt: string;
}

interface DashboardClientProps {
  username: string;
  level: number;
  xp: number;
  fanTitle: string;
  stickerCount: number;
  streakDays: number;
  missions: MissionItem[];
  missionCompletion: number;
  activity: ActivityItem[];
}

export function DashboardClient({
  username,
  level,
  xp,
  fanTitle,
  stickerCount,
  streakDays,
  missions,
  missionCompletion,
  activity,
}: DashboardClientProps) {
  const { locale } = useLanguage();

  const copy = locale === "es"
    ? {
        welcome: "Bienvenido de vuelta",
        intro: "Tu camino hacia la coleccion del Mundial 2026 empieza aqui.",
        activeMissions: "Misiones activas",
        inProgress: (n: number) => `${n} en progreso`,
        viewAll: "Ver todo",
        noMissions: "No hay misiones activas ahora mismo",
        noMissionsHint: "Los desafios nuevos aparecen cada dia. Vuelve manana.",
        reward: "recompensa XP",
        communityPulls: "Aperturas de la comunidad",
        live: "En vivo",
        unlocked: "consiguio",
        justNow: "ahora",
        quickActions: "Acciones rapidas",
        go: "Ir",
        stats: {
          totalXp: "XP total",
          totalXpHint: "Progreso general",
          level: "Nivel",
          levelHint: fanTitle,
          stickers: "Estampas",
          stickersHint: "Coleccionadas hasta ahora",
          streak: "Racha",
          streakHint: streakDays > 0 ? "Ritmo activo" : "Empieza tu racha",
        },
        actions: {
          packs: ["Abrir sobre", "Desbloquea nuevas estampas y busca rarezas."],
          album: ["Mi album", "Revisa tu coleccion y completa espacios faltantes."],
          events: ["Eventos fan", "Unete a activaciones y momentos de comunidad."],
          market: ["Mercado", "Intercambia mejor y completa tu set premium."],
          coach: ["Preguntar al coach IA", "Recibe estrategia, tips y guia de partidos."],
          ranking: ["Ranking", "Sube posiciones y defiende tu lugar."],
        },
        badges: {
          packs: "NUEVO DROP",
          events: "LIVE",
          coach: "IA",
        },
        rarity: {
          LEGENDARY: "LEGENDARIA",
          EPIC: "EPICA",
        },
      }
    : {
        welcome: "Welcome back",
        intro: "Your path to the World Cup 2026 collection starts here.",
        activeMissions: "Active Missions",
        inProgress: (n: number) => `${n} in progress`,
        viewAll: "View all",
        noMissions: "No active missions right now",
        noMissionsHint: "New challenges unlock daily. Check back tomorrow.",
        reward: "XP reward",
        communityPulls: "Community Pulls",
        live: "Live",
        unlocked: "unlocked",
        justNow: "just now",
        quickActions: "Quick Actions",
        go: "Go",
        stats: {
          totalXp: "Total XP",
          totalXpHint: "Career progression",
          level: "Level",
          levelHint: fanTitle,
          stickers: "Stickers",
          stickersHint: "Collected so far",
          streak: "Streak",
          streakHint: streakDays > 0 ? "Momentum active" : "Start your run",
        },
        actions: {
          packs: ["Open a Pack", "Unlock fresh drops and chase rare cards."],
          album: ["My Album", "Review your collection and hunt missing slots."],
          events: ["Fan Events", "Join live activations and community moments."],
          market: ["Marketplace", "Trade smarter and complete your premium set."],
          coach: ["Ask COACH IA", "Get strategy, tips and match-day guidance."],
          ranking: ["Leaderboard", "Climb the ladder and defend your position."],
        },
        badges: {
          packs: "NEW DROP",
          events: "LIVE",
          coach: "AI",
        },
        rarity: {
          LEGENDARY: "LEGENDARY",
          EPIC: "EPIC",
        },
      };

  const stats = [
    {
      label: copy.stats.totalXp,
      value: xp.toLocaleString(),
      hint: copy.stats.totalXpHint,
      gradientText: "from-[#FF7A18] via-[#FFB347] to-[#FFE29A]",
      border: "border-orange/20",
      glow: "rgba(255,94,0,0.18)",
      icon: Zap,
      iconColor: "#FF7A18",
    },
    {
      label: copy.stats.level,
      value: level.toString(),
      hint: copy.stats.levelHint,
      gradientText: "from-[#FF5E00] via-[#FF7A18] to-[#FFD36E]",
      border: "border-red/20",
      glow: "rgba(232,0,61,0.16)",
      icon: Crown,
      iconColor: "#FF5E00",
    },
    {
      label: copy.stats.stickers,
      value: stickerCount.toString(),
      hint: copy.stats.stickersHint,
      gradientText: "from-[#00D97E] via-[#6DFFB2] to-[#C9FFE3]",
      border: "border-green/20",
      glow: "rgba(0,217,126,0.16)",
      icon: Sparkles,
      iconColor: "#00D97E",
    },
    {
      label: copy.stats.streak,
      value: `${streakDays}d`,
      hint: copy.stats.streakHint,
      gradientText: "from-[#E8003D] via-[#FF5E00] to-[#FFB800]",
      border: "border-gold/20",
      glow: "rgba(255,184,0,0.16)",
      icon: Flame,
      iconColor: "#FFB800",
    },
  ];

  const actions = [
    {
      href: "/packs",
      label: copy.actions.packs[0],
      description: copy.actions.packs[1],
      icon: PackageOpen,
      bg: "from-[#4A1200] via-[#7A2D00] to-[#FF6A00]",
      glow: "rgba(255,94,0,0.22)",
      badge: copy.badges.packs,
      badgeColor: "text-orange bg-orange/10 border-orange/30",
    },
    {
      href: "/album",
      label: copy.actions.album[0],
      description: copy.actions.album[1],
      icon: BookOpen,
      bg: "from-[#2A1020] via-[#4A1233] to-[#E8003D]",
      glow: "rgba(232,0,61,0.20)",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/events",
      label: copy.actions.events[0],
      description: copy.actions.events[1],
      icon: CalendarDays,
      bg: "from-[#0C1E40] via-[#173D7A] to-[#4A6FFF]",
      glow: "rgba(74,111,255,0.20)",
      badge: copy.badges.events,
      badgeColor: "text-blue bg-blue/10 border-blue/30",
    },
    {
      href: "/marketplace",
      label: copy.actions.market[0],
      description: copy.actions.market[1],
      icon: ShoppingBag,
      bg: "from-[#082E25] via-[#0C5E46] to-[#00D97E]",
      glow: "rgba(0,217,126,0.18)",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/coach",
      label: copy.actions.coach[0],
      description: copy.actions.coach[1],
      icon: Bot,
      bg: "from-[#101A42] via-[#1B2C7A] to-[#4A6FFF]",
      glow: "rgba(74,111,255,0.20)",
      badge: copy.badges.coach,
      badgeColor: "text-blue bg-blue/10 border-blue/30",
    },
    {
      href: "/ranking",
      label: copy.actions.ranking[0],
      description: copy.actions.ranking[1],
      icon: Trophy,
      bg: "from-[#3A2600] via-[#7A5A00] to-[#FFB800]",
      glow: "rgba(255,184,0,0.20)",
      badge: null,
      badgeColor: "",
    },
  ];

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 pb-12 md:space-y-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 10%, rgba(74,111,255,0.22) 0%, transparent 55%)," +
              "radial-gradient(ellipse 50% 40% at 80% 15%, rgba(232,0,61,0.16) 0%, transparent 45%)," +
              "radial-gradient(ellipse 40% 60% at 50% 0%, rgba(255,94,0,0.10) 0%, transparent 50%)," +
              "linear-gradient(180deg, rgba(17,18,36,0.98) 0%, rgba(7,7,15,0.6) 60%, transparent 100%)",
          }}
        />
      </div>

      <section className="relative pt-2 md:pt-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 backdrop-blur-sm">
              <Crown className="h-3.5 w-3.5 text-orange" />
              <span className="font-condensed text-xs font-semibold uppercase tracking-widest text-orange">
                {fanTitle} · {copy.stats.level} {level}
              </span>
            </div>

            <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-t1 md:text-4xl lg:text-5xl">
              {copy.welcome},{" "}
              <span className="bg-gradient-to-r from-[#FF7A18] via-[#FFB347] to-[#FFE29A] bg-clip-text text-transparent">
                {username}
              </span>{" "}
              <span className="text-orange">🔥</span>
            </h1>

            <p className="mt-1.5 text-sm text-t2 md:text-base">{copy.intro}</p>
          </div>

          {missions.length > 0 && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card1/80 px-4 py-2.5 backdrop-blur-sm md:mt-0">
              <div className="relative h-10 w-10 flex-shrink-0">
                <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#FF5E00"
                    strokeWidth="3"
                    strokeDasharray={`${(missionCompletion / 100) * 94.25} 94.25`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-condensed text-[10px] font-bold text-orange">
                  {missionCompletion}%
                </span>
              </div>
              <div>
                <p className="text-xs text-t3">{copy.activeMissions}</p>
                <p className="font-condensed text-sm font-bold text-t1">{copy.inProgress(missions.length)}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={`group relative overflow-hidden rounded-2xl border ${s.border} bg-card1/70 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] md:p-5`}
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` }}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: s.glow, boxShadow: `0 0 12px ${s.glow}` }}>
                  <Icon className="h-4.5 w-4.5" style={{ color: s.iconColor }} />
                </div>
                <p className={`font-condensed text-2xl font-black leading-none tracking-tight bg-gradient-to-r ${s.gradientText} bg-clip-text text-transparent md:text-3xl`}>
                  {s.value}
                </p>
                <p className="mt-1 font-condensed text-xs font-semibold uppercase tracking-widest text-t3">{s.label}</p>
                <p className="mt-0.5 text-[11px] text-t2">{s.hint}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-condensed text-sm font-bold uppercase tracking-widest text-t2">{copy.activeMissions}</h2>
          <Link href={"/ranking" as Route} className="flex items-center gap-1 text-xs text-t3 transition-colors hover:text-orange">
            {copy.viewAll} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {missions.length === 0 ? (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card1/60 px-5 py-4 backdrop-blur-sm">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-card2 text-xl">🎯</div>
            <div>
              <p className="font-condensed text-sm font-bold text-t1">{copy.noMissions}</p>
              <p className="text-xs text-t3">{copy.noMissionsHint}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {missions.map((mission) => {
              const pct = mission.target > 0 ? Math.min(100, Math.round((mission.progress / mission.target) * 100)) : 0;
              return (
                <div key={mission.id} className="relative overflow-hidden rounded-2xl border border-border bg-card1/70 px-4 py-3.5 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-condensed text-sm font-bold text-t1">{mission.title}</p>
                      <p className="mt-0.5 truncate text-xs text-t3">{mission.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="font-condensed text-xs font-bold text-orange">{pct}%</span>
                      <p className="text-[10px] text-t3">{mission.progress}/{mission.target}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-card2">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <Zap className="h-3 w-3 text-gold" />
                    <span className="font-condensed text-[10px] font-bold text-gold">+{mission.xpReward} {copy.reward}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {activity.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-condensed text-sm font-bold uppercase tracking-widest text-t2">{copy.communityPulls}</h2>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
              <span className="text-xs text-t3">{copy.live}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card1/60 backdrop-blur-sm divide-y divide-border">
            {activity.map((item) => {
              const rarityColor = item.rarity === "LEGENDARY" ? "#E8003D" : "#FFB800";
              const diff = Date.now() - new Date(item.acquiredAt).getTime();
              const mins = Math.floor(diff / 60000);
              const hours = Math.floor(diff / 3600000);
              const days = Math.floor(diff / 86400000);
              const ago = days >= 1 ? `${days}d` : hours >= 1 ? `${hours}h` : mins >= 1 ? `${mins}m` : copy.justNow;

              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-condensed text-xs font-black" style={{ background: `${rarityColor}20`, color: rarityColor, border: `1px solid ${rarityColor}30` }}>
                    {item.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-t1">
                      <span className="font-bold">{item.username}</span> {copy.unlocked}{" "}
                      <span className="font-bold" style={{ color: rarityColor }}>{item.stickerName}</span>
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="rounded-full px-2 py-0.5 font-condensed text-[9px] font-black uppercase tracking-wider" style={{ background: `${rarityColor}15`, color: rarityColor, border: `1px solid ${rarityColor}30` }}>
                      {copy.rarity[item.rarity]}
                    </span>
                    <span className="text-[10px] text-t3">{ago}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-condensed text-sm font-bold uppercase tracking-widest text-t2">{copy.quickActions}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href as Route}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-300 hover:scale-[1.025] hover:border-white/10 active:scale-[0.98]"
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px ${action.glow}, inset 0 1px 0 rgba(255,255,255,0.08)` }}
              >
                <div className="relative p-4 md:p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm" style={{ boxShadow: `0 0 20px ${action.glow}` }}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {action.badge && (
                      <span className={`rounded-full border px-2 py-0.5 font-condensed text-[10px] font-bold uppercase tracking-wider ${action.badgeColor}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="font-condensed text-base font-black tracking-tight text-white md:text-lg">{action.label}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-white/60">{action.description}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-white/40 transition-all duration-200 group-hover:gap-2 group-hover:text-white/70">
                    <span className="font-condensed text-xs font-bold uppercase tracking-wider">{copy.go}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
