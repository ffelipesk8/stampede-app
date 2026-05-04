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
  COL: "Nestor Lorenzo",
  ECU: "Sebastian Beccacece",
  PAR: "Gustavo Alfaro",
  URU: "Marcelo Bielsa",
  AUS: "Tony Popovic",
  IRN: "Amir Ghalenoei",
  JPN: "Hajime Moriyasu",
  JOR: "Jamal Sellami",
  KOR: "Hong Myung-bo",
  QAT: "Tintin Marquez",
  SAU: "Herve Renard",
  UZB: "Srecko Katanec",
  IRQ: "Jesus Casas",
  ALG: "Vladimir Petkovic",
  CPV: "Bubista",
  CIV: "Emerse Fae",
  EGY: "Hossam Hassan",
  GHA: "Otto Addo",
  MAR: "Walid Regragui",
  SEN: "Pape Thiaw",
  ZAF: "Hugo Broos",
  TUN: "Sami Trabelsi",
  COD: "Sebastien Desabre",
  CUW: "Dick Advocaat",
  HTI: "Sebastien Migne",
  PAN: "Thomas Christiansen",
  NZL: "Darren Bazeley",
  AUT: "Ralf Rangnick",
  BEL: "Rudi Garcia",
  CRO: "Zlatko Dalic",
  FRA: "Didier Deschamps",
  ENG: "Thomas Tuchel",
  ESP: "Luis de la Fuente",
  GER: "Julian Nagelsmann",
  NED: "Ronald Koeman",
  NOR: "Stale Solbakken",
  POR: "Roberto Martinez",
  SCO: "Steve Clarke",
  SUI: "Murat Yakin",
  SWE: "Jon Dahl Tomasson",
  TUR: "Vincenzo Montella",
  BIH: "Sergej Barbarez",
  CZE: "Ivan Hasek",
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
