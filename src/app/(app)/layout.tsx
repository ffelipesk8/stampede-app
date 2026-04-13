import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { xpForLevel } from "@/lib/xp";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppSceneTransition } from "@/components/shared/AppSceneTransition";
import { LanguageProvider } from "@/contexts/LanguageContext";

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  let user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true, username: true, level: true, xp: true, coins: true, avatarUrl: true, favoriteTeam: true, onboardingStep: true, isPro: true },
  });

  // Auto-crear usuario si no existe (para desarrollo local sin webhook)
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const baseUsername = clerkUser.username ?? email.split("@")[0];
    const username = baseUsername + Math.floor(Math.random() * 1000);

    user = await db.user.create({
      data: {
        clerkId,
        email,
        username,
        avatarUrl: clerkUser.imageUrl ?? "",
        referralCode: generateReferralCode(),
      },
      select: { id: true, username: true, level: true, xp: true, coins: true, avatarUrl: true, favoriteTeam: true, onboardingStep: true, isPro: true },
    });
  }

  // Redirect to onboarding if not complete (desactiva en local poniendo SKIP_ONBOARDING=true en .env)
  if (user.onboardingStep < 5 && process.env.SKIP_ONBOARDING !== "true") redirect("/onboarding");

  // XP progress for current level
  const xpForCurrentLevel = xpForLevel(user.level);
  const xpInLevel = user.xp % xpForCurrentLevel; // simplified
  const xpProgress = {
    current: xpInLevel,
    needed: xpForCurrentLevel,
    pct: Math.round((xpInLevel / xpForCurrentLevel) * 100),
  };

  return (
    <QueryProvider>
      <LanguageProvider>
        {/* ── Root shell ── */}
        <div className="relative flex min-h-screen overflow-hidden bg-[#05060D]">
          {/* Global ambient background */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,111,255,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(232,0,61,0.08),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(0,217,126,0.06),transparent_30%)]" />
            <div
              className="absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          {/* ── Sidebar (desktop) ── */}
          <AppSidebar user={user} xpProgress={xpProgress} />

          {/* ── Main content column ── */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Top bar */}
            <TopBar xp={user.xp} coins={user.coins ?? 0} />

            {/* Page content with scene transition */}
            <main className="relative flex-1 overflow-auto">
              <div className="mx-auto px-4 py-5 md:px-6 md:py-6 lg:px-8">
                <AppSceneTransition>{children}</AppSceneTransition>
              </div>
            </main>
          </div>
        </div>
      </LanguageProvider>
    </QueryProvider>
  );
}
