"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: "#FF5E00",
          colorBackground: "#0B0F18",
          colorInputBackground: "#111522",
          colorInputText: "#F4F4FF",
          colorText: "#F4F4FF",
          colorTextSecondary: "rgba(255,255,255,0.65)",
          colorNeutral: "rgba(255,255,255,0.16)",
          borderRadius: "18px",
        },
        elements: {
          rootBox: "w-full flex justify-center",
          card: "shadow-none bg-transparent border border-white/10 rounded-[28px] w-full max-w-md",
          headerTitle: "text-white text-3xl font-black",
          headerSubtitle: "text-white/60",
          socialButtonsBlockButton:
            "bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08]",
          formButtonPrimary:
            "bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] text-white hover:opacity-90 shadow-[0_16px_40px_rgba(232,0,61,0.28)]",
          footerActionLink: "text-[#FFB800] hover:text-white",
          formFieldInput:
            "bg-[#111522] border border-white/10 text-white focus:border-[#FF5E00] focus:ring-[#FF5E00]",
          formFieldLabel: "text-white/80",
          identityPreviewText: "text-white",
          formResendCodeLink: "text-[#FFB800] hover:text-white",
        },
      }}
    />
  );
}
