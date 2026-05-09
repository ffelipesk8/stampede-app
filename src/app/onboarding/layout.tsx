import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { OnboardingFrame } from "@/components/onboarding/OnboardingFrame";
import { syncUserDailyStreak } from "@/lib/auth";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  await syncUserDailyStreak(user.id);

  // Already completed onboarding
  if (user.onboardingStep >= 5) redirect("/dashboard");

  return <OnboardingFrame>{children}</OnboardingFrame>;
}
