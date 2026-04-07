import { NextRequest, NextResponse } from "next/server";
import { decodeMojibake, normalizeEntityName, normalizedLookup } from "@/lib/sticker-names";

function proxied(url: string) {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

// ── Stadiums ──────────────────────────────────────────────────────────────────
const STADIUM_IMAGES: Record<string, string> = {
  "MetLife Stadium":        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/MetLife_Stadium_-_Aerial_photo.jpg/640px-MetLife_Stadium_-_Aerial_photo.jpg",
  "AT&T Stadium":           "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/ATT_Stadium_-_Aerial_Photo.jpg/640px-ATT_Stadium_-_Aerial_Photo.jpg",
  "SoFi Stadium":           "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/SoFi_Stadium_aerial_view.jpg/640px-SoFi_Stadium_aerial_view.jpg",
  "Hard Rock Stadium":      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Hard_Rock_Stadium_2019.jpg/640px-Hard_Rock_Stadium_2019.jpg",
  "Levi's Stadium":         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Levi%27s_Stadium_aerial_view.jpg/640px-Levi%27s_Stadium_aerial_view.jpg",
  "Arrowhead Stadium":      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Arrowhead_Stadium_aerial.jpg/640px-Arrowhead_Stadium_aerial.jpg",
  "Gillette Stadium":       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Gillette_Stadium_2019.jpg/640px-Gillette_Stadium_2019.jpg",
  "Lincoln Financial Field":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Lincoln_Financial_Field.jpg/640px-Lincoln_Financial_Field.jpg",
  "Estadio Azteca":         "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Estadio_Azteca_-_Mexico_City_2016.jpg/640px-Estadio_Azteca_-_Mexico_City_2016.jpg",
  "Estadio BBVA":           "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Estadio_BBVA_%28cropped%29.jpg/640px-Estadio_BBVA_%28cropped%29.jpg",
  "BC Place":               "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/BCPlace2011.jpg/640px-BCPlace2011.jpg",
  "BMO Field":              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/BMO_Field_panoramic_%28cropped%29.jpg/640px-BMO_Field_panoramic_%28cropped%29.jpg",
  // Iconic world stadiums
  "Wembley Stadium":        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Wembley_Stadium_interior.jpg/640px-Wembley_Stadium_interior.jpg",
  "Camp Nou":               "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Camp_Nou_-_01.jpg/640px-Camp_Nou_-_01.jpg",
  "Allianz Arena":          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/AllianzArenaAugust2006.jpg/640px-AllianzArenaAugust2006.jpg",
  "Maracanã":               "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Maracan%C3%A3_Rio_de_Janeiro_-_Brazil.jpg/640px-Maracan%C3%A3_Rio_de_Janeiro_-_Brazil.jpg",
  "Luzhniki Stadium":       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Luzhniki_Stadium_2018.jpg/640px-Luzhniki_Stadium_2018.jpg",
  "Azteca Stadium":         "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Estadio_Azteca_-_Mexico_City_2016.jpg/640px-Estadio_Azteca_-_Mexico_City_2016.jpg",
};

// ── Host Cities ───────────────────────────────────────────────────────────────
const CITY_IMAGES: Record<string, string> = {
  "New York":       "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg/640px-Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg",
  "New York City":  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg/640px-Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg",
  "Los Angeles":    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/20190616014452%21Echo_Park_Lake%2C_Los_Angeles.jpg/640px-20190616014452%21Echo_Park_Lake%2C_Los_Angeles.jpg",
  "Dallas":         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Dallas_skyline_2018.jpg/640px-Dallas_skyline_2018.jpg",
  "Miami":          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Miami_collage_20101023.jpg/640px-Miami_collage_20101023.jpg",
  "San Francisco":  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Golden_Gate_Bridge_seen_from_Battery_Spencer_at_dusk.jpg/640px-Golden_Gate_Bridge_seen_from_Battery_Spencer_at_dusk.jpg",
  "Kansas City":    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Kansas_City_Missouri_skyline.jpg/640px-Kansas_City_Missouri_skyline.jpg",
  "Boston":         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Boston_skyline_-_Massachusetts_-_USA.jpg/640px-Boston_skyline_-_Massachusetts_-_USA.jpg",
  "Philadelphia":   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Philadelphia_skyline_from_south_street_bridge_july_2016_HDR.jpg/640px-Philadelphia_skyline_from_south_street_bridge_july_2016_HDR.jpg",
  "Seattle":        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Seattle_Kerry_Park_Skyline.jpg/640px-Seattle_Kerry_Park_Skyline.jpg",
  "Mexico City":    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mexico_City_Aerial_view_2016.jpg/640px-Mexico_City_Aerial_view_2016.jpg",
  "Ciudad de México":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mexico_City_Aerial_view_2016.jpg/640px-Mexico_City_Aerial_view_2016.jpg",
  "Ciudad de Mexico":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mexico_City_Aerial_view_2016.jpg/640px-Mexico_City_Aerial_view_2016.jpg",
  "Guadalajara":    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Guadalajara_Jalisco.jpg/640px-Guadalajara_Jalisco.jpg",
  "Monterrey":      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Monterrey_skyline_2019.jpg/640px-Monterrey_skyline_2019.jpg",
  "Vancouver":      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Vancouver_Canada_Skyline.jpg/640px-Vancouver_Canada_Skyline.jpg",
  "Toronto":        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Toronto_-_ON_-_Bloor_St_at_Bay_%28crop%29.jpg/640px-Toronto_-_ON_-_Bloor_St_at_Bay_%28crop%29.jpg",
};

// ── Coaches / DTs ─────────────────────────────────────────────────────────────
const COACH_IMAGES: Record<string, string> = {
  "Lionel Scaloni":   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Lionel_Scaloni_2022_%28cropped%29.jpg/440px-Lionel_Scaloni_2022_%28cropped%29.jpg",
  "Dorival Júnior":   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Dorival_Junior_2023.jpg/440px-Dorival_Junior_2023.jpg",
  "Didier Deschamps": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Didier_Deschamps_2019_%28cropped%29.jpg/440px-Didier_Deschamps_2019_%28cropped%29.jpg",
  "Luis de la Fuente":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Luis_de_la_Fuente_2023.jpg/440px-Luis_de_la_Fuente_2023.jpg",
  "Julian Nagelsmann":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Julian_Nagelsmann_2022_%28cropped%29.jpg/440px-Julian_Nagelsmann_2022_%28cropped%29.jpg",
  "Gareth Southgate": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Gareth_Southgate_2018_%28cropped%29.jpg/440px-Gareth_Southgate_2018_%28cropped%29.jpg",
  "Roberto Martínez": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Roberto_Mart%C3%ADnez_2022_%28cropped%29.jpg/440px-Roberto_Mart%C3%ADnez_2022_%28cropped%29.jpg",
  "Gregg Berhalter":  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Gregg_Berhalter_2022_%28cropped%29.jpg/440px-Gregg_Berhalter_2022_%28cropped%29.jpg",
  "Jimmy Moreno":     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Jimmy_Moreno_2023.jpg/440px-Jimmy_Moreno_2023.jpg",
  "Mauricio Pochettino": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Mauricio_Pochettino_2023_%28cropped%29.jpg/440px-Mauricio_Pochettino_2023_%28cropped%29.jpg",
  "Walid Regragui":   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Walid_Regragui_2022_%28cropped%29.jpg/440px-Walid_Regragui_2022_%28cropped%29.jpg",
  "Hajime Moriyasu":  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hajime_Moriyasu_2022_%28cropped%29.jpg/440px-Hajime_Moriyasu_2022_%28cropped%29.jpg",
  "Paulo Bento":      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Paulo_Bento_2022_%28cropped%29.jpg/440px-Paulo_Bento_2022_%28cropped%29.jpg",
};

// ── Team Crests ───────────────────────────────────────────────────────────────
const CREST_IMAGES: Record<string, string> = {
  "Argentina":    "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Argentina_football_team_badge.png/200px-Argentina_football_team_badge.png",
  "Brazil":       "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Brazil_football_team_crest.svg/200px-Brazil_football_team_crest.svg.png",
  "France":       "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/France_national_football_team_crest.svg/200px-France_national_football_team_crest.svg.png",
  "Spain":        "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_federacion_española_de_futbol.png/200px-Real_federacion_española_de_futbol.png",
  "Germany":      "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Germany_football_team_crest.svg/200px-Germany_football_team_crest.svg.png",
  "England":      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/England_national_football_team_badge.png/200px-England_national_football_team_badge.png",
  "Portugal":     "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Federation_Portugaise_de_Football_logo.svg/200px-Federation_Portugaise_de_Football_logo.svg.png",
  "Netherlands":  "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Netherlands_football_team_crest.svg/200px-Netherlands_football_team_crest.svg.png",
  "Belgium":      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Royal_Belgian_Football_Association_logo.svg/200px-Royal_Belgian_Football_Association_logo.svg.png",
  "Mexico":       "https://upload.wikimedia.org/wikipedia/en/thumb/6/66/Mexico_football_team_badge.png/200px-Mexico_football_team_badge.png",
  "USA":          "https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/United_States_Soccer_Federation_crest.svg/200px-United_States_Soccer_Federation_crest.svg.png",
  "Morocco":      "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Morocco_FA.png/200px-Morocco_FA.png",
  "Japan":        "https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Japan_national_football_team_crest.svg/200px-Japan_national_football_team_crest.svg.png",
  "South Korea":  "https://upload.wikimedia.org/wikipedia/en/thumb/5/50/South_Korea_national_football_team_crest.svg/200px-South_Korea_national_football_team_crest.svg.png",
  "Senegal":      "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Senegal_Football_Federation_badge.png/200px-Senegal_Football_Federation_badge.png",
  "Canada":       "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/CanadaSoccerLogo.svg/200px-CanadaSoccerLogo.svg.png",
  "Croatia":      "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Croatia_football_team_crest.svg/200px-Croatia_football_team_crest.svg.png",
  "Uruguay":      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Escudo_Ael_fútbol_uruguay.png/200px-Escudo_Ael_fútbol_uruguay.png",
  "Colombia":     "https://upload.wikimedia.org/wikipedia/en/thumb/6/66/Colombia_football_team_badge.png/200px-Colombia_football_team_badge.png",
  "Italy":        "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Football_pictogram.svg/200px-Football_pictogram.svg.png",
};

const NORMALIZED_STADIUM_IMAGES = normalizedLookup(STADIUM_IMAGES);
const NORMALIZED_CITY_IMAGES = normalizedLookup(CITY_IMAGES);
const NORMALIZED_COACH_IMAGES = normalizedLookup(COACH_IMAGES);
const NORMALIZED_CREST_IMAGES = normalizedLookup(CREST_IMAGES);

// ── Wikipedia lookup for unknown entities ─────────────────────────────────────
async function wikiLookup(searchTerms: string[]): Promise<string | null> {
  for (const term of searchTerms) {
    try {
      const slug = term.replace(/ /g, "_");
      const res  = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      {
          headers: { "User-Agent": "STAMPEDE-WorldCup/1.0 (contact@stampede.app)" },
          signal: AbortSignal.timeout(2500),
      }
      );
      if (res.ok) {
        const data = await res.json();
        const url  = data.thumbnail?.source;
        if (url) return proxied(url);
      }
    } catch { /* timeout — try next */ }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const rawName  = req.nextUrl.searchParams.get("name")?.trim();
  const category = req.nextUrl.searchParams.get("category")?.toLowerCase().trim() ?? "player";

  if (!rawName) return NextResponse.json({ url: null });

  const name = decodeMojibake(rawName);
  const normalizedName = normalizeEntityName(name);

  // ── Stadiums ──
  if (category === "stadium" || category === "venue") {
    if (NORMALIZED_STADIUM_IMAGES[normalizedName]) {
      return NextResponse.json({ url: proxied(NORMALIZED_STADIUM_IMAGES[normalizedName]) });
    }
    const url = await wikiLookup([name, `${name} stadium`, `${name} football stadium`]);
    return NextResponse.json({ url });
  }

  // ── Cities ──
  if (category === "city" || category === "host_city") {
    if (NORMALIZED_CITY_IMAGES[normalizedName]) {
      return NextResponse.json({ url: proxied(NORMALIZED_CITY_IMAGES[normalizedName]) });
    }
    const url = await wikiLookup([name, `${name} city`]);
    return NextResponse.json({ url });
  }

  // ── Coaches / DT ──
  if (category === "coach" || category === "manager" || category === "dt") {
    if (NORMALIZED_COACH_IMAGES[normalizedName]) {
      return NextResponse.json({ url: proxied(NORMALIZED_COACH_IMAGES[normalizedName]) });
    }
    const url = await wikiLookup([
      name,
      `${name} football manager`,
      `${name} soccer coach`,
    ]);
    return NextResponse.json({ url });
  }

  // ── Team Crests ──
  if (category === "crest" || category === "team" || category === "badge") {
    if (NORMALIZED_CREST_IMAGES[normalizedName]) {
      return NextResponse.json({ url: proxied(NORMALIZED_CREST_IMAGES[normalizedName]) });
    }
    const url = await wikiLookup([
      `${name} national football team`,
      `${name} football federation`,
    ]);
    return NextResponse.json({ url });
  }

  // ── Moments / Special stickers (Wikipedia article thumbnail) ──
  if (category === "moment" || category === "special") {
    const url = await wikiLookup([name, `${name} FIFA World Cup`]);
    return NextResponse.json({ url });
  }

  // ── Default fallback: try Wikipedia directly ──
  const url = await wikiLookup([name]);
  return NextResponse.json({ url });
}
