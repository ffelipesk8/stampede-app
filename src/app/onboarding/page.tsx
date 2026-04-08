import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default async function OnboardingPage() {
  const user = await getAuthUser();

  // Route to correct step
  if (user.onboardingStep >= 5) redirect("/dashboard");
  if (user.onboardingStep >= 4) redirect("/onboarding/invite");
  if (user.onboardingStep >= 3) redirect("/onboarding/tutorial");
  if (user.onboardingStep >= 2) redirect("/onboarding/pack");
  redirect("/onboarding/team");
}
