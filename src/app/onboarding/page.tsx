import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function OnboardingPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  // Route to correct step
  if (user.onboardingStep >= 5) redirect("/dashboard");
  if (user.onboardingStep >= 4) redirect("/onboarding/invite");
  if (user.onboardingStep >= 3) redirect("/onboarding/tutorial");
  if (user.onboardingStep >= 2) redirect("/onboarding/pack");
  redirect("/onboarding/team");
}
