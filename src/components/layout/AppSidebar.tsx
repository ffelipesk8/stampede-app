"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/lib/i18n/translations";
import {
  LayoutDashboard, BookOpen, Package, Trophy,
  CalendarDays, Bot, ShoppingCart, User, Zap
} from "lucide-react";

// Navigation uses translation keys
const NAV_ITEMS: {
  href: string;
  key: TranslationKey;
  icon: React.FC<{ className?: string }>;
  color: string;
  badge?: string;
}[] = [
  { href: "/dashboard",   key: "nav.dashboard",   icon: LayoutDashboard, color: "text-gold"       },
  { href: "/album",       key: "nav.album",        icon: BookOpen,        color: "text-red"        },
  { href: "/packs",       key: "nav.packs",        icon: Package,         color: "text-orange"     },
  { href: "/ranking",     key: "nav.ranking",      icon: Trophy,          color: "text-green"      },
  { href: "/events",      key: "nav.events",       icon: CalendarDays,    color: "text-purple-400" },
  { href: "/coach",       key: "nav.coach",        icon: Bot,             color: "text-blue",  badge: "AI" },
  { href: "/marketplace", key: "nav.marketplace",  icon: ShoppingCart,    color: "text-green"      },
  { href: "/profile",     key: "nav.profile",      icon: User,            color: "text-t2"         },
];

interface AppSidebarProps {
  user: {
    username: string;
    level: number;
    xp: number;
    coins?: number;
    isPro?: boolean;
    avatarUrl?: string | null;
    favoriteTeam?: string | null;
  };
  xpProgress: { current: number; needed: number; pct: number };
}

export function AppSidebar({ user, xpProgress }: AppSidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="w-60 min-h-screen bg-card1 border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-border">
        <Link href="/dashboard" className="font-condensed text-2xl font-black tracking-widest">
          <span className="text-red">S</span>
          <span className="text-orange">T</span>
          <span className="text-gold">A</span>
          <span className="text-t1">MPEDE</span>
        </Link>
      </div>

      {/* User card */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-card2 border border-border overflow-hidden shrink-0 relative">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-t2 font-bold text-sm">
                {user.username[0].toUpperCase()}
              </div>
            )}
            {user.isPro && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-[#FFB800] to-[#FF5E00] rounded-full flex items-center justify-center">
                <span className="text-[7px] font-black text-black">P</span>
              </div>
            )}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-t1 font-display font-semibold text-sm truncate">@{user.username}</p>
            <p className="text-t3 text-xs">Lv.{user.level} · 🪙 {(user.coins ?? 0).toLocaleString()}</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="h-1.5 bg-card2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800]"
            style={{ width: `${xpProgress.pct}%` }}
          />
        </div>
        <p className="text-t3 text-xs mt-1">
          {xpProgress.current.toLocaleString()} / {xpProgress.needed.toLocaleString()} {t("common.xp")}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, key, icon: Icon, color, badge }) => {
          const isActive = href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href as never}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-card2 text-t1" : "text-t2 hover:bg-card2 hover:text-t1"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", color)} />
              <span className="flex-1">{t(key)}</span>
              {badge && (
                <span className="text-[9px] font-bold bg-blue/20 text-blue border border-blue/30 px-1.5 py-0.5 rounded">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* PRO upsell footer */}
      {!user.isPro && (
        <div className="p-3 border-t border-border">
          <Link
            href={"/upgrade" as never}
            className="flex items-center gap-2 bg-gradient-to-r from-[#E8003D]/10 to-[#FF5E00]/10 border border-[#FF5E00]/20 rounded-xl px-3 py-2.5 hover:from-[#E8003D]/20 hover:to-[#FF5E00]/20 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-orange shrink-0" />
            <div>
              <p className="text-orange text-xs font-bold">{t("nav.upgrade")}</p>
              <p className="text-t3 text-[10px]">{t("nav.upgradeDesc")}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
