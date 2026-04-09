"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Plus, Search, Filter, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

const EVENT_TYPE_CONFIG: Record<EventType, { label: string; emoji: string; color: string }> = {
  MATCH_DAY:     { label: "Match Day",     emoji: "⚽", color: "#E8003D" },
  WATCH_PARTY:   { label: "Watch Party",   emoji: "📺", color: "#4A6FFF" },
  FAN_MEETUP:    { label: "Fan Meetup",    emoji: "👥", color: "#00D97E" },
  TRAVEL_GROUP:  { label: "Travel Group",  emoji: "✈️", color: "#FFB800" },
  AFTER_PARTY:   { label: "After Party",   emoji: "🎉", color: "#9B59B6" },
};

const TEAM_FLAGS: Record<string, string> = {
  ARG: "🇦🇷", BRA: "🇧🇷", FRA: "🇫🇷", ESP: "🇪🇸", DEU: "🇩🇪", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  MEX: "🇲🇽", USA: "🇺🇸", POR: "🇵🇹", NLD: "🇳🇱",
};

export function EventsClient({ events, myEvents, userId, favoriteTeam, countryCode }: EventsClientProps) {
  const [activeTab, setActiveTab] = useState<"discover" | "my">("discover");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<EventType | "ALL">("ALL");
  const [showCreate, setShowCreate] = useState(false);
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
    const res = await fetch(`/api/events/${eventId}/attend`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setAttendingIds((prev) => {
        const next = new Set(prev);
        data.attending ? next.add(eventId) : next.delete(eventId);
        return next;
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* -- Header -- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-condensed text-4xl font-black text-t1 tracking-wide">Fan Events Hub</h1>
          <p className="text-t2 text-sm mt-1">Find your tribe · Plan your journey · Never watch alone</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-red hover:bg-red/90 text-white font-display font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* -- Stats -- */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Events Happening", value: events.length, color: "text-red" },
          { label: "Fans Connected", value: events.reduce((a, e) => a + e.attendeeCount, 0), color: "text-orange" },
          { label: "Cities", value: new Set(events.map((e) => e.city)).size, color: "text-gold" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card1 border border-border rounded-xl p-4 text-center">
            <p className={`font-condensed text-3xl font-black ${color}`}>{value.toLocaleString()}</p>
            <p className="text-t3 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* -- Tabs -- */}
      <div className="flex items-center gap-4">
        <div className="flex bg-card1 border border-border rounded-xl p-1 gap-1">
          {(["discover", "my"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-lg font-display font-semibold text-sm transition-colors capitalize",
                activeTab === tab ? "bg-card2 text-t1" : "text-t3 hover:text-t1"
              )}
            >
              {tab === "discover" ? "Discover" : "My Events"}
              {tab === "my" && myEvents.length > 0 && (
                <span className="ml-2 bg-red text-white text-[10px] font-black w-4 h-4 rounded-full inline-flex items-center justify-center">
                  {myEvents.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
          <input
            type="text"
            placeholder="Search by event name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card1 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-orange"
          />
        </div>
      </div>

      {/* -- Type filter chips -- */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterType("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
            filterType === "ALL" ? "bg-orange text-white border-orange" : "bg-card1 border-border text-t2 hover:text-t1"
          )}
        >
          🌍 All Types
        </button>
        {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(([type, conf]) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
              filterType === type ? "text-bg border-transparent" : "bg-card1 border-border text-t2 hover:text-t1"
            )}
            style={filterType === type ? { background: conf.color, borderColor: conf.color } : {}}
          >
            {conf.emoji} {conf.label}
          </button>
        ))}
      </div>

      {/* -- Events list -- */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-t3">
            <p className="text-4xl mb-3">📍</p>
            <p className="font-display font-semibold">No events found</p>
            <p className="text-sm mt-1">
              {activeTab === "my" ? "You haven't joined or created any events yet." : "Try different filters or create the first one!"}
            </p>
          </div>
        ) : (
          filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAttending={attendingIds.has(event.id)}
              onAttend={() => handleAttend(event.id)}
              onClick={() => setSelectedEvent(event)}
            />
          ))
        )}
      </div>

      {/* -- Create event modal -- */}
      <AnimatePresence>
        {showCreate && (
          <CreateEventModal
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

// -- Event Card ----------------------------------------------------------------
function EventCard({ event, isAttending, onAttend, onClick }: {
  event: FanEvent;
  isAttending: boolean;
  onAttend: () => void;
  onClick: () => void;
}) {
  const typeConf = EVENT_TYPE_CONFIG[event.type];
  const startDate = new Date(event.startsAt);
  const isSoon = startDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card1 border border-border rounded-2xl p-5 hover:border-t3 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Type icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: typeConf.color + "20", border: `1px solid ${typeConf.color}40` }}
        >
          {typeConf.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display font-bold text-t1 text-base">{event.title}</h3>
            {event.isVerified && <span className="text-[10px] font-black text-blue bg-blue/10 border border-blue/30 px-1.5 py-0.5 rounded">OFFICIAL</span>}
            {isSoon && <span className="text-[10px] font-black text-red bg-red/10 border border-red/30 px-1.5 py-0.5 rounded">SOON</span>}
          </div>

          {event.description && (
            <p className="text-t2 text-xs mb-2 line-clamp-2">{event.description}</p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 text-t3 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{event.city}{event.venueName ? ` · ${event.venueName}` : ""}</span>
            </div>
            <div className="flex items-center gap-1 text-t3 text-xs">
              <Calendar className="w-3 h-3" />
              <span>{startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div className="flex items-center gap-1 text-t3 text-xs">
              <Users className="w-3 h-3" />
              <span className="font-semibold text-t2">{event.attendeeCount} fans</span>
              {event.maxAttendees && <span>/ {event.maxAttendees}</span>}
            </div>
          </div>
        </div>

        {/* Attend button */}
        <button
          onClick={(e) => { e.stopPropagation(); onAttend(); }}
          className={cn(
            "shrink-0 px-4 py-2 rounded-xl text-sm font-display font-bold transition-all",
            isAttending
              ? "bg-green/10 border border-green/40 text-green hover:bg-red/10 hover:border-red/40 hover:text-red"
              : "bg-card2 border border-border text-t2 hover:border-orange hover:text-orange"
          )}
        >
          {isAttending ? "✓ Going" : "Join"}
        </button>
      </div>
    </motion.div>
  );
}

// -- Event Detail Modal --------------------------------------------------------
function EventDetailModal({ event, isAttending, onAttend, onClose }: {
  event: FanEvent;
  isAttending: boolean;
  onAttend: () => void;
  onClose: () => void;
}) {
  const typeConf = EVENT_TYPE_CONFIG[event.type];
  const startDate = new Date(event.startsAt);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card1 border border-border rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: typeConf.color + "20" }}
            >
              {typeConf.emoji}
            </div>
            <div>
              <h2 className="font-display font-bold text-t1 text-lg">{event.title}</h2>
              <p className="text-xs font-bold" style={{ color: typeConf.color }}>{typeConf.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-t3 hover:text-t1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {event.description && (
          <p className="text-t2 text-sm mb-4">{event.description}</p>
        )}

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-t3 shrink-0" />
            <div>
              <p className="text-t1">{event.city}, {event.country}</p>
              {event.venueAddress && <p className="text-t3 text-xs">{event.venueAddress}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-t3 shrink-0" />
            <p className="text-t1">
              {startDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              {" · "}
              {startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-t3 shrink-0" />
            <p className="text-t1">
              <span className="font-bold text-orange">{event.attendeeCount}</span> fans attending
              {event.maxAttendees && ` · ${event.maxAttendees - event.attendeeCount} spots left`}
            </p>
          </div>
          {event.creator && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-full bg-card2 shrink-0 overflow-hidden">
                {event.creator.avatarUrl && <img src={event.creator.avatarUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <p className="text-t3">Created by <span className="text-t2">@{event.creator.username}</span>
                {event.creator.favoriteTeam && ` ${TEAM_FLAGS[event.creator.favoriteTeam] ?? ""}`}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onAttend}
          className={cn(
            "w-full py-3 rounded-xl font-display font-bold text-base transition-all",
            isAttending
              ? "bg-green/10 border border-green/40 text-green hover:bg-red/10 hover:border-red/40 hover:text-red"
              : "bg-orange hover:bg-orange/90 text-white"
          )}
        >
          {isAttending ? "✓ You're going · Click to leave" : "Join this event →"}
        </button>
      </motion.div>
    </motion.div>
  );
}

// -- Create Event Modal --------------------------------------------------------
const COUNTRY_OPTIONS = [
  { code: "ARG", label: "Argentina" },
  { code: "BRA", label: "Brazil" },
  { code: "COL", label: "Colombia" },
  { code: "ESP", label: "Spain" },
  { code: "FRA", label: "France" },
  { code: "MEX", label: "Mexico" },
  { code: "USA", label: "United States" },
];

const EVENT_TEMPLATES: Record<EventType, { title: string; venue: string; description: string }> = {
  MATCH_DAY: {
    title: "Match day fan meetup",
    venue: "Official fan zone",
    description: "We meet before kickoff, wear team colors and enjoy the full match-day vibe together.",
  },
  WATCH_PARTY: {
    title: "Watch party with fans",
    venue: "Sports bar or home watch party",
    description: "Big screen, chants, predictions and a relaxed place to watch the match together.",
  },
  FAN_MEETUP: {
    title: "Local fan meetup",
    venue: "Central meeting point",
    description: "Casual meetup to connect with other fans, swap stories and plan future match days.",
  },
  TRAVEL_GROUP: {
    title: "Travel group for the match",
    venue: "Airport or transport hub",
    description: "Coordinate logistics, transport and hotel details with other fans going to the same game.",
  },
  AFTER_PARTY: {
    title: "Post-match celebration",
    venue: "Night venue or bar",
    description: "Celebrate after the game with music, highlights and other supporters from the event.",
  },
};

function CreateEventModal({
  onClose,
  favoriteTeam,
  countryCode,
}: {
  onClose: () => void;
  favoriteTeam: string | null;
  countryCode: string | null;
}) {
  const defaultCountry = countryCode ?? favoriteTeam ?? "COL";
  const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  defaultDate.setMinutes(0, 0, 0);
  defaultDate.setHours(19);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "FAN_MEETUP" as EventType,
    city: "",
    country: defaultCountry,
    venueName: "",
    venueAddress: "",
    startsAt: defaultDate.toISOString().slice(0, 16),
    matchCode: "",
    maxAttendees: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const applyTemplate = (type: EventType) => {
    const template = EVENT_TEMPLATES[type];
    setForm((current) => ({
      ...current,
      type,
      title: current.title || template.title,
      venueName: current.venueName || template.venue,
      description: current.description || template.description,
    }));
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
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
      if (!res.ok) {
        const d = await res.json();
        throw new Error("We could not create the event. Please check title, city, country and date.");
      }
      setSuccess("Event created. Refreshing the page...");
      setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="text-t3 text-xs font-semibold block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-card2 border border-border rounded-lg px-3 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-orange"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card1 border border-border rounded-2xl p-6 max-w-md w-full my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-t1 text-xl">Create Fan Event</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-t3" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-t3 text-xs font-semibold block mb-2">Quick start</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(([type, conf]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => applyTemplate(type)}
                  className="px-3 py-2 rounded-lg text-xs font-bold border border-border bg-card2 text-t1 hover:border-orange transition-colors"
                >
                  {conf.emoji} {conf.label}
                </button>
              ))}
            </div>
          </div>

          {field("Event Title *", "title", "text", "e.g. Colombia fans meetup before kickoff")}

          <div>
            <label className="text-t3 text-xs font-semibold block mb-1">Event Type *</label>
            <select
              value={form.type}
              onChange={(e) => applyTemplate(e.target.value as EventType)}
              className="w-full bg-card2 border border-border rounded-lg px-3 py-2.5 text-sm text-t1 focus:outline-none focus:border-orange"
            >
              {Object.entries(EVENT_TYPE_CONFIG).map(([t, c]) => (
                <option key={t} value={t}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field("City *", "city", "text", "Bogota")}
            <div>
              <label className="text-t3 text-xs font-semibold block mb-1">Country *</label>
              <select
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full bg-card2 border border-border rounded-lg px-3 py-2.5 text-sm text-t1 focus:outline-none focus:border-orange"
              >
                {COUNTRY_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {field("Venue Name", "venueName", "text", "Bar, fan zone, airport or meeting point")}
          {field("Address or Reference", "venueAddress", "text", "Optional but helpful for new fans")}
          {field("Date & Time *", "startsAt", "datetime-local")}
          {field("Match Code", "matchCode", "text", "Optional: MEX-POL-GRP-2026")}
          {field("Max Attendees", "maxAttendees", "number", "Leave blank for unlimited")}

          <div>
            <label className="text-t3 text-xs font-semibold block mb-1">Description</label>
            <textarea
              placeholder="Tell fans what to expect, what to bring, and how to find the group..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full bg-card2 border border-border rounded-lg px-3 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-orange resize-none"
            />
          </div>

          <div className="rounded-xl border border-border bg-card2/50 p-3 text-xs text-t2">
            Tip: for a new event, the fastest format is city + venue + date + one clear sentence about the plan.
          </div>

          {error && <p className="text-red text-sm">{error}</p>}
          {success && <p className="text-green text-sm">{success}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={submit}
              disabled={loading || !form.title || !form.city || !form.startsAt}
              className="flex-1 bg-red hover:bg-red/90 text-white font-display font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event →"}
            </button>
            <button onClick={onClose} className="px-4 bg-card2 border border-border text-t2 rounded-xl hover:text-t1 font-display font-semibold">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
