"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Link2, Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ShareData {
  title: string;       // e.g. "Lionel Messi — LEGENDARY"
  text: string;        // e.g. "I just pulled a LEGENDARY Messi sticker on STAMPEDE! 🔥"
  url?: string;        // defaults to current page
  imageUrl?: string;   // optional card image for platforms that support og
  hashtags?: string[]; // e.g. ["WorldCup2026", "STAMPEDE"]
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
}

// ── Social network definitions ────────────────────────────────────────────────
interface SocialNetwork {
  id: string;
  name: string;
  color: string;
  bgClass: string;
  borderClass: string;
  icon: string; // SVG path or emoji fallback
  buildUrl: (data: ShareData, pageUrl: string, text: string) => string | null;
}

const NETWORKS: SocialNetwork[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    bgClass: "bg-[#25D366]/10 hover:bg-[#25D366]/20",
    borderClass: "border-[#25D366]/30 hover:border-[#25D366]",
    icon: "whatsapp",
    buildUrl: (_, url, text) =>
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    bgClass: "bg-[#1877F2]/10 hover:bg-[#1877F2]/20",
    borderClass: "border-[#1877F2]/30 hover:border-[#1877F2]",
    icon: "facebook",
    buildUrl: (_, url, text) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
  {
    id: "twitter",
    name: "X / Twitter",
    color: "#000000",
    bgClass: "bg-white/5 hover:bg-white/10",
    borderClass: "border-white/20 hover:border-white/50",
    icon: "twitter",
    buildUrl: (data, url, text) => {
      const tags = (data.hashtags ?? []).join(",");
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}${tags ? `&hashtags=${tags}` : ""}`;
    },
  },
  {
    id: "telegram",
    name: "Telegram",
    color: "#26A5E4",
    bgClass: "bg-[#26A5E4]/10 hover:bg-[#26A5E4]/20",
    borderClass: "border-[#26A5E4]/30 hover:border-[#26A5E4]",
    icon: "telegram",
    buildUrl: (_, url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    bgClass: "bg-[#E1306C]/10 hover:bg-[#E1306C]/20",
    borderClass: "border-[#E1306C]/30 hover:border-[#E1306C]",
    icon: "instagram",
    // Instagram doesn't support direct share URLs — open app + copy link
    buildUrl: () => null,
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#FE2C55",
    bgClass: "bg-[#FE2C55]/10 hover:bg-[#FE2C55]/20",
    borderClass: "border-[#FE2C55]/30 hover:border-[#FE2C55]",
    icon: "tiktok",
    // TikTok doesn't support external share URLs
    buildUrl: () => null,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    color: "#FFFC00",
    bgClass: "bg-[#FFFC00]/10 hover:bg-[#FFFC00]/20",
    borderClass: "border-[#FFFC00]/30 hover:border-[#FFFC00]/70",
    icon: "snapchat",
    buildUrl: (_, url) =>
      `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    color: "#E60023",
    bgClass: "bg-[#E60023]/10 hover:bg-[#E60023]/20",
    borderClass: "border-[#E60023]/30 hover:border-[#E60023]",
    icon: "pinterest",
    buildUrl: (data, url, text) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}${data.imageUrl ? `&media=${encodeURIComponent(data.imageUrl)}` : ""}`,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    bgClass: "bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20",
    borderClass: "border-[#0A66C2]/30 hover:border-[#0A66C2]",
    icon: "linkedin",
    buildUrl: (_, url, text) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
  },
  {
    id: "reddit",
    name: "Reddit",
    color: "#FF4500",
    bgClass: "bg-[#FF4500]/10 hover:bg-[#FF4500]/20",
    borderClass: "border-[#FF4500]/30 hover:border-[#FF4500]",
    icon: "reddit",
    buildUrl: (_, url, text) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
];

// ── SVG icons as inline components ───────────────────────────────────────────
function NetworkIcon({ id, color }: { id: string; color: string }) {
  const s = { width: 20, height: 20 };
  switch (id) {
    case "whatsapp":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      );
    case "facebook":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case "twitter":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case "telegram":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color}>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="url(#ig-gradient)">
          <defs>
            <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFDC80"/>
              <stop offset="25%" stopColor="#FCAF45"/>
              <stop offset="50%" stopColor="#F77737"/>
              <stop offset="75%" stopColor="#E1306C"/>
              <stop offset="100%" stopColor="#C13584"/>
            </linearGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      );
    case "tiktok":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="white">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      );
    case "snapchat":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color}>
          <path d="M12.166.011C12.111.01 12.057.01 12 .01c-.057 0-.11 0-.166.001C8.222.063 5.135 2.01 3.83 4.99 3.154 6.535 3.004 8.194 3.004 9.803c0 .453.022.901.062 1.345-.253.127-.543.2-.851.2-.368 0-.713-.108-.988-.289-.111-.073-.232-.103-.352-.103-.38 0-.715.295-.715.726 0 .577.491.893 1.004 1.019.293.071.573.16.83.292.048.024.099.049.148.072-.127.369-.326.695-.604.948a3.394 3.394 0 01-.483.357c-.412.245-.97.503-.97 1.057 0 .497.405.89.902.89.145 0 .287-.033.418-.099.407-.2.838-.305 1.281-.305.269 0 .533.039.787.114-.028.197-.046.397-.046.602 0 1.849 1.495 3.352 3.343 3.352.163 0 .325-.013.484-.037.487-.073.936-.272 1.31-.567.305-.238.683-.38 1.089-.38.395 0 .763.135 1.063.363.38.293.841.494 1.34.566.157.023.316.036.478.036 1.849 0 3.343-1.503 3.343-3.352 0-.205-.018-.406-.047-.603.255-.075.518-.114.787-.114.443 0 .874.106 1.281.305.131.066.273.099.418.099.497 0 .902-.393.902-.89 0-.554-.558-.812-.97-1.057a3.434 3.434 0 01-.483-.357c-.278-.253-.477-.58-.604-.948.05-.023.1-.048.148-.072.257-.132.537-.221.83-.292.513-.126 1.004-.442 1.004-1.019 0-.431-.335-.726-.715-.726-.12 0-.241.03-.352.103-.275.181-.62.289-.988.289-.308 0-.598-.073-.851-.2.04-.444.062-.892.062-1.345 0-1.609-.15-3.268-.826-4.813C18.865 2.01 15.778.063 12.166.011z"/>
        </svg>
      );
    case "pinterest":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color}>
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      );
    case "linkedin":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case "reddit":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color}>
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      );
    default:
      return <Share2 size={20} color={color} />;
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ShareModal({ isOpen, onClose, data }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);
  const [tiktokCopied, setTiktokCopied] = useState(false);

  const pageUrl = (data.url ?? (typeof window !== "undefined" ? window.location.href : "https://stampede.app"));
  const shareText = data.text;

  // Web Share API (mobile native share sheet)
  const [canNativeShare] = useState(
    () => typeof navigator !== "undefined" && !!navigator.share
  );

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: pageUrl,
      });
    } catch { /* user cancelled */ }
  }, [data, pageUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard unavailable */ }
  }, [pageUrl]);

  const handleNetwork = useCallback(
    (network: SocialNetwork) => {
      if (network.id === "instagram") {
        navigator.clipboard.writeText(`${shareText}\n${pageUrl}`).then(() => {
          setInstaCopied(true);
          setTimeout(() => setInstaCopied(false), 2500);
        });
        return;
      }
      if (network.id === "tiktok") {
        navigator.clipboard.writeText(`${shareText}\n${pageUrl}`).then(() => {
          setTiktokCopied(true);
          setTimeout(() => setTiktokCopied(false), 2500);
        });
        return;
      }
      const url = network.buildUrl(data, pageUrl, shareText);
      if (url) window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    },
    [data, pageUrl, shareText]
  );

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md bg-card1 border border-border rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,94,0,0.1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-orange" />
            <p className="text-t1 font-display font-bold text-sm">Share</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-card2 transition-colors"
          >
            <X className="w-4 h-4 text-t3" />
          </button>
        </div>

        {/* Preview card */}
        <div className="px-5 py-4 border-b border-border bg-card2/40">
          <p className="text-t1 font-display font-semibold text-sm truncate">{data.title}</p>
          <p className="text-t3 text-xs mt-0.5 line-clamp-2">{data.text}</p>
        </div>

        {/* Social grid */}
        <div className="p-5 grid grid-cols-5 gap-3">
          {NETWORKS.map((network) => {
            const isCopied =
              (network.id === "instagram" && instaCopied) ||
              (network.id === "tiktok" && tiktokCopied);
            const requiresCopy = network.id === "instagram" || network.id === "tiktok";

            return (
              <button
                key={network.id}
                onClick={() => handleNetwork(network)}
                title={requiresCopy ? `Copy link for ${network.name}` : network.name}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200",
                  network.bgClass,
                  network.borderClass
                )}
              >
                {isCopied ? (
                  <Check size={20} color={network.color} />
                ) : (
                  <NetworkIcon id={network.id} color={network.color} />
                )}
                <span
                  className="text-[9px] font-bold text-center leading-tight truncate w-full"
                  style={{ color: network.color }}
                >
                  {requiresCopy ? (isCopied ? "Copied!" : network.name) : network.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Copy link row */}
        <div className="px-5 pb-4 flex gap-2">
          <div className="flex-1 bg-card2 border border-border rounded-xl px-3 py-2 flex items-center gap-2 min-w-0">
            <Link2 className="w-3.5 h-3.5 text-t3 shrink-0" />
            <span className="text-t3 text-xs truncate">{pageUrl}</span>
          </div>
          <button
            onClick={handleCopyLink}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl border font-bold text-xs transition-all duration-200 shrink-0",
              copied
                ? "bg-green/20 border-green text-green"
                : "bg-card2 border-border text-t2 hover:border-orange hover:text-orange"
            )}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Native share (mobile) */}
        {canNativeShare && (
          <div className="px-5 pb-5">
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 bg-gradient-to-r from-[#E8003D]/20 to-[#FF5E00]/20 border border-[#FF5E00]/30 rounded-xl text-orange font-bold text-sm hover:from-[#E8003D]/30 hover:to-[#FF5E00]/30 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share via device
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Trigger button helper ─────────────────────────────────────────────────────
interface ShareButtonProps {
  data: ShareData;
  className?: string;
  children?: React.ReactNode;
}

export function ShareButton({ data, className, children }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-t2 hover:border-orange hover:text-orange transition-colors text-xs font-medium",
          className
        )}
      >
        <Share2 className="w-3.5 h-3.5" />
        {children ?? "Share"}
      </button>
      <ShareModal isOpen={open} onClose={() => setOpen(false)} data={data} />
    </>
  );
}
