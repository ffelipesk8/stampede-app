import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getFanTitle, xpForLevel } from "@/lib/xp";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { QueryProvider } from "@/components/providers/QueryProvider";
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
        <div className="flex min-h-screen">
          <AppSidebar user={user} xpProgress={xpProgress} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar xp={user.xp} coins={user.coins} />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </LanguageProvider>
    </QueryProvider>
  );
}
