import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060D] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(232,0,61,0.95) 0%, rgba(255,94,0,0.7) 42%, transparent 72%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 top-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0C14]/90 shadow-[0_30px_100px_rgba(0,0,0,0.45)] lg:min-h-[680px] lg:flex-row">
        <section className="flex flex-1 flex-col justify-between border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div>
            <Link href="/" className="font-condensed text-3xl font-black tracking-widest">
              <span className="text-[#E8003D]">K</span>
              <span className="text-[#FF5E00]">A</span>
              <span className="text-[#FFB800]">R</span>
              <span className="text-white">TAZO</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/65 sm:text-base">
              Tu album digital del Mundial 2026. Abre sobres, completa tu coleccion,
              presume tus cartas y entra al ranking global.
            </p>
          </div>

          <div className="mt-10 hidden gap-4 lg:grid">
            {[
              { title: "Sobres diarios", desc: "Reclama tu pack gratis y vuelve cada dia por nuevas cartas." },
              { title: "Cartas sociales", desc: "Comparte tus fotos con jugadores y conviertelas en cartas de tu album." },
              { title: "Ranking fan", desc: "Sube de nivel, gana XP y compite con otros hinchas." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <p className="font-bold text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
