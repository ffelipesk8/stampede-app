import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  // Already completed onboarding
  if (user.onboardingStep >= 5) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-[#07070F]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] bg-clip-text text-transparent">
            STAMPEDE
          </span>
        </div>
        <span className="text-right text-xs text-white/40 sm:text-sm">Setting up your account...</span>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-start justify-center px-3 pb-8 pt-3 sm:items-center">
        {children}
      </main>
    </div>
  );
}
