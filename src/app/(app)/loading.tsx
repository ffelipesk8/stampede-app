"use client";

export default function AppLoading() {
  return (
    <div className="relative min-h-[60vh] overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(15,16,28,0.96),rgba(7,8,14,0.98))] px-5 py-6 sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,94,0,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(74,111,255,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(232,0,61,0.1),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.65)_1px,transparent_1px)] [background-size:34px_34px]" />
      </div>

      <div className="relative z-10 space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-3 w-28 rounded-full bg-white/10" />
          <div className="h-10 w-full max-w-[440px] rounded-2xl bg-white/8" />
          <div className="h-4 w-full max-w-[320px] rounded-full bg-white/6" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4 backdrop-blur-sm"
            >
              <div className="mb-3 h-3 w-20 rounded-full bg-white/10" />
              <div className="h-8 w-24 rounded-xl bg-white/12" />
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.035] p-4">
            <div className="mb-4 h-4 w-40 rounded-full bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-16 rounded-2xl bg-white/[0.05]" />
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.035] p-4">
            <div className="mb-4 h-4 w-32 rounded-full bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-10 rounded-xl bg-white/[0.05]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
