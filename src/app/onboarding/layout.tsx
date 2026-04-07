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
    <div className="min-h-screen bg-[#07070F] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] bg-clip-text text-transparent">
            STAMPEDE
          </span>
        </div>
        <span className="text-sm text-white/40">Setting up your account…</span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
