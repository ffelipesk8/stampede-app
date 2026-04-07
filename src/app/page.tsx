import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LandingStickerPreview } from "@/components/landing/LandingStickerPreview";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-[#07070F] text-[#F2F2FF] overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12"
           style={{ background: "rgba(7,7,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="font-condensed text-2xl font-black tracking-widest select-none">
          <span style={{ color: "#E8003D" }}>S</span>
          <span style={{ color: "#FF5E00" }}>T</span>
          <span style={{ color: "#FFB800" }}>A</span>
          <span className="text-white">MPEDE</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={"/sign-in" as never}
            className="text-sm font-semibold text-[#aaaacc] hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href={"/sign-up" as never}
            className="text-sm font-black px-5 py-2.5 rounded-xl transition-all"
            style={{ background: "linear-gradient(135deg,#E8003D,#FF5E00)", color: "#fff", boxShadow: "0 0 20px rgba(232,0,61,0.4)" }}>
            Join Free →
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full blur-[120px] opacity-25"
               style={{ width: 600, height: 600, top: "10%", left: "50%", transform: "translateX(-50%)",
                        background: "radial-gradient(circle, #E8003D 0%, #FF5E00 40%, transparent 70%)" }} />
          <div className="absolute rounded-full blur-[100px] opacity-15"
               style={{ width: 400, height: 400, bottom: "10%", right: "5%",
                        background: "#FFB800" }} />
          <div className="absolute rounded-full blur-[80px] opacity-10"
               style={{ width: 300, height: 300, bottom: "20%", left: "5%",
                        background: "#4A6FFF" }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px" }} />
        </div>

        {/* World Cup 2026 badge */}
        <div className="relative z-10 inline-flex items-center gap-2 border border-[#FFB800]/30 rounded-full px-4 py-1.5 mb-8 text-xs font-black tracking-widest uppercase"
             style={{ background: "rgba(255,184,0,0.08)", color: "#FFB800" }}>
          <span>⚽</span>
          <span>FIFA World Cup 2026 · USA · Canada · México</span>
        </div>

        {/* Main headline */}
        <h1 className="relative z-10 font-condensed font-black leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}>
          <span style={{ background: "linear-gradient(135deg,#E8003D 0%,#FF5E00 45%,#FFB800 100%)",
                         WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                         backgroundClip: "text" }}>
            DON&apos;T JUST
          </span>
          <br />
          <span className="text-white">WATCH IT.</span>
          <br />
          <span style={{ background: "linear-gradient(135deg,#FFB800 0%,#FF5E00 55%,#E8003D 100%)",
                         WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                         backgroundClip: "text" }}>
            PLAY IT.
          </span>
        </h1>

        <p className="relative z-10 text-lg md:text-xl text-[#aaaacc] max-w-xl mb-10 leading-relaxed">
          The ultimate digital fan experience for <strong className="text-white">World Cup 2026</strong> —
          collect stickers, compete with fans worldwide, and live the tournament like never before.
        </p>

        {/* CTA buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 mb-16">
          <Link href={"/sign-up" as never}
            className="inline-flex items-center gap-2 font-black text-base px-8 py-4 rounded-2xl transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#E8003D,#FF5E00)", color: "#fff",
                     boxShadow: "0 0 40px rgba(232,0,61,0.45), 0 4px 20px rgba(0,0,0,0.4)" }}>
            🚀 Start Collecting Free
          </Link>
          <a href="#features"
            className="inline-flex items-center gap-2 font-semibold text-base px-8 py-4 rounded-2xl transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#ccc" }}>
            See How It Works ↓
          </a>
        </div>

        {/* Live stats bar */}
        <div className="relative z-10 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { val: "5B+",  lbl: "Global Viewers",  icon: "📺" },
            { val: "48",   lbl: "Match Days",       icon: "📅" },
            { val: "32",   lbl: "Nations",          icon: "🌍" },
            { val: "800+", lbl: "Stickers",         icon: "🃏" },
            { val: "FREE", lbl: "To Start",         icon: "🎁" },
          ].map(({ val, lbl, icon }) => (
            <div key={val} className="text-center">
              <div className="text-xl mb-0.5">{icon}</div>
              <div className="font-condensed font-black text-2xl md:text-3xl"
                   style={{ background: "linear-gradient(135deg,#E8003D,#FFB800)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text" }}>
                {val}
              </div>
              <div className="text-[#555577] text-xs font-medium mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-40">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white" />
          <div className="text-[10px] tracking-widest uppercase text-white">Scroll</div>
        </div>
      </section>

      {/* ── STICKER PREVIEW STRIP ───────────────────────────────────────────── */}
      <section className="py-16 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="text-center mb-10 px-6">
          <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#FF5E00" }}>800+ Cards</span>
          <h2 className="font-condensed text-4xl md:text-5xl font-black text-white mt-2">
            Your Digital <span style={{ color: "#FFB800" }}>Sticker Album</span>
          </h2>
          <p className="text-[#888899] mt-3 max-w-md mx-auto">Players, coaches, stadiums, host cities — collect them all and complete your album</p>
        </div>

        {/* Infinite scroll strip */}
        <div className="relative">
          <div className="flex gap-4 animate-marquee" style={{ width: "max-content" }}>
            {[...SAMPLE_STICKERS, ...SAMPLE_STICKERS].map((s, i) => (
              <LandingStickerPreview key={i} {...s} />
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-24 pointer-events-none"
               style={{ background: "linear-gradient(to right, #07070F, transparent)" }} />
          <div className="absolute inset-y-0 right-0 w-24 pointer-events-none"
               style={{ background: "linear-gradient(to left, #07070F, transparent)" }} />
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#E8003D" }}>Everything You Need</span>
          <h2 className="font-condensed text-4xl md:text-5xl font-black text-white mt-2">
            More Than a Game
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#FFB800" }}>Simple & Fun</span>
            <h2 className="font-condensed text-4xl md:text-5xl font-black text-white mt-2">
              How STAMPEDE Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
                 style={{ background: "linear-gradient(to right, #E8003D, #FF5E00, #FFB800, #4A6FFF)" }} />
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center text-center gap-3 relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl relative z-10 border border-white/10"
                     style={{ background: s.bg, boxShadow: `0 0 30px ${s.glow}40` }}>
                  {s.icon}
                </div>
                <div className="font-black text-xs tracking-widest" style={{ color: s.glow }}>STEP {i + 1}</div>
                <div className="font-bold text-white text-base">{s.title}</div>
                <div className="text-[#666888] text-sm leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RARITY SHOWCASE ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#A855F7" }}>Collect & Trade</span>
          <h2 className="font-condensed text-4xl md:text-5xl font-black text-white mt-2">
            5 Rarity Levels
          </h2>
          <p className="text-[#888899] mt-3">From everyday Common cards to one-in-a-million Legendaries</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {RARITIES.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all hover:scale-105"
                 style={{ borderColor: r.color, background: `${r.color}12`, boxShadow: `0 0 20px ${r.color}20` }}>
              <span className="text-3xl">{r.icon}</span>
              <span className="font-black text-sm tracking-wide" style={{ color: r.color }}>{r.name}</span>
              <span className="text-[#555577] text-xs text-center max-w-[100px] leading-tight">{r.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-condensed text-3xl md:text-4xl font-black text-white text-center mb-12">
            The World Cup is <span style={{ color: "#FF5E00" }}>Global.</span> So is STAMPEDE.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12">
            {[
              { val: "48",    lbl: "Host Cities",    icon: "🏙️" },
              { val: "16",    lbl: "Venues",          icon: "🏟️" },
              { val: "32+",   lbl: "Countries",       icon: "🌎" },
              { val: "6",     lbl: "Languages",       icon: "🌐" },
            ].map(({ val, lbl, icon }) => (
              <div key={val} className="p-6 rounded-2xl border border-white/8"
                   style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-condensed font-black text-4xl text-white">{val}</div>
                <div className="text-[#555577] text-sm mt-1">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full blur-[100px] opacity-20 w-96 h-96 -top-20 left-1/2 -translate-x-1/2"
               style={{ background: "radial-gradient(circle, #E8003D, #FF5E00)" }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-6">⚽</div>
          <h2 className="font-condensed font-black text-white mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1 }}>
            THE TOURNAMENT<br />
            <span style={{ background: "linear-gradient(135deg,#E8003D,#FF5E00,#FFB800)",
                           WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                           backgroundClip: "text" }}>
              STARTS NOW.
            </span>
          </h2>
          <p className="text-[#888899] text-lg mb-10">
            Free to join. Collect your first pack today.
          </p>
          <Link href={"/sign-up" as never}
            className="inline-flex items-center gap-3 font-black text-lg px-10 py-5 rounded-2xl transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#E8003D,#FF5E00,#FFB800)", color: "#fff",
                     boxShadow: "0 0 60px rgba(232,0,61,0.5), 0 8px 30px rgba(0,0,0,0.5)" }}>
            🚀 Join STAMPEDE Free
          </Link>
          <p className="text-[#333355] text-xs mt-4">No credit card · Instant access · 6 languages</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-condensed text-xl font-black tracking-widest">
          <span style={{ color: "#E8003D" }}>S</span>
          <span style={{ color: "#FF5E00" }}>T</span>
          <span style={{ color: "#FFB800" }}>A</span>
          <span className="text-white">MPEDE</span>
        </div>
        <p className="text-[#333355] text-xs text-center">
          © 2026 STAMPEDE · World Cup Fan Platform · Not affiliated with FIFA
        </p>
        <div className="flex gap-6 text-[#333355] text-xs">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
        </div>
      </footer>

      {/* ── MARQUEE CSS ─────────────────────────────────────────────────────── */}
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      ` }} />
    </main>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SAMPLE_STICKERS = [
  { name: "Lionel Messi",     team: "ARG", rarity: "LEGENDARY", cat: "player",  flag: "🇦🇷", color: "#FFB800", bg1: "#74ACDF", bg2: "#FFFFFF", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/440px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg" },
  { name: "Kylian Mbappé",    team: "FRA", rarity: "LEGENDARY", cat: "player",  flag: "🇫🇷", color: "#FFB800", bg1: "#002395", bg2: "#ED2939", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93110_%28cropped%29.jpg/440px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93110_%28cropped%29.jpg" },
  { name: "MetLife Stadium",  team: "USA", rarity: "EPIC",      cat: "stadium", flag: "🏟️", color: "#A855F7", bg1: "#002868", bg2: "#BF0A30", img: "/images/stickers/stadiums/metlife-stadium.svg" },
  { name: "Jude Bellingham",  team: "ENG", rarity: "EPIC",      cat: "player",  flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#A855F7", bg1: "#CF081F", bg2: "#FFFFFF", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Jude_Bellingham_2022_%28cropped%29.jpg/440px-Jude_Bellingham_2022_%28cropped%29.jpg" },
  { name: "Vinícius Jr",      team: "BRA", rarity: "EPIC",      cat: "player",  flag: "🇧🇷", color: "#A855F7", bg1: "#009C3B", bg2: "#FFDF00", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Vinicius_Junior_vs._Borussia_Dortmund_2024_%28cropped%29.jpg/440px-Vinicius_Junior_vs._Borussia_Dortmund_2024_%28cropped%29.jpg" },
  { name: "Azteca Stadium",   team: "MEX", rarity: "RARE",      cat: "stadium", flag: "🏟️", color: "#00D97E", bg1: "#006847", bg2: "#CE1126", img: "/images/stickers/stadiums/azteca-stadium.svg" },
  { name: "Lamine Yamal",     team: "ESP", rarity: "RARE",      cat: "player",  flag: "🇪🇸", color: "#00D97E", bg1: "#AA151B", bg2: "#F1BF00", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/UEFA_Euro_2024_-_Spain_vs_Croatia_-_20240615_-_Lamine_Yamal.jpg/440px-UEFA_Euro_2024_-_Spain_vs_Croatia_-_20240615_-_Lamine_Yamal.jpg" },
  { name: "Erling Haaland",   team: "NOR", rarity: "EPIC",      cat: "player",  flag: "🇳🇴", color: "#A855F7", bg1: "#EF2B2D", bg2: "#FFFFFF", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Erling_Haaland_2022_%28cropped%29.jpg/440px-Erling_Haaland_2022_%28cropped%29.jpg" },
  { name: "New York City",    team: "USA", rarity: "RARE",      cat: "city",    flag: "🗽", color: "#00D97E", bg1: "#002868", bg2: "#3C3B6E", img: "/images/stickers/cities/new-york-city.jpg" },
  { name: "Harry Kane",       team: "ENG", rarity: "RARE",      cat: "player",  flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#00D97E", bg1: "#CF081F", bg2: "#FFFFFF", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Harry_Kane_2019-10-16.jpg/440px-Harry_Kane_2019-10-16.jpg" },
  { name: "Ciudad de México", team: "MEX", rarity: "UNCOMMON",  cat: "city",    flag: "🇲🇽", color: "#4A6FFF", bg1: "#006847", bg2: "#CE1126", img: "/images/stickers/cities/mexico-city.jpg" },
  { name: "Pedri",            team: "ESP", rarity: "RARE",      cat: "player",  flag: "🇪🇸", color: "#00D97E", bg1: "#AA151B", bg2: "#F1BF00", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/20220308_Pedri_vs._Osasuna_%28cropped%29.jpg/440px-20220308_Pedri_vs._Osasuna_%28cropped%29.jpg" },
];

const FEATURES = [
  {
    icon: "🃏", title: "Digital Sticker Album",
    desc: "800+ cards across players, coaches, stadiums, host cities and iconic moments. Collect, trade and complete your World Cup 2026 album.",
    color: "#FF5E00", glow: "#FF5E00"
  },
  {
    icon: "📦", title: "Pack Opening",
    desc: "Open free daily packs with a FIFA-style reveal animation. Feel the rush of discovering a Legendary sticker.",
    color: "#E8003D", glow: "#E8003D"
  },
  {
    icon: "🤖", title: "AI Fan Coach",
    desc: "Your personal football AI. Ask about tactics, players, match predictions — it knows everything about World Cup 2026.",
    color: "#4A6FFF", glow: "#4A6FFF"
  },
  {
    icon: "🏆", title: "Fan Ranking",
    desc: "Compete with fans worldwide. Earn XP, climb the global leaderboard and show off your collection progress.",
    color: "#FFB800", glow: "#FFB800"
  },
  {
    icon: "🛒", title: "Marketplace",
    desc: "Buy, sell and trade duplicate stickers with other fans. The more you play, the more valuable your collection becomes.",
    color: "#00D97E", glow: "#00D97E"
  },
  {
    icon: "🌍", title: "6 Languages",
    desc: "English, Español, Português, Français, Deutsch and العربية — STAMPEDE speaks your language.",
    color: "#A855F7", glow: "#A855F7"
  },
];

const STEPS = [
  { icon: "🆓", title: "Sign Up Free",   desc: "Create your account in seconds. No credit card needed.",   bg: "linear-gradient(135deg,#E8003D22,#E8003D11)", glow: "#E8003D" },
  { icon: "📦", title: "Open Your Pack", desc: "Get your first free pack instantly. Tap to reveal your cards.", bg: "linear-gradient(135deg,#FF5E0022,#FF5E0011)", glow: "#FF5E00" },
  { icon: "🃏", title: "Collect & Trade", desc: "Build your album. Trade duplicates in the marketplace.",     bg: "linear-gradient(135deg,#FFB80022,#FFB80011)", glow: "#FFB800" },
  { icon: "🏆", title: "Climb the Ranks", desc: "Earn XP, complete missions, and dominate the ranking.",     bg: "linear-gradient(135deg,#4A6FFF22,#4A6FFF11)", glow: "#4A6FFF" },
];

const RARITIES = [
  { name: "Common",    color: "#9090B8", icon: "⚪", desc: "Base squad" },
  { name: "Uncommon",  color: "#4A6FFF", icon: "🔵", desc: "Key players" },
  { name: "Rare",      color: "#00D97E", icon: "🟢", desc: "Star players" },
  { name: "Epic",      color: "#A855F7", icon: "🟣", desc: "World class" },
  { name: "Legendary", color: "#FFB800", icon: "🌟", desc: "GOAT tier" },
];

// ── Sub-components (Server components) ───────────────────────────────────────

function FeatureCard({ icon, title, desc, color, glow }: {
  icon: string; title: string; desc: string; color: string; glow: string;
}) {
  return (
    <div className="group p-6 rounded-2xl border border-white/6 hover:border-white/15 transition-all duration-300 hover:scale-[1.02]"
         style={{ background: "rgba(255,255,255,0.025)", boxShadow: `0 0 0 1px ${glow}00` }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-white/8"
           style={{ background: `${color}18` }}>
        {icon}
      </div>
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-[#666888] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
