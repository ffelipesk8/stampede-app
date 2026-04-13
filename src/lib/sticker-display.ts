type CoachStickerLike = {
  name?: string | null;
  playerName?: string | null;
  category?: string | null;
  team?: string | null;
  position?: string | null;
};

type RefereeDisplaySticker = {
  id: string;
  number: number;
  name: string;
  playerName: string;
  team: string;
  teamFlag: string;
  category: "referee";
  position: "REF";
  rarity: string;
  imageUrl: string;
};

export const TEAM_COACH_DISPLAY: Record<string, string> = {
  USA: "Mauricio Pochettino",
  MEX: "Javier Aguirre",
  CAN: "Jesse Marsch",
  ARG: "Lionel Scaloni",
  BRA: "Dorival Junior",
  FRA: "Didier Deschamps",
  ENG: "Thomas Tuchel",
  ESP: "Luis de la Fuente",
  GER: "Julian Nagelsmann",
  POR: "Roberto Martinez",
  NED: "Ronald Koeman",
  BEL: "Domenico Tedesco",
  ITA: "Luciano Spalletti",
  CRO: "Zlatko Dalic",
  DEN: "Brian Riemer",
  URU: "Marcelo Bielsa",
  COL: "Nestor Lorenzo",
  ECU: "Sebastian Beccacece",
  MAR: "Walid Regragui",
  SEN: "Aliou Cisse",
  NGA: "Finidi George",
  EGY: "Hossam Hassan",
  JPN: "Hajime Moriyasu",
  KOR: "Hong Myung-bo",
  AUS: "Tony Popovic",
  IRN: "Amir Ghalenoei",
  SAU: "Roberto Mancini",
  QAT: "Tintin Marquez",
  GHA: "Otto Addo",
  SUI: "Murat Yakin",
  AUT: "Ralf Rangnick",
  NZL: "Darren Bazeley",
};

const REFEREE_SOURCE = [
  { name: "Szymon Marciniak", flag: "POL", rarity: "LEGENDARY" },
  { name: "Cesar Ramos", flag: "MEX", rarity: "EPIC" },
  { name: "Facundo Tello", flag: "ARG", rarity: "EPIC" },
  { name: "Ismail Elfath", flag: "USA", rarity: "EPIC" },
  { name: "Anthony Taylor", flag: "ENG", rarity: "RARE" },
  { name: "Daniele Orsato", flag: "ITA", rarity: "RARE" },
  { name: "Clement Turpin", flag: "FRA", rarity: "RARE" },
  { name: "Michael Oliver", flag: "ENG", rarity: "UNCOMMON" },
] as const;

export const REFEREE_DISPLAY_STICKERS: RefereeDisplaySticker[] = REFEREE_SOURCE.map((referee, index) => ({
  id: `referee-display-${index + 1}`,
  number: 901 + index,
  name: referee.name,
  playerName: referee.name,
  team: "FIFA",
  teamFlag: referee.flag,
  category: "referee",
  position: "REF",
  rarity: referee.rarity,
  imageUrl: `/api/sticker-image?name=${encodeURIComponent(referee.name)}&category=referee`,
}));

export function normalizeStickerDisplay<T extends CoachStickerLike>(sticker: T): T {
  if (sticker.category !== "coach") return sticker;

  const coachName = sticker.team ? TEAM_COACH_DISPLAY[sticker.team] : undefined;
  if (!coachName) return sticker;

  return {
    ...sticker,
    name: coachName,
    playerName: coachName,
    position: sticker.position || "COACH",
  };
}
