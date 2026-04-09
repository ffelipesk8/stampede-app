"use client";

/**
 * PremiumCardShell
 * ────────────────────────────────────────────────────
 * Wrapper that adds PS5-quality visual effects to any sticker card:
 *  • 3-D tilt (perspective + rotateX/Y via mouse tracking)
 *  • Moving shine highlight
 *  • Per-rarity holographic / foil overlay
 *  • Legendary sparkle particles
 *  • Ambient glow pulse
 */

import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";

export type CardRarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";

const MAX_TILT = 18;

interface PremiumCardShellProps {
  rarity: CardRarity;
  glowColor: string;     // rarity colour, e.g. "#FFB800"
  children: ReactNode;
  className?: string;
  disabled?: boolean;   // for unowned / greyed-out cards
  onClick?: () => void;
  style?: React.CSSProperties;
}

interface Transform {
  rotateX: number;
  rotateY: number;
  shineX: number;
  shineY: number;
}

const RESET: Transform = { rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 };

// How intense the foil is per rarity
const FOIL_OPACITY: Record<CardRarity, number> = {
  COMMON:    0,
  UNCOMMON:  0,
  RARE:      0.12,
  EPIC:      0.28,
  LEGENDARY: 0.55,
};

const GLOW_INTENSITY: Record<CardRarity, number> = {
  COMMON:    0,
  UNCOMMON:  0.06,
  RARE:      0.18,
  EPIC:      0.40,
  LEGENDARY: 0.75,
};

// Rainbow holo palette
const HOLO_STOPS = [
  "rgba(255,0,120,VAL)",
  "rgba(255,120,0,VAL)",
  "rgba(255,220,0,VAL)",
  "rgba(0,220,60,VAL)",
  "rgba(0,130,255,VAL)",
  "rgba(160,0,255,VAL)",
  "rgba(255,0,120,VAL)",
].map(s => s.replace("VAL", "0.85"));

function holoGradient(x: number, y: number, angle: number) {
  return `conic-gradient(from ${angle}deg at ${x}% ${y}%, ${HOLO_STOPS.join(", ")})`;
}

// Sparkle particle positions (seeded, so they're stable)
const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  x: ((i * 37 + 11) % 80) + 10,
  y: ((i * 53 + 17) % 75) + 10,
  delay: (i * 0.3) % 1.8,
  size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
}));

export function PremiumCardShell({
  rarity,
  glowColor,
  children,
  className = "",
  disabled = false,
  onClick,
  style,
}: PremiumCardShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState<Transform>(RESET);
  const [hovered, setHovered] = useState(false);
  const [foilAngle, setFoilAngle] = useState(0);
  const rafRef = useRef<number>(0);

  const foilOpacity = disabled ? 0 : FOIL_OPACITY[rarity];
  const glowIntensity = disabled ? 0 : GLOW_INTENSITY[rarity];
  const isLegendary = rarity === "LEGENDARY" && !disabled;
  const isEpicPlus  = (rarity === "EPIC" || isLegendary) && !disabled;

  // Animate foil angle on hover
  useEffect(() => {
    if (!hovered || foilOpacity === 0) return;
    let angle = foilAngle;
    const tick = () => {
      angle = (angle + 0.8) % 360;
      setFoilAngle(angle);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered, foilOpacity]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    setT({
      rotateX: -(y - 0.5) * MAX_TILT,
      rotateY:  (x - 0.5) * MAX_TILT,
      shineX:   x * 100,
      shineY:   y * 100,
    });
  }, []);

  const onEnter = useCallback(() => setHovered(true),  []);
  const onLeave = useCallback(() => { setT(RESET); setHovered(false); }, []);

  // Box shadow: ambient glow + hover lift
  const shadow = disabled ? "none" : [
    hovered
      ? `0 24px 48px rgba(0,0,0,0.55), 0 8px 16px rgba(0,0,0,0.4)`
      : `0 6px 16px rgba(0,0,0,0.35)`,
    glowIntensity > 0
      ? `0 0 ${hovered ? 32 : 16}px ${glowColor}${Math.round(glowIntensity * (hovered ? 1 : 0.5) * 255).toString(16).padStart(2,"0")}`
      : "",
  ].filter(Boolean).join(", ");

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: "600px", perspectiveOrigin: "center", ...style }}
      onClick={onClick}
    >
      {/* Legendary ambient pulse ring */}
      {isLegendary && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 0 2px ${glowColor}88, 0 0 40px ${glowColor}55`,
            animation: "legendaryPulse 2.4s ease-in-out infinite",
          }}
        />
      )}

      {/* Main card body — 3-D tilt */}
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative overflow-hidden"
        style={{
          borderRadius: "inherit",
          transform: `rotateX(${t.rotateX}deg) rotateY(${t.rotateY}deg) ${hovered && !disabled ? "scale(1.06)" : "scale(1)"}`,
          transition: hovered ? "transform 0.08s linear, box-shadow 0.25s ease" : "transform 0.4s ease, box-shadow 0.4s ease",
          transformStyle: "preserve-3d",
          boxShadow: shadow,
          willChange: "transform",
        }}
      >
        {children}

        {/* ── Shine highlight ── */}
        {!disabled && hovered && (
          <div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              background: `radial-gradient(ellipse 60% 50% at ${t.shineX}% ${t.shineY}%, rgba(255,255,255,0.28) 0%, transparent 65%)`,
              mixBlendMode: "overlay",
              borderRadius: "inherit",
            }}
          />
        )}

        {/* ── Foil / holographic overlay ── */}
        {foilOpacity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: isEpicPlus
                ? holoGradient(t.shineX, t.shineY, foilAngle)
                : `linear-gradient(${foilAngle}deg, rgba(255,220,100,0.2), rgba(255,255,255,0.18), rgba(180,100,255,0.2))`,
              opacity: hovered ? foilOpacity : foilOpacity * 0.4,
              mixBlendMode: isLegendary ? "color-dodge" : "overlay",
              borderRadius: "inherit",
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        {/* ── Edge rainbow refraction (EPIC+) ── */}
        {isEpicPlus && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `linear-gradient(135deg, transparent 30%, rgba(255,200,0,0.08) 45%, rgba(100,180,255,0.08) 55%, transparent 70%)`,
              mixBlendMode: "screen",
              borderRadius: "inherit",
            }}
          />
        )}

        {/* ── Legendary sparkle particles ── */}
        {isLegendary && hovered && (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden" style={{ borderRadius: "inherit" }}>
            {SPARKLES.map((s, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left:  `${s.x}%`,
                  top:   `${s.y}%`,
                  width:  s.size,
                  height: s.size,
                  background: "#FFB800",
                  boxShadow: `0 0 ${s.size * 2}px 1px #FFB800`,
                  animation: `sparkle 1.2s ${s.delay}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* CSS keyframes injected once */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes legendaryPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.01); }
        }
        @keyframes sparkle {
          0%   { opacity: 0;    transform: scale(0) rotate(0deg); }
          40%  { opacity: 1;    transform: scale(1) rotate(180deg); }
          100% { opacity: 0;    transform: scale(0) rotate(360deg); }
        }
      `}} />
    </div>
  );
}
