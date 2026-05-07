"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root app error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07070F] px-6 text-[#F2F2FF]">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.4)] md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#FF5E00]">
          KARTAZO
        </p>
        <h1 className="mt-4 font-condensed text-4xl font-black text-white md:text-6xl">
          Algo no cargo como esperabamos
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/65 md:text-base">
          La aplicacion encontro un error inesperado. Puedes intentarlo de nuevo
          o volver al inicio mientras recuperamos la sesion.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-2xl bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] px-6 py-3 font-black text-white transition hover:opacity-90"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-2xl border border-white/10 px-6 py-3 font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
