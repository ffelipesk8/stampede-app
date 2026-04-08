import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getFanTitle } from "@/lib/xp";
import Link from "next/link";
import { PaymentStatusBanner } from "@/components/upgrade/PaymentStatusBanner";

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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PaymentStatusBanner
        initialIsPro={user.isPro}
        payment={searchParams?.payment}
        plan={searchParams?.plan}
      />

      {/* Welcome header */}
      <div>
        <h1 className="font-condensed text-4xl font-black text-t1 tracking-wide">
          Welcome back, <span className="text-fire">{user.username}</span> 🔥
        </h1>
        <p className="text-t2 mt-1">Level {user.level} · {fanTitle}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total XP",      value: user.xp.toLocaleString(), color: "text-gold" },
          { label: "Level",          value: user.level,               color: "text-orange" },
          { label: "Stickers",       value: user._count.stickers,      color: "text-green" },
          { label: "Streak",         value: `${user.streakDays}d 🔥`,  color: "text-red" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card1 border border-border rounded-xl p-4">
            <p className="text-t3 text-xs font-medium mb-1">{label}</p>
            <p className={`font-condensed text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Active missions */}
      <div>
        <h2 className="font-display font-bold text-t1 text-lg mb-4">Active Missions</h2>
        <div className="space-y-3">
          {user.missions.length === 0 ? (
            <p className="text-t3 text-sm">No active missions. Check back tomorrow!</p>
          ) : (
            user.missions.map((um) => (
              <div key={um.id} className="bg-card1 border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-t1 font-medium text-sm">{um.mission.title}</p>
                  <p className="text-t3 text-xs mt-0.5">{um.mission.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold font-bold text-sm">+{um.mission.xpReward} XP</p>
                  <p className="text-t3 text-xs">{um.progress} / {um.target}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display font-bold text-t1 text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { href: "/packs",       label: "Open a Pack",    emoji: "📦", color: "border-orange/30 hover:border-orange/60" },
            { href: "/album",       label: "My Album",       emoji: "🎴", color: "border-red/30 hover:border-red/60" },
            { href: "/events",      label: "Fan Events",     emoji: "📍", color: "border-blue/30 hover:border-blue/60" },
            { href: "/marketplace", label: "Marketplace",    emoji: "🔁", color: "border-green/30 hover:border-green/60" },
            { href: "/coach",       label: "Ask COACH IA",   emoji: "🤖", color: "border-blue/30 hover:border-blue/60" },
            { href: "/ranking",     label: "Leaderboard",    emoji: "🏆", color: "border-gold/30 hover:border-gold/60" },
          ].map(({ href, label, emoji, color }) => (
            <Link
              key={href}
              href={href as never}
              className={`bg-card1 border rounded-xl p-4 flex items-center gap-3 transition-all ${color}`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="font-display font-semibold text-t1 text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
