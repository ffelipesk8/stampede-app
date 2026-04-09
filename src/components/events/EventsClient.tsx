"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, Users, Plus, Search, X, Clock,
  ChevronRight, ChevronLeft, Check, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EventType = "MATCH_DAY" | "WATCH_PARTY" | "FAN_MEETUP" | "TRAVEL_GROUP" | "AFTER_PARTY";

interface FanEvent {
  id: string;
  title: string;
  description: string | null;
  type: EventType;
  matchCode: string | null;
  city: string;
  country: string;
  venueName: string | null;
  venueAddress: string | null;
  startsAt: string;
  endsAt: string | null;
  maxAttendees: number | null;
  isPublic: boolean;
  isVerified: boolean;
  imageUrl: string | null;
  isAttending: boolean;
  attendeeCount: number;
  isCreator?: boolean;
  creator?: { id: string; username: string; avatarUrl: string | null; favoriteTeam: string | null };
}

interface EventsClientProps {
  events: FanEvent[];
  myEvents: FanEvent[];
  userId: string;
  favoriteTeam: string | null;
  countryCode: string | null;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const EVENT_TYPE_CONFIG: Record<EventType, { label: string; sublabel: string; emoji: string; color: string; bg: string }> = {
  MATCH_DAY:    { label: "Match Day",    sublabel: "At the stadium",    emoji: "⚽", color: "#E8003D", bg: "#E8003D15" },
  WATCH_PARTY:  { label: "Watch Party",  sublabel: "Bar or home screen",emoji: "📺", color: "#4A6FFF", bg: "#4A6FFF15" },
  FAN_MEETUP:   { label: "Fan Meetup",   sublabel: "Meet local fans",   emoji: "👥", color: "#00D97E", bg: "#00D97E15" },
  TRAVEL_GROUP: { label: "Travel Group", sublabel: "Road trip together",emoji: "✈️", color: "#FFB800", bg: "#FFB80015" },
  AFTER_PARTY:  { label: "After Party",  sublabel: "Celebrate the win", emoji: "🎉", color: "#9B59B6", bg: "#9B59B615" },
};

const TEAM_FLAGS: Record<string, string> = {
  ARG: "🇦🇷", BRA: "🇧🇷", FRA: "🇫🇷", ESP: "🇪🇸", DEU: "🇩🇪", ENG: "🏴",
  MEX: "🇲🇽", USA: "🇺🇸", POR: "🇵🇹", NLD: "🇳🇱", COL: "🇨🇴", ARG2: "🇦🇷",
};

const COUNTRY_OPTIONS = [
  { code: "ARG", label: "Argentina" },
  { code: "AUS", label: "Australia" },
  { code: "BEL", label: "Belgium" },
  { code: "BRA", label: "Brazil" },
  { code: "CAN", label: "Canada" },
  { code: "CHL", label: "Chile" },
  { code: "COL", label: "Colombia" },
  { code: "CRI", label: "Costa Rica" },
  { code: "HRV", label: "Croatia" },
  { code: "ECU", label: "Ecuador" },
  { code: "EGY", label: "Egypt" },
  { code: "ENG", label: "England" },
  { code: "FRA", label: "France" },
  { code: "DEU", label: "Germany" },
  { code: "GHA", label: "Ghana" },
  { code: "IRN", label: "Iran" },
  { code: "ITA", label: "Italy" },
  { code: "JPN", label: "Japan" },
  { code: "KOR", label: "Korea" },
  { code: "MAR", label: "Morocco" },
  { code: "MEX", label: "Mexico" },
  { code: "NGA", label: "Nigeria" },
  { code: "NLD", label: "Netherlands" },
  { code: "PAN", label: "Panama" },
  { code: "PRY", label: "Paraguay" },
  { code: "PER", label: "Peru" },
  { code: "POL", label: "Poland" },
  { code: "POR", label: "Portugal" },
  { code: "SAU", label: "Saudi Arabia" },
  { code: "SEN", label: "Senegal" },
  { code: "ESP", label: "Spain" },
  { code: "CHE", label: "Switzerland" },
  { code: "TUN", label: "Tunisia" },
  { code: "URY", label: "Uruguay" },
  { code: "USA", label: "United States" },
  { code: "VEN", label: "Venezuela" },
];

// Quick date shortcuts
function getQuickDates() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) => {
    d.setSeconds(0, 0);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
  };

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);

  // Next Saturday
  const saturday = new Date(now);
  const daysUntilSat = (6 - saturday.getDay() + 7) % 7 || 7;
  saturday.setDate(saturday.getDate() + daysUntilSat);
  saturday.setHours(16, 0, 0, 0);

  // Next Sunday
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(15, 0, 0, 0);

  return [
    { label: "Tomorrow", value: fmt(tomorrow) },
    { label: "Saturday", value: fmt(saturday) },
    { label: "Sunday",   value: fmt(sunday) },
  ];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function EventsClient({ events, myEvents, userId, favoriteTeam, countryCode }: EventsClientProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab]     = useState<"discover" | "my">("discover");
  const [search, setSearch]           = useState("");
  const [filterType, setFilterType]   = useState<EventType | "ALL">("ALL");
  const [showCreate, setShowCreate]   = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<FanEvent | null>(null);
  const [attendingIds, setAttendingIds] = useState(
    new Set([...events, ...myEvents].filter((e) => e.isAttending).map((e) => e.id))
  );

  const filtered = useMemo(() => {
    const source = activeTab === "my" ? myEvents : events;
    return source.filter((e) => {
      if (filterType !== "ALL" && e.type !== filterType) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) &&
          !e.city.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [events, myEvents, activeTab, filterType, search]);

  const handleAttend = async (eventId: string) => {
    const res  = await fetch(`/api/events/${eventId}/attend`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setAttendingIds((prev) => {
        const next = new Set(prev);
        data.attending ? next.add(eventId) : next.delete(eventId);
        return next;
      });
    }
  };

  const totalFans   = events.reduce((a, e) => a + e.attendeeCount, 0);
  const totalCities = new Set(events.map((e) => e.city)).size;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">

      {/* -------- Hero header -------- */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d0d22 0%, #1a0a2e 50%, #0a1a0d 100%)",
          border: "1px solid rgba(232,101,10,0.25)",
        }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none"
             style={{ background: "radial-gradient(circle, #E8650A 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10 pointer-events-none"
             style={{ background: "radial-gradient(circle, #4A6FFF 0%, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌍</span>
                <span className="text-xs font-black text-[#E8650A] uppercase tracking-[0.2em]">{t("events.title")}</span>
              </div>
              <h1 className="font-condensed text-4xl font-black text-white tracking-tight mb-1">
                Find your tribe.<br />
                <span style={{ color: "#E8650A" }}>Never watch alone.</span>
              </h1>
              <p className="text-[#8888AA] text-sm">
                {events.length > 0
                  ? `${events.length} events · ${totalFans} ${t("events.totalFans")} · ${totalCities} ${t("events.totalCities")}`
                  : t("events.noEventsHint")}
              </p>
            </div>

            {/* Create CTA */}
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 font-display font-bold px-5 py-3 rounded-xl text-white text-sm transition-all shrink-0 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #E8650A, #FF5E00)",
                boxShadow: "0 0 20px rgba(232,101,10,0.35)",
              }}
            >
              <Plus className="w-4 h-4" />
              {t("events.createEvent")}
            </button>
          </div>

          {/* Stats row */}
          {events.length > 0 && (
            <div className="flex gap-6 mt-5 pt-5 border-t border-white/10">
              {[
                { icon: "⚽", label: t("events.title"),     value: events.length },
                { icon: "👥", label: t("events.totalFans"), value: totalFans },
                { icon: "📍", label: t("events.totalCities"), value: totalCities },
                { icon: "🌎", label: t("events.myEvents"),  value: myEvents.length },
              ].map(({ icon, label, value }) => (
                <div key={label}>
                  <p className="text-white font-condensed text-2xl font-black">{value}</p>
                  <p className="text-[#8888AA] text-xs">{icon} {label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* -------- Tabs + Search -------- */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-card1 border border-border rounded-xl p-1 gap-1">
          {(["discover", "my"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-lg font-display font-semibold text-sm transition-colors",
                activeTab === tab ? "bg-card2 text-t1" : "text-t3 hover:text-t1"
              )}
            >
              {tab === "discover" ? t("events.upcoming") : t("events.myEvents")}
              {tab === "my" && myEvents.length > 0 && (
                <span className="ml-1.5 bg-[#E8650A] text-white text-[10px] font-black w-4 h-4 rounded-full inline-flex items-center justify-center">
                  {myEvents.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
          <input
            type="text"
            placeholder={`${t("common.search")} event or city...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card1 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-orange"
          />
        </div>
      </div>

      {/* -------- Type filter chips -------- */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterType("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
            filterType === "ALL"
              ? "text-white border-[#E8650A]"
              : "bg-card1 border-border text-t2 hover:text-t1"
          )}
          style={filterType === "ALL" ? { background: "#E8650A" } : {}}
        >
          🌍 {t("common.all")}
        </button>
        {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, (typeof EVENT_TYPE_CONFIG)[EventType]][]).map(
          ([type, conf]) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                filterType === type ? "text-white border-transparent" : "bg-card1 border-border text-t2 hover:text-t1"
              )}
              style={filterType === type ? { background: conf.color } : {}}
            >
              {conf.emoji} {conf.label}
            </button>
          )
        )}
      </div>

      {/* -------- Events list -------- */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            isMyTab={activeTab === "my"}
            onCreate={() => setShowCreate(true)}
          />
        ) : (
          filtered.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <EventCard
                event={event}
                isAttending={attendingIds.has(event.id)}
                onAttend={() => handleAttend(event.id)}
                onClick={() => setSelectedEvent(event)}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* -------- FAB (always visible on mobile) -------- */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl text-white transition-all hover:scale-110 active:scale-95 md:hidden"
        style={{
          background: "linear-gradient(135deg, #E8650A, #FF5E00)",
          boxShadow: "0 0 24px rgba(232,101,10,0.5)",
        }}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* -------- Modals -------- */}
      <AnimatePresence>
        {showCreate && (
          <CreateEventWizard
            onClose={() => setShowCreate(false)}
            favoriteTeam={favoriteTeam}
            countryCode={countryCode}
          />
        )}
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            isAttending={attendingIds.has(selectedEvent.id)}
            onAttend={() => handleAttend(selectedEvent.id)}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ isMyTab, onCreate }: { isMyTab: boolean; onCreate: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="text-center py-16 bg-card1 border border-dashed border-border rounded-2xl">
      <p className="text-5xl mb-4">{isMyTab ? "📅" : "📍"}</p>
      <p className="font-display font-bold text-t1 text-lg mb-1">
        {isMyTab ? t("events.myEvents") : t("events.noEvents")}
      </p>
      <p className="text-t3 text-sm mb-6">
        {isMyTab ? t("events.createFirst") : t("events.noEventsHint")}
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 font-display font-bold px-5 py-2.5 rounded-xl text-white text-sm"
        style={{ background: "linear-gradient(135deg, #E8650A, #FF5E00)" }}
      >
        <Plus className="w-4 h-4" />
        {t("events.createEvent")}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event Card
// ---------------------------------------------------------------------------

function EventCard({
  event, isAttending, onAttend, onClick,
}: { event: FanEvent; isAttending: boolean; onAttend: () => void; onClick: () => void }) {
  const { t } = useLanguage();
  const conf      = EVENT_TYPE_CONFIG[event.type];
  const startDate = new Date(event.startsAt);
  const isSoon    = startDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
  const isFull    = event.maxAttendees ? event.attendeeCount >= event.maxAttendees : false;
  const fillPct   = event.maxAttendees
    ? Math.min(100, (event.attendeeCount / event.maxAttendees) * 100)
    : null;

  const dayStr  = startDate.toLocaleDateString("en-US", { day: "2-digit" });
  const monStr  = startDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const timeStr = startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="bg-card1 border border-border rounded-2xl p-4 hover:border-t3 transition-all cursor-pointer flex gap-4 group"
      onClick={onClick}
    >
      {/* Date badge */}
      <div
        className="w-14 shrink-0 rounded-xl flex flex-col items-center justify-center text-center py-2.5"
        style={{ background: conf.bg, border: `1px solid ${conf.color}30` }}
      >
        <p className="font-condensed text-2xl font-black leading-none" style={{ color: conf.color }}>
          {dayStr}
        </p>
        <p className="text-[10px] font-black text-t3 tracking-wide">{monStr}</p>
        <p className="text-[9px] text-t3 mt-0.5">{timeStr}</p>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="text-base">{conf.emoji}</span>
          <h3 className="font-display font-bold text-t1 text-sm group-hover:text-[#E8650A] transition-colors">
            {event.title}
          </h3>
          {event.isVerified && (
            <span className="text-[9px] font-black text-blue bg-blue/10 border border-blue/20 px-1.5 py-0.5 rounded">
              OFFICIAL
            </span>
          )}
          {isSoon && (
            <span className="text-[9px] font-black text-[#E8003D] bg-[#E8003D]/10 border border-[#E8003D]/20 px-1.5 py-0.5 rounded">
              SOON
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-2">
          <div className="flex items-center gap-1 text-t3 text-xs">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{event.city}{event.venueName ? ` · ${event.venueName}` : ""}</span>
          </div>
          <div className="flex items-center gap-1 text-t3 text-xs">
            <Users className="w-3 h-3 shrink-0" />
            <span className="font-semibold text-t2">{event.attendeeCount}</span>
            {event.maxAttendees && <span className="text-t3">/{event.maxAttendees}</span>}
            <span className="text-t3">{t("events.totalFans")}</span>
          </div>
        </div>

        {/* Capacity bar */}
        {fillPct !== null && (
          <div className="h-1 bg-card2 rounded-full overflow-hidden w-full max-w-[160px]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${fillPct}%`,
                background: fillPct > 85 ? "#E8003D" : conf.color,
              }}
            />
          </div>
        )}
      </div>

      {/* Attend button */}
      <button
        onClick={(e) => { e.stopPropagation(); onAttend(); }}
        disabled={isFull && !isAttending}
        className={cn(
          "shrink-0 self-center px-4 py-2 rounded-xl text-xs font-display font-bold transition-all border",
          isAttending
            ? "bg-green/10 border-green/40 text-green hover:bg-red/10 hover:border-red/40 hover:text-red"
            : isFull
              ? "bg-card2 border-border text-t3 cursor-not-allowed"
              : "bg-card2 border-border text-t2 hover:border-[#E8650A] hover:text-[#E8650A]"
        )}
      >
        {isAttending ? "✓ Going" : isFull ? t("events.full") : t("events.joinEvent")}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event Detail Modal
// ---------------------------------------------------------------------------

function EventDetailModal({
  event, isAttending, onAttend, onClose,
}: { event: FanEvent; isAttending: boolean; onAttend: () => void; onClose: () => void }) {
  const { t } = useLanguage();
  const conf      = EVENT_TYPE_CONFIG[event.type];
  const startDate = new Date(event.startsAt);
  const isFull    = event.maxAttendees ? event.attendeeCount >= event.maxAttendees : false;
  const fillPct   = event.maxAttendees
    ? Math.min(100, (event.attendeeCount / event.maxAttendees) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card1 border border-border rounded-t-3xl sm:rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull handle on mobile */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5 sm:hidden" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: conf.bg }}
            >
              {conf.emoji}
            </div>
            <div>
              <h2 className="font-display font-bold text-t1 text-lg leading-tight">{event.title}</h2>
              <p className="text-xs font-bold mt-0.5" style={{ color: conf.color }}>{conf.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-t3 hover:text-t1 ml-2 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {event.description && (
          <p className="text-t2 text-sm mb-4 leading-relaxed">{event.description}</p>
        )}

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-card2 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-t3" />
            </div>
            <div>
              <p className="text-t1 font-semibold">{event.city}, {event.country}</p>
              {event.venueName && <p className="text-t3 text-xs">{event.venueName}</p>}
              {event.venueAddress && <p className="text-t3 text-xs">{event.venueAddress}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-card2 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-t3" />
            </div>
            <div>
              <p className="text-t1 font-semibold">
                {startDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <p className="text-t3 text-xs">
                {startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-card2 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-t3" />
            </div>
            <div className="flex-1">
              <p className="text-t1 font-semibold">
                <span style={{ color: "#E8650A" }}>{event.attendeeCount}</span> {t("events.attendees")}
                {event.maxAttendees && ` · ${event.maxAttendees - event.attendeeCount} spots left`}
              </p>
              {fillPct !== null && (
                <div className="h-1.5 bg-card2 rounded-full overflow-hidden mt-1.5 w-full max-w-[160px]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${fillPct}%`,
                      background: fillPct > 85 ? "#E8003D" : conf.color,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {event.creator && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-card2 shrink-0 overflow-hidden border border-border">
                {event.creator.avatarUrl
                  ? <img src={event.creator.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xs text-t3">?</div>
                }
              </div>
              <p className="text-t3 text-xs">
                Organized by{" "}
                <span className="text-t2 font-semibold">@{event.creator.username}</span>
                {event.creator.favoriteTeam && ` ${TEAM_FLAGS[event.creator.favoriteTeam] ?? ""}`}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onAttend}
          disabled={isFull && !isAttending}
          className={cn(
            "w-full py-3.5 rounded-xl font-display font-bold text-base transition-all",
            isAttending
              ? "bg-green/10 border border-green/40 text-green hover:bg-red/10 hover:border-red/40 hover:text-red"
              : isFull
                ? "bg-card2 border border-border text-t3 cursor-not-allowed"
                : "text-white"
          )}
          style={!isAttending && !isFull
            ? { background: "linear-gradient(135deg, #E8650A, #FF5E00)", boxShadow: "0 0 20px rgba(232,101,10,0.3)" }
            : {}
          }
        >
          {isAttending ? "✓ You're going · Tap to leave" : isFull ? t("events.full") : `${t("events.joinEvent")} →`}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Create Event Wizard -- 3 steps
// ---------------------------------------------------------------------------

type WizardStep = 1 | 2 | 3;

interface WizardForm {
  type: EventType;
  title: string;
  city: string;
  country: string;
  venueName: string;
  startsAt: string;
  description: string;
  maxAttendees: string;
  venueAddress: string;
  matchCode: string;
}

function getDefaultDate() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  d.setHours(19, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T19:00`;
}

function CreateEventWizard({
  onClose, favoriteTeam, countryCode,
}: { onClose: () => void; favoriteTeam: string | null; countryCode: string | null }) {
  const { t } = useLanguage();
  const defaultCountry = countryCode ?? favoriteTeam ?? "COL";
  const [step, setStep]     = useState<WizardStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);

  const [form, setForm] = useState<WizardForm>({
    type: "FAN_MEETUP",
    title: "",
    city: "",
    country: defaultCountry,
    venueName: "",
    startsAt: getDefaultDate(),
    description: "",
    maxAttendees: "",
    venueAddress: "",
    matchCode: "",
  });

  const set = (key: keyof WizardForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const selectType = (type: EventType) => {
    set("type", type);
    // Pre-fill title if empty
    const titles: Record<EventType, string> = {
      MATCH_DAY:    "Match day fan meetup",
      WATCH_PARTY:  "Watch party with fans",
      FAN_MEETUP:   "Local fan meetup",
      TRAVEL_GROUP: "Travel group for the match",
      AFTER_PARTY:  "Post-match celebration",
    };
    if (!form.title) set("title", titles[type]);
    setTimeout(() => setStep(2), 120);
  };

  const step2Valid = form.title.trim() && form.city.trim() && form.country && form.startsAt;

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : undefined,
          startsAt: new Date(form.startsAt).toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Could not create event. Please check all required fields.");
      setDone(true);
      setTimeout(() => { window.location.reload(); }, 1800);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const conf = EVENT_TYPE_CONFIG[form.type];
  const quickDates = getQuickDates();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card1 border border-border rounded-t-3xl sm:rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull handle */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-0 sm:hidden" />

        {/* Progress bar */}
        <div className="h-1 bg-card2">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #E8650A, #FF5E00)" }}
            animate={{ width: done ? "100%" : step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* ── SUCCESS ── */}
        {done && (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #E8650A, #FF5E00)" }}
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="font-display font-bold text-t1 text-xl mb-2">{t("events.published")}</h3>
            <p className="text-t3 text-sm">{t("events.publishedDesc")}</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-t3 text-xs">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Refreshing...</span>
            </div>
          </div>
        )}

        {/* ── STEP 1: Choose type ── */}
        {!done && step === 1 && (
          <div className="p-6">
            <div className="mb-5">
              <p className="text-t3 text-xs font-black uppercase tracking-widest mb-1">{t("events.stepType")} · 1/3</p>
              <h2 className="font-display font-bold text-t1 text-xl">What type of event?</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, (typeof EVENT_TYPE_CONFIG)[EventType]][]).map(
                ([type, c]) => (
                  <button
                    key={type}
                    onClick={() => selectType(type)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                      form.type === type
                        ? "border-[#E8650A] bg-[#E8650A10]"
                        : "border-border bg-card2 hover:border-t3"
                    )}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="flex-1">
                      <p className="font-display font-bold text-t1 text-sm">{c.label}</p>
                      <p className="text-t3 text-xs">{c.sublabel}</p>
                    </div>
                    {form.type === type && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                           style={{ background: "#E8650A" }}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: When & Where ── */}
        {!done && step === 2 && (
          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep(1)} className="text-t3 hover:text-t1">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="text-t3 text-xs font-black uppercase tracking-widest">{t("events.stepWhen")} · 2/3</p>
                <h2 className="font-display font-bold text-t1 text-xl">{t("events.stepWhen")}?</h2>
              </div>
            </div>

            {/* Event type badge */}
            <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl border"
                 style={{ borderColor: `${conf.color}40`, background: conf.bg }}>
              <span>{conf.emoji}</span>
              <span className="text-sm font-bold" style={{ color: conf.color }}>{conf.label}</span>
              <button className="ml-auto text-xs text-t3 hover:text-t1 underline" onClick={() => setStep(1)}>
                change
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-t3 text-xs font-semibold block mb-1.5">
                  Event title <span className="text-[#E8650A]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Colombia fans before kickoff"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full bg-card2 border border-border rounded-xl px-3 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-[#E8650A]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-t3 text-xs font-semibold block mb-1.5">
                  Date &amp; time <span className="text-[#E8650A]">*</span>
                </label>
                {/* Quick date chips */}
                <div className="flex gap-2 mb-2">
                  {quickDates.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => set("startsAt", d.value)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold border transition-all",
                        form.startsAt === d.value
                          ? "text-white border-[#E8650A]"
                          : "bg-card2 border-border text-t2 hover:text-t1"
                      )}
                      style={form.startsAt === d.value ? { background: "#E8650A" } : {}}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => set("startsAt", e.target.value)}
                  className="w-full bg-card2 border border-border rounded-xl px-3 py-2.5 text-sm text-t1 focus:outline-none focus:border-[#E8650A]"
                />
              </div>

              {/* City + Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-t3 text-xs font-semibold block mb-1.5">
                    {t("events.city")} <span className="text-[#E8650A]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Bogota"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    className="w-full bg-card2 border border-border rounded-xl px-3 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-[#E8650A]"
                  />
                </div>
                <div>
                  <label className="text-t3 text-xs font-semibold block mb-1.5">
                    {t("events.selectCountry")} <span className="text-[#E8650A]">*</span>
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className="w-full bg-card2 border border-border rounded-xl px-3 py-2.5 text-sm text-t1 focus:outline-none focus:border-[#E8650A]"
                  >
                    {COUNTRY_OPTIONS.map((o) => (
                      <option key={o.code} value={o.code}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="text-t3 text-xs font-semibold block mb-1.5">
                  {t("events.venue")}
                </label>
                <input
                  type="text"
                  placeholder="Bar name, fan zone, airport..."
                  value={form.venueName}
                  onChange={(e) => set("venueName", e.target.value)}
                  className="w-full bg-card2 border border-border rounded-xl px-3 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-[#E8650A]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(3)}
                disabled={!step2Valid}
                className="flex-1 font-display font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                style={step2Valid
                  ? { background: "linear-gradient(135deg, #E8650A, #FF5E00)", color: "#fff" }
                  : { background: "#1a1a2e", color: "#666" }
                }
              >
                {t("common.next")} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Details (optional) ── */}
        {!done && step === 3 && (
          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep(2)} className="text-t3 hover:text-t1">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="text-t3 text-xs font-black uppercase tracking-widest">{t("events.stepDetails")} · 3/3</p>
                <h2 className="font-display font-bold text-t1 text-xl">{t("events.stepDetails")}</h2>
              </div>
            </div>

            {/* Summary card */}
            <div className="rounded-xl border p-3 mb-5 flex items-center gap-3"
                 style={{ borderColor: `${conf.color}30`, background: conf.bg }}>
              <span className="text-xl">{conf.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-t1 truncate">{form.title}</p>
                <p className="text-xs text-t3">
                  {form.city} · {new Date(form.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <div>
                <label className="text-t3 text-xs font-semibold block mb-1.5">
                  {t("events.description")}
                  <span className="text-t3 font-normal ml-1">({t("events.optional")})</span>
                </label>
                <textarea
                  placeholder="What should fans expect? Dress code, what to bring, how to find the group..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  className="w-full bg-card2 border border-border rounded-xl px-3 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-[#E8650A] resize-none"
                />
              </div>

              {/* Max attendees */}
              <div>
                <label className="text-t3 text-xs font-semibold block mb-1.5">
                  {t("events.maxAttendees")} <span className="text-t3 font-normal">({t("events.optional")})</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  min="1"
                  value={form.maxAttendees}
                  onChange={(e) => set("maxAttendees", e.target.value)}
                  className="w-full bg-card2 border border-border rounded-xl px-3 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-[#E8650A]"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-t3 text-xs font-semibold block mb-1.5">
                  {t("events.venue")} <span className="text-t3 font-normal">({t("events.optional")})</span>
                </label>
                <input
                  type="text"
                  placeholder="Street, neighborhood or Google Maps link"
                  value={form.venueAddress}
                  onChange={(e) => set("venueAddress", e.target.value)}
                  className="w-full bg-card2 border border-border rounded-xl px-3 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-[#E8650A]"
                />
              </div>
            </div>

            {/* Quick publish tip */}
            <div className="mt-4 rounded-xl bg-card2/60 border border-border p-3 flex items-start gap-2">
              <Zap className="w-4 h-4 text-[#E8650A] shrink-0 mt-0.5" />
              <p className="text-xs text-t3">
                You can publish now and add more details later. The event goes live instantly.
              </p>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red bg-red/10 border border-red/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 font-display font-bold py-3.5 rounded-xl text-white text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #E8650A, #FF5E00)", boxShadow: "0 0 20px rgba(232,101,10,0.3)" }}
              >
                {loading ? (
                  <><Clock className="w-4 h-4 animate-spin" /> {t("common.loading")}</>
                ) : (
                  <><Zap className="w-4 h-4" /> {t("events.publish")}</>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
