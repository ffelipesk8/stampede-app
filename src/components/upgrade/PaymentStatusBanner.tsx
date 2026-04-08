"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PaymentState = "idle" | "processing" | "success" | "cancelled" | "error";

interface PaymentStatusBannerProps {
  initialIsPro: boolean;
  payment: string | undefined;
  plan: string | undefined;
}

export function PaymentStatusBanner({
  initialIsPro,
  payment,
  plan,
}: PaymentStatusBannerProps) {
  const [isPro, setIsPro] = useState(initialIsPro);
  const [state, setState] = useState<PaymentState>(() => {
    if (initialIsPro) return "success";
    if (payment === "cancelled") return "cancelled";
    if (payment === "error") return "error";
    if (payment === "processing" || payment === "pending") return "processing";
    return "idle";
  });

  useEffect(() => {
    if (state !== "processing" || isPro) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 15;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data.isPro) {
          setIsPro(true);
          setState("success");
          return;
        }
      } catch {
        if (cancelled) return;
      }

      if (!cancelled && attempts < maxAttempts) {
        window.setTimeout(poll, 4000);
      }
    };

    const timer = window.setTimeout(poll, 2500);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [state, isPro]);

  if (state === "idle") return null;

  const planLabel = plan === "yearly" ? "Yearly PRO" : plan === "monthly" ? "Monthly PRO" : "PRO";

  if (state === "success") {
    return (
      <div className="bg-green/10 border border-green/30 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl">✓</span>
        <div>
          <p className="text-green font-bold text-sm">{planLabel} activated</p>
          <p className="text-t2 text-sm mt-1">
            Your PRO perks are active now. Enjoy the bonus packs, border and AI access.
          </p>
        </div>
      </div>
    );
  }

  if (state === "cancelled") {
    return (
      <div className="bg-card1 border border-border rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl">•</span>
        <div>
          <p className="text-t1 font-bold text-sm">Payment cancelled</p>
          <p className="text-t2 text-sm mt-1">
            No charge was completed. You can try again whenever you want from{" "}
            <Link href="/upgrade" className="text-orange hover:underline">
              the upgrade page
            </Link>.
          </p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="bg-red/10 border border-red/30 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl">!</span>
        <div>
          <p className="text-red font-bold text-sm">We could not confirm your payment</p>
          <p className="text-t2 text-sm mt-1">
            If Wompi charged you but PRO is still not active, wait a minute and refresh. If needed, try again from{" "}
            <Link href="/upgrade" className="text-orange hover:underline">
              upgrade
            </Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue/10 border border-blue/30 rounded-xl p-4 flex items-start gap-3">
      <span className="text-2xl">...</span>
      <div>
        <p className="text-blue font-bold text-sm">Checking your Wompi payment</p>
        <p className="text-t2 text-sm mt-1">
          We are waiting for confirmation from Wompi. This page will update automatically when your PRO access is activated.
        </p>
      </div>
    </div>
  );
}
