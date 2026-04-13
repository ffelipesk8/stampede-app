import { auth } from "@clerk/nextjs/server";
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
import { redirect } from "next/navigation";
import { PaymentStatusBanner } from "@/components/upgrade/PaymentStatusBanner";
import { db } from "@/lib/db";
import { getFanTitle } from "@/lib/xp";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { payment?: string; plan?: string };
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      missions: {
        where: { status: "ACTIVE" },
        include: { mission: true },
        take: 3,
        orderBy: { expiresAt: "asc" },
      },
      _count: { select: { stickers: true, badges: true } },
    },
  });

  if (!user) redirect("/sign-in");

  const fanTitle = getFanTitle(user.level);
  const missionCompletion = user.missions.length
    ? Math.round(
        user.missions.reduce((acc, mission) => {
          if (mission.target <= 0) return acc;
          return acc + Math.min(100, Math.round((mission.progress / mission.target) * 100));
        }, 0) / user.missions.length
      )
    : 0;

  const stats = [
    {
      label: "Total XP",
      value: user.xp.toLocaleString(),
      hint: "Career progression",
      gradientText: "from-[#FF7A18] via-[#FFB347] to-[#FFE29A]",
      border: "border-orange/20",
      glow: "rgba(255,94,0,0.18)",
      icon: Zap,
      iconColor: "#FF7A18",
    },
    {
      label: "Level",
      value: user.level.toString(),
      hint: fanTitle,
      gradientText: "from-[#FF5E00] via-[#FF7A18] to-[#FFD36E]",
      border: "border-red/20",
      glow: "rgba(232,0,61,0.16)",
      icon: Crown,
      iconColor: "#FF5E00",
    },
    {
      label: "Stickers",
      value: user._count.stickers.toString(),
      hint: "Collected so far",
      gradientText: "from-[#00D97E] via-[#6DFFB2] to-[#C9FFE3]",
      border: "border-green/20",
      glow: "rgba(0,217,126,0.16)",
      icon: Sparkles,
      iconColor: "#00D97E",
    },
    {
      label: "Streak",
      value: `${user.streakDays}d`,
      hint: user.streakDays > 0 ? "Momentum active" : "Start your run",
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
      label: "Open a Pack",
      description: "Unlock fresh drops and chase rare cards.",
      icon: PackageOpen,
      bg: "from-[#4A1200] via-[#7A2D00] to-[#FF6A00]",
      glow: "rgba(255,94,0,0.22)",
      badge: "NEW DROP",
      badgeColor: "text-orange bg-orange/10 border-orange/30",
    },
    {
      href: "/album",
      label: "My Album",
      description: "Review your collection and hunt missing slots.",
      icon: BookOpen,
      bg: "from-[#2A1020] via-[#4A1233] to-[#E8003D]",
      glow: "rgba(232,0,61,0.20)",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/events",
      label: "Fan Events",
      description: "Join live activations and community moments.",
      icon: CalendarDays,
      bg: "from-[#0C1E40] via-[#173D7A] to-[#4A6FFF]",
      glow: "rgba(74,111,255,0.20)",
      badge: "LIVE",
      badgeColor: "text-blue bg-blue/10 border-blue/30",
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      description: "Trade smarter and complete your premium set.",
      icon: ShoppingBag,
      bg: "from-[#082E25] via-[#0C5E46] to-[#00D97E]",
      glow: "rgba(0,217,126,0.18)",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/coach",
      label: "Ask COACH IA",
      description: "Get strategy, tips and match-day guidance.",
      icon: Bot,
      bg: "from-[#101A42] via-[#1B2C7A] to-[#4A6FFF]",
      glow: "rgba(74,111,255,0.20)",
      badge: "AI",
      badgeColor: "text-blue bg-blue/10 border-blue/30",
    },
    {
      href: "/ranking",
      label: "Leaderboard",
      description: "Climb the ladder and defend your position.",
      icon: Trophy,
      bg: "from-[#3A2600] via-[#7A5A00] to-[#FFB800]",
      glow: "rgba(255,184,0,0.20)",
      badge: null,
      badgeColor: "",
    },
  ];

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 pb-12 md:space-y-8">
      {/* ── Payment banner ── */}
      {searchParams?.payment && (
        <PaymentStatusBanner
          initialIsPro={user.isPro ?? false}
          payment={searchParams.payment}
          plan={searchParams.plan}
        />
      )}

      {/* ── Cinematic hero background ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden">
        {/* Multi-layer radial atmosphere */}
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
        {/* Subtle grid overlay — AAA game HUD feel */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Bloom orbs */}
        <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-blue/15 blur-[90px]" />
        <div className="absolute right-8 top-4 h-48 w-48 rounded-full bg-red/12 blur-[70px]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-56 w-96 rounded-full bg-orange/08 blur-[100px]" />
      </div>

      {/* ── HERO — Welcome header ── */}
      <section className="relative pt-2 md:pt-4">
        {/* Title row */}
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            {/* Fan title badge */}
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 backdrop-blur-sm">
              <Crown className="h-3.5 w-3.5 text-orange" />
              <span className="font-condensed text-xs font-semibold uppercase tracking-widest text-orange">
                {fanTitle} · Level {user.level}
              </span>
            </div>

            <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-t1 md:text-4xl lg:text-5xl">
              Welcome back,{" "}
              <span
                className="bg-gradient-to-r from-[#FF7A18] via-[#FFB347] to-[#FFE29A] bg-clip-text text-transparent"
              >
                {user.username}
              </span>{" "}
              <span className="text-orange">🔥</span>
            </h1>

            <p className="mt-1.5 text-sm text-t2 md:text-base">
              Your path to the{" "}
              <span className="font-semibold text-gold">World Cup 2026</span>{" "}
              collection starts here.
            </p>
          </div>

          {/* Missions summary pill */}
          {user.missions.length > 0 && (
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
                <p className="text-xs text-t3">Active Missions</p>
                <p className="font-condensed text-sm font-bold text-t1">
                  {user.missions.length} in progress
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── STAT CARDS ── */}
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
                {/* Ambient glow on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${s.glow} 0%, transparent 70%)` }}
                />

                {/* Icon */}
                <div
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${s.glow.replace("0.18", "0.15").replace("0.16", "0.15")}`, boxShadow: `0 0 12px ${s.glow}` }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ color: s.iconColor }} />
                </div>

                {/* Value */}
                <p
                  className={`font-condensed text-2xl font-black leading-none tracking-tight bg-gradient-to-r ${s.gradientText} bg-clip-text text-transparent md:text-3xl`}
                >
                  {s.value}
                </p>

                {/* Label / hint */}
                <p className="mt-1 font-condensed text-xs font-semibold uppercase tracking-widest text-t3">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[11px] text-t2">{s.hint}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MISSIONS ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-condensed text-sm font-bold uppercase tracking-widest text-t2">
            Active Missions
          </h2>
          <Link
            href="/ranking"
            className="flex items-center gap-1 text-xs text-t3 transition-colors hover:text-orange"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {user.missions.length === 0 ? (
          <div
            className="flex items-center gap-4 rounded-2xl border border-border bg-card1/60 px-5 py-4 backdrop-blur-sm"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.03)" }}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-card2 text-xl">
              🎯
            </div>
            <div>
              <p className="font-condensed text-sm font-bold text-t1">No active missions right now</p>
              <p className="text-xs text-t3">New challenges unlock daily — check back tomorrow.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {user.missions.map((um) => {
              const pct = um.target > 0 ? Math.min(100, Math.round((um.progress / um.target) * 100)) : 0;
              return (
                <div
                  key={um.id}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card1/70 px-4 py-3.5 backdrop-blur-sm"
                  style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-condensed text-sm font-bold text-t1">{um.mission.title}</p>
                      <p className="mt-0.5 truncate text-xs text-t3">{um.mission.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="font-condensed text-xs font-bold text-orange">{pct}%</span>
                      <p className="text-[10px] text-t3">
                        {um.progress}/{um.target}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-card2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {/* XP reward badge */}
                  <div className="mt-2 flex items-center gap-1">
                    <Zap className="h-3 w-3 text-gold" />
                    <span className="font-condensed text-[10px] font-bold text-gold">
                      +{um.mission.xpReward} XP reward
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section>
        <h2 className="mb-3 font-condensed text-sm font-bold uppercase tracking-widest text-t2">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href as Route}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-300 hover:scale-[1.025] hover:border-white/10 active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${action.bg.replace("from-", "").replace("via-", "").replace("to-", "").split(" ").join(", ")})`,
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px ${action.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                {/* Hover shimmer */}
                <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />

                <div className="relative p-4 md:p-5">
                  {/* Top row: icon + badge */}
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm"
                      style={{ boxShadow: `0 0 20px ${action.glow}` }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {action.badge && (
                      <span className={`rounded-full border px-2 py-0.5 font-condensed text-[10px] font-bold uppercase tracking-wider ${action.badgeColor}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="mt-3">
                    <p className="font-condensed text-base font-black tracking-tight text-white md:text-lg">
                      {action.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/60 line-clamp-2">
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="mt-3 flex items-center gap-1 text-white/40 transition-all duration-200 group-hover:gap-2 group-hover:text-white/70">
                    <span className="font-condensed text-xs font-bold uppercase tracking-wider">Go</span>
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
