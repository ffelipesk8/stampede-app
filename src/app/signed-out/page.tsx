"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const REDIRECT_SECONDS = 8;

export default function SignedOutPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/");
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, router]);

  const circumference = 2 * Math.PI * 22; // r=22
  const progress = ((REDIRECT_SECONDS - seconds) / REDIRECT_SECONDS) * circumference;

  return (
    <main className="min-h-screen bg-[#050509] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #E8650A 0%, transparent 70%)" }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md text-center">

        {/* Ball emoji with glow */}
        <div
          className="text-7xl mb-6 block"
          style={{ filter: "drop-shadow(0 0 32px rgba(232,101,10,0.5))" }}
        >
          ⚽
        </div>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
          Hasta pronto!
        </h1>
        <p className="text-[#8888AA] text-base mb-1">
          Tu sesion se cerro correctamente.
        </p>
        <p className="text-[#6666888] text-sm mb-8">
          El Mundial 2026 te espera. Vuelve pronto para seguir completando tu album.
        </p>

        {/* Countdown ring */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24" cy="24" r="22"
                fill="none"
                stroke="#1a1a2e"
                strokeWidth="3"
              />
              <circle
                cx="24" cy="24" r="22"
                fill="none"
                stroke="#E8650A"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.9s linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
              {seconds}
            </span>
          </div>
          <p className="text-xs text-[#666888]">
            Redirigiendo al inicio en {seconds}s...
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #E8650A, #FF5E00)",
              boxShadow: "0 0 20px rgba(232,101,10,0.3)",
            }}
          >
            Iniciar sesion de nuevo
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-sm border border-[#2a2a4a] text-[#8888AA] hover:border-[#E8650A] hover:text-white transition-all"
          >
            Ir al inicio
          </Link>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-6 border-t border-[#1a1a2e]">
          <p className="text-[10px] text-[#444466] uppercase tracking-widest font-bold">
            FANPACK 26 -- World Cup 2026 Fan Album
          </p>
        </div>
      </div>
    </main>
  );
}
