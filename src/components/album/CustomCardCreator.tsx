"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type CustomCardPayload = {
  title: string;
  playerName: string;
  team: string;
  teamFlag: string;
  imageUrl: string;
  caption: string;
};

type AlbumSticker = {
  id: string;
  number: number;
  name: string;
  playerName: string | null;
  team: string;
  teamFlag: string;
  category: string;
  position: string;
  rarity: string;
  imageUrl: string;
  owned: boolean;
  quantity: number;
  isCustom: boolean;
  customImageUrl: string | null;
};

const FLAG: Record<string, string> = {
  ARG: "ARG", AUS: "AUS", BEL: "BEL", BRA: "BRA", CAN: "CAN", CHE: "CHE",
  CMR: "CMR", COL: "COL", CRI: "CRI", DEU: "DEU", DNK: "DNK", ECU: "ECU",
  EGY: "EGY", ENG: "ENG", ESP: "ESP", FRA: "FRA", GHA: "GHA", HRV: "HRV",
  IRN: "IRN", ITA: "ITA", JPN: "JPN", KOR: "KOR", MAR: "MAR", MEX: "MEX",
  NGA: "NGA", NLD: "NLD", PAN: "PAN", POR: "POR", QAT: "QAT", SAU: "SAU",
  SEN: "SEN", USA: "USA", URY: "URY", FIFA: "FIFA",
};

export function CustomCardCreator({
  isOpen,
  teams,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  teams: string[];
  onClose: () => void;
  onCreated: (card: AlbumSticker) => void;
}) {
  const { locale } = useLanguage();
  const [title, setTitle] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [team, setTeam] = useState(teams[0] ?? "FIFA");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const labels = locale === "es"
    ? {
        eyebrow: "FAN MOMENT",
        title: "Crea tu propia carta",
        subtitle: "Usa una foto tuya con un jugador desde un link externo. Nosotros no guardamos la imagen, solo la referencia.",
        cardTitle: "Titulo de la carta",
        playerName: "Jugador o protagonista",
        team: "Equipo o seleccion",
        imageUrl: "Link externo de la imagen",
        caption: "Texto corto",
        helper: "Ejemplo: \"Con Messi en Miami\" o \"Meet & Greet con Armani\"",
        privacy: "La imagen sigue viviendo en el link original. KARTAZO solo la muestra como carta social.",
        cancel: "Cancelar",
        create: "Crear carta",
        creating: "Creando carta...",
      }
    : {
        eyebrow: "FAN MOMENT",
        title: "Create your own card",
        subtitle: "Use a photo with a player from an external link. We do not store the image, only the reference.",
        cardTitle: "Card title",
        playerName: "Player or featured person",
        team: "Team",
        imageUrl: "External image URL",
        caption: "Short caption",
        helper: "Example: \"With Messi in Miami\" or \"Meet & Greet with Armani\"",
        privacy: "The image stays on the original link. KARTAZO only renders it as a social card.",
        cancel: "Cancel",
        create: "Create card",
        creating: "Creating card...",
      };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const payload: CustomCardPayload = {
      title,
      playerName,
      team,
      teamFlag: FLAG[team] ?? team,
      imageUrl,
      caption,
    };

    try {
      const response = await fetch("/api/custom-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        const message =
          typeof data?.error === "string"
            ? data.error
            : locale === "es"
              ? "No pudimos crear la carta. Revisa el link de la imagen e intenta otra vez."
              : "We could not create the card. Check the image URL and try again.";
        throw new Error(message);
      }

      onCreated(data.card);
      setTitle("");
      setPlayerName("");
      setImageUrl("");
      setCaption("");
      setTeam(teams[0] ?? "FIFA");
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : locale === "es"
            ? "Ocurrio un error al crear la carta."
            : "Something went wrong while creating the card.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,#0f1020_0%,#0a0b14_100%)] shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/8 px-5 py-5 sm:px-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#E8650A]">
              {labels.eyebrow}
            </p>
            <h3 className="mt-1 font-condensed text-3xl font-black text-white">
              {labels.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
              {labels.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">{labels.cardTitle}</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={labels.helper}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#E8650A]/70"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">{labels.playerName}</span>
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Lionel Messi"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#E8650A]/70"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">{labels.team}</span>
            <select
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#141625] px-4 py-3 text-sm text-white outline-none transition focus:border-[#E8650A]/70"
            >
              {[...teams, "FIFA"].filter((value, index, list) => list.indexOf(value) === index).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">{labels.caption}</span>
            <input
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder={labels.helper}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#E8650A]/70"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">{labels.imageUrl}</span>
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#E8650A]/70"
              required
            />
          </label>

          <div className="sm:col-span-2 rounded-[22px] border border-[#E8650A]/20 bg-[#E8650A]/8 p-4 text-sm leading-6 text-white/78">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#E8650A]" />
              <p>{labels.privacy}</p>
            </div>
          </div>

          {error && (
            <div className="sm:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="sm:col-span-2 flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/72 transition hover:bg-white/[0.08]"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#E8650A,#FF5E00)] px-5 py-3 text-sm font-black text-white shadow-[0_0_22px_rgba(232,101,10,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {submitting ? labels.creating : labels.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
