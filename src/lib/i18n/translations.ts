// --- KARTAZO · Translation Strings ------------------------------------------
// Languages: EN · ES · PT · FR · DE · AR
// Add new keys here first, then fill all languages.

export type Locale = "en" | "es" | "pt" | "fr" | "de" | "ar";

export const LOCALES: { code: Locale; label: string; nativeLabel: string; flag: string; rtl?: boolean }[] = [
  { code: "en", label: "English",    nativeLabel: "English",    flag: "🇺🇸" },
  { code: "es", label: "Spanish",    nativeLabel: "Español",    flag: "🇲🇽" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português",  flag: "🇧🇷" },
  { code: "fr", label: "French",     nativeLabel: "Français",   flag: "🇫🇷" },
  { code: "de", label: "German",     nativeLabel: "Deutsch",    flag: "🇩🇪" },
  { code: "ar", label: "Arabic",     nativeLabel: "العربية",    flag: "🇸🇦", rtl: true },
];

export type TranslationKey =
  // -- Navigation --------------------------------------------------------------
  | "nav.dashboard"
  | "nav.album"
  | "nav.packs"
  | "nav.ranking"
  | "nav.events"
  | "nav.coach"
  | "nav.marketplace"
  | "nav.profile"
  | "nav.upgrade"
  | "nav.upgradeDesc"
  // -- Common ------------------------------------------------------------------
  | "common.open"
  | "common.close"
  | "common.cancel"
  | "common.collect"
  | "common.loading"
  | "common.error"
  | "common.save"
  | "common.confirm"
  | "common.search"
  | "common.filter"
  | "common.all"
  | "common.owned"
  | "common.missing"
  | "common.free"
  | "common.level"
  | "common.xp"
  | "common.coins"
  | "common.language"
  // -- Dashboard ---------------------------------------------------------------
  | "dashboard.welcome"
  | "dashboard.totalXp"
  | "dashboard.level"
  | "dashboard.stickers"
  | "dashboard.streak"
  | "dashboard.dailyMissions"
  | "dashboard.recentActivity"
  | "dashboard.topPlayers"
  | "dashboard.startOpen"
  // -- Pack Store --------------------------------------------------------------
  | "packs.title"
  | "packs.subtitle"
  | "packs.freeDailyPack"
  | "packs.freeDailyDesc"
  | "packs.openFree"
  | "packs.storeTitle"
  | "packs.recentOpens"
  | "packs.tapToOpen"
  | "packs.again"
  | "packs.oneMore"
  | "packs.tapsLeft"
  | "packs.opening"
  | "packs.youGot"
  | "packs.revealAll"
  | "packs.addToAlbum"
  | "packs.openAnother"
  | "packs.xpBonus"
  | "packs.resetsDaily"
  | "packs.soldOut"
  | "packs.left"
  // -- Album -------------------------------------------------------------------
  | "album.title"
  | "album.progress"
  | "album.complete"
  | "album.rarityBreakdown"
  | "album.searchStickers"
  | "album.allRarities"
  | "album.allTeams"
  | "album.showingStickers"
  | "album.noMatch"
  | "album.noMatchHint"
  | "album.listOnMarket"
  | "album.notOwned"
  | "album.inCollection"
  // -- Ranking -----------------------------------------------------------------
  | "ranking.title"
  | "ranking.subtitle"
  | "ranking.thisWeek"
  | "ranking.allTime"
  | "ranking.yourRank"
  // -- Events ------------------------------------------------------------------
  | "events.title"
  | "events.subtitle"
  | "events.upcoming"
  | "events.live"
  | "events.past"
  // -- Marketplace -------------------------------------------------------------
  | "market.title"
  | "market.subtitle"
  | "market.buy"
  | "market.sell"
  | "market.drops"
  | "market.myListings"
  // -- Profile -----------------------------------------------------------------
  | "profile.title"
  | "profile.editProfile"
  | "profile.stats"
  | "profile.achievements"
  | "profile.collection"
  // -- Album (extended) --------------------------------------------------------
  | "album.xpBonus"
  | "album.groupByTeam"
  | "album.gridView"
  | "album.listView"
  | "album.share"
  | "album.trade"
  | "album.stickers"
  | "album.collapseAll"
  | "album.expandAll"
  | "album.noStickers"
  // -- Events (extended) -------------------------------------------------------
  | "events.createEvent"
  | "events.noEvents"
  | "events.noEventsHint"
  | "events.joinEvent"
  | "events.attendees"
  | "events.full"
  | "events.stepType"
  | "events.stepWhen"
  | "events.stepDetails"
  | "events.publish"
  | "events.published"
  | "events.publishedDesc"
  | "events.totalFans"
  | "events.totalCities"
  | "events.myEvents"
  | "events.createFirst"
  | "events.description"
  | "events.maxAttendees"
  | "events.venue"
  | "events.city"
  | "events.selectCountry"
  | "events.optional"
  | "events.typeMatch"
  | "events.typeBarCrawl"
  | "events.typeFanzone"
  | "events.typeTournament"
  | "events.typeWatch"
  | "events.typeOther"
  // -- Ranking (extended) ------------------------------------------------------
  | "ranking.global"
  | "ranking.country"
  | "ranking.newMembers"
  | "ranking.recentlyJoined"
  | "ranking.justJoined"
  | "ranking.welcomeNew"
  | "ranking.joinedDaysAgo"
  | "ranking.joinedHoursAgo"
  | "ranking.joinedMinutesAgo"
  | "ranking.joinedJustNow"
  | "ranking.streak"
  | "ranking.findMe"
  | "ranking.stickers"
  // -- Common (extended) -------------------------------------------------------
  | "common.share"
  | "common.trade"
  | "common.grid"
  | "common.list"
  | "common.new"
  | "common.viewAll"
  | "common.back"
  | "common.next"
  | "common.done"
  | "common.publish"
  | "common.create"
  // -- Rarity labels -----------------------------------------------------------
  | "rarity.common"
  | "rarity.uncommon"
  | "rarity.rare"
  | "rarity.epic"
  | "rarity.legendary"
  ;

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  "nav.dashboard":    "Dashboard",
  "nav.album":        "My Album",
  "nav.packs":        "Packs",
  "nav.ranking":      "Ranking",
  "nav.events":       "Fan Events",
  "nav.coach":        "Fan Coach AI",
  "nav.marketplace":  "Marketplace",
  "nav.profile":      "Profile",
  "nav.upgrade":      "Upgrade to PRO",
  "nav.upgradeDesc":  "Unlimited AI · 2x packs",

  "common.open":      "Open",
  "common.close":     "Close",
  "common.cancel":    "Cancel",
  "common.collect":   "Collect",
  "common.loading":   "Loading...",
  "common.error":     "Error",
  "common.save":      "Save",
  "common.confirm":   "Confirm",
  "common.search":    "Search",
  "common.filter":    "Filter",
  "common.all":       "All",
  "common.owned":     "Owned",
  "common.missing":   "Missing",
  "common.free":      "FREE",
  "common.level":     "Level",
  "common.xp":        "XP",
  "common.coins":     "Coins",
  "common.language":  "Language",

  "dashboard.welcome":        "Welcome back",
  "dashboard.totalXp":        "Total XP",
  "dashboard.level":          "Level",
  "dashboard.stickers":       "Stickers",
  "dashboard.streak":         "Day Streak",
  "dashboard.dailyMissions":  "Daily Missions",
  "dashboard.recentActivity": "Recent Activity",
  "dashboard.topPlayers":     "Top Players",
  "dashboard.startOpen":      "Open Free Pack →",

  "packs.title":        "Pack Store",
  "packs.subtitle":     "Open packs · Collect stickers · Level up",
  "packs.freeDailyPack":"FREE DAILY PACK",
  "packs.freeDailyDesc":"stickers · Resets every 24h",
  "packs.openFree":     "Open Free →",
  "packs.storeTitle":   "Pack Store",
  "packs.recentOpens":  "Recent Opens",
  "packs.tapToOpen":    "TAP THE PACK",
  "packs.again":        "AGAIN...",
  "packs.oneMore":      "ONE MORE!",
  "packs.tapsLeft":     "taps to open",
  "packs.opening":      "OPENING...",
  "packs.youGot":       "YOU GOT",
  "packs.revealAll":    "Reveal All",
  "packs.addToAlbum":   "Add to Album",
  "packs.openAnother":  "Open Another 🔥",
  "packs.xpBonus":      "XP bonus",
  "packs.resetsDaily":  "Resets every 24h",
  "packs.soldOut":      "SOLD OUT",
  "packs.left":         "left",

  "album.title":          "My Album",
  "album.progress":       "Album Progress",
  "album.complete":       "complete",
  "album.rarityBreakdown":"Rarity Breakdown",
  "album.searchStickers": "Search stickers...",
  "album.allRarities":    "All Rarities",
  "album.allTeams":       "🌍 All Teams",
  "album.showingStickers":"Showing {n} stickers",
  "album.noMatch":        "No stickers match your filters",
  "album.noMatchHint":    "Try changing the team or rarity filter",
  "album.listOnMarket":   "List on Market",
  "album.notOwned":       "Not owned",
  "album.inCollection":   "In your collection",

  "ranking.title":    "Ranking",
  "ranking.subtitle": "See who's on top",
  "ranking.thisWeek": "This Week",
  "ranking.allTime":  "All Time",
  "ranking.yourRank": "Your rank",

  "events.title":    "Fan Events",
  "events.subtitle": "Compete, earn, and win",
  "events.upcoming": "Upcoming",
  "events.live":     "Live Now",
  "events.past":     "Past Events",

  "market.title":      "Marketplace",
  "market.subtitle":   "Buy and sell stickers",
  "market.buy":        "Buy",
  "market.sell":       "Sell",
  "market.drops":      "Drops",
  "market.myListings": "My Listings",

  "profile.title":       "Profile",
  "profile.editProfile": "Edit Profile",
  "profile.stats":       "Stats",
  "profile.achievements":"Achievements",
  "profile.collection":  "Collection",

  "album.xpBonus":      "+XP bonus",
  "album.groupByTeam":  "Group by team",
  "album.gridView":     "Grid",
  "album.listView":     "List",
  "album.share":        "Share",
  "album.trade":        "Trade",
  "album.stickers":     "stickers",
  "album.collapseAll":  "Collapse all",
  "album.expandAll":    "Expand all",
  "album.noStickers":   "No stickers yet",

  "events.createEvent":    "Create Event",
  "events.noEvents":       "No events yet",
  "events.noEventsHint":   "Be the first to organize a fan meetup!",
  "events.joinEvent":      "Join",
  "events.attendees":      "attendees",
  "events.full":           "Full",
  "events.stepType":       "Type",
  "events.stepWhen":       "When & Where",
  "events.stepDetails":    "Details",
  "events.publish":        "Publish Event",
  "events.published":      "Event Published!",
  "events.publishedDesc":  "Your event is now live. Fans can join!",
  "events.totalFans":      "fans",
  "events.totalCities":    "cities",
  "events.myEvents":       "My Events",
  "events.createFirst":    "Create your first event",
  "events.description":    "Description",
  "events.maxAttendees":   "Max attendees",
  "events.venue":          "Venue / Place",
  "events.city":           "City",
  "events.selectCountry":  "Select country",
  "events.optional":       "optional",
  "events.typeMatch":      "Watch Party",
  "events.typeBarCrawl":   "Bar Crawl",
  "events.typeFanzone":    "Fan Zone",
  "events.typeTournament": "Tournament",
  "events.typeWatch":      "Screening",
  "events.typeOther":      "Other",

  "ranking.global":           "Global",
  "ranking.country":          "My Country",
  "ranking.newMembers":       "New Members",
  "ranking.recentlyJoined":   "Recently Joined",
  "ranking.justJoined":       "Just joined!",
  "ranking.welcomeNew":       "Welcome to the crew",
  "ranking.joinedDaysAgo":    "{n}d ago",
  "ranking.joinedHoursAgo":   "{n}h ago",
  "ranking.joinedMinutesAgo": "{n}m ago",
  "ranking.joinedJustNow":    "Just now",
  "ranking.streak":           "streak",
  "ranking.findMe":           "Find me →",
  "ranking.stickers":         "stickers",

  "common.share":    "Share",
  "common.trade":    "Trade",
  "common.grid":     "Grid",
  "common.list":     "List",
  "common.new":      "New",
  "common.viewAll":  "View all",
  "common.back":     "Back",
  "common.next":     "Next",
  "common.done":     "Done",
  "common.publish":  "Publish",
  "common.create":   "Create",

  "rarity.common":    "Common",
  "rarity.uncommon":  "Uncommon",
  "rarity.rare":      "Rare",
  "rarity.epic":      "Epic",
  "rarity.legendary": "Legendary",
};

const es: Translations = {
  "nav.dashboard":    "Inicio",
  "nav.album":        "Mi Álbum",
  "nav.packs":        "Sobres",
  "nav.ranking":      "Ranking",
  "nav.events":       "Eventos Fan",
  "nav.coach":        "Coach IA",
  "nav.marketplace":  "Mercado",
  "nav.profile":      "Perfil",
  "nav.upgrade":      "Hazte PRO",
  "nav.upgradeDesc":  "IA ilimitada · 2x sobres",

  "common.open":      "Abrir",
  "common.close":     "Cerrar",
  "common.cancel":    "Cancelar",
  "common.collect":   "Coleccionar",
  "common.loading":   "Cargando...",
  "common.error":     "Error",
  "common.save":      "Guardar",
  "common.confirm":   "Confirmar",
  "common.search":    "Buscar",
  "common.filter":    "Filtrar",
  "common.all":       "Todos",
  "common.owned":     "Tengo",
  "common.missing":   "Me falta",
  "common.free":      "GRATIS",
  "common.level":     "Nivel",
  "common.xp":        "XP",
  "common.coins":     "Monedas",
  "common.language":  "Idioma",

  "dashboard.welcome":        "Bienvenido de vuelta",
  "dashboard.totalXp":        "XP Total",
  "dashboard.level":          "Nivel",
  "dashboard.stickers":       "Estampas",
  "dashboard.streak":         "Días seguidos",
  "dashboard.dailyMissions":  "Misiones del día",
  "dashboard.recentActivity": "Actividad reciente",
  "dashboard.topPlayers":     "Top jugadores",
  "dashboard.startOpen":      "Abrir sobre gratis →",

  "packs.title":        "Tienda de Sobres",
  "packs.subtitle":     "Abre sobres · Colecciona · Sube de nivel",
  "packs.freeDailyPack":"SOBRE DIARIO GRATIS",
  "packs.freeDailyDesc":"estampas · Se renueva cada 24h",
  "packs.openFree":     "Abrir gratis →",
  "packs.storeTitle":   "Tienda de Sobres",
  "packs.recentOpens":  "Aperturas recientes",
  "packs.tapToOpen":    "TOCA EL SOBRE",
  "packs.again":        "OTRA VEZ...",
  "packs.oneMore":      "¡UNA MÁS!",
  "packs.tapsLeft":     "toques para abrir",
  "packs.opening":      "ABRIENDO...",
  "packs.youGot":       "¡OBTUVISTE",
  "packs.revealAll":    "Revelar todo",
  "packs.addToAlbum":   "Agregar al álbum",
  "packs.openAnother":  "Abrir otro 🔥",
  "packs.xpBonus":      "bonus XP",
  "packs.resetsDaily":  "Se renueva cada 24h",
  "packs.soldOut":      "AGOTADO",
  "packs.left":         "restantes",

  "album.title":          "Mi Álbum",
  "album.progress":       "Progreso del álbum",
  "album.complete":       "completo",
  "album.rarityBreakdown":"Por rareza",
  "album.searchStickers": "Buscar estampas...",
  "album.allRarities":    "Todas las rarezas",
  "album.allTeams":       "🌍 Todos los equipos",
  "album.showingStickers":"Mostrando {n} estampas",
  "album.noMatch":        "Ninguna estampa coincide",
  "album.noMatchHint":    "Prueba cambiando el equipo o la rareza",
  "album.listOnMarket":   "Vender en mercado",
  "album.notOwned":       "No tengo",
  "album.inCollection":   "En mi colección",

  "ranking.title":    "Ranking",
  "ranking.subtitle": "Mira quién lidera",
  "ranking.thisWeek": "Esta semana",
  "ranking.allTime":  "Histórico",
  "ranking.yourRank": "Tu posición",

  "events.title":    "Eventos Fan",
  "events.subtitle": "Compite, gana premios",
  "events.upcoming": "Próximos",
  "events.live":     "En vivo",
  "events.past":     "Pasados",

  "market.title":      "Mercado",
  "market.subtitle":   "Compra y vende estampas",
  "market.buy":        "Comprar",
  "market.sell":       "Vender",
  "market.drops":      "Drops",
  "market.myListings": "Mis ventas",

  "profile.title":       "Perfil",
  "profile.editProfile": "Editar perfil",
  "profile.stats":       "Estadísticas",
  "profile.achievements":"Logros",
  "profile.collection":  "Colección",

  "album.xpBonus":      "+XP bonus",
  "album.groupByTeam":  "Agrupar por equipo",
  "album.gridView":     "Cuadrícula",
  "album.listView":     "Lista",
  "album.share":        "Compartir",
  "album.trade":        "Intercambiar",
  "album.stickers":     "estampas",
  "album.collapseAll":  "Colapsar todo",
  "album.expandAll":    "Expandir todo",
  "album.noStickers":   "Sin estampas aún",

  "events.createEvent":    "Crear evento",
  "events.noEvents":       "Sin eventos aún",
  "events.noEventsHint":   "¡Sé el primero en organizar un encuentro de fans!",
  "events.joinEvent":      "Unirse",
  "events.attendees":      "asistentes",
  "events.full":           "Lleno",
  "events.stepType":       "Tipo",
  "events.stepWhen":       "Cuándo y dónde",
  "events.stepDetails":    "Detalles",
  "events.publish":        "Publicar evento",
  "events.published":      "¡Evento publicado!",
  "events.publishedDesc":  "Tu evento ya está activo. ¡Los fans pueden unirse!",
  "events.totalFans":      "fans",
  "events.totalCities":    "ciudades",
  "events.myEvents":       "Mis eventos",
  "events.createFirst":    "Crea tu primer evento",
  "events.description":    "Descripción",
  "events.maxAttendees":   "Máx. asistentes",
  "events.venue":          "Lugar / Venue",
  "events.city":           "Ciudad",
  "events.selectCountry":  "Selecciona país",
  "events.optional":       "opcional",
  "events.typeMatch":      "Ver partido",
  "events.typeBarCrawl":   "Bares",
  "events.typeFanzone":    "Zona fan",
  "events.typeTournament": "Torneo",
  "events.typeWatch":      "Proyección",
  "events.typeOther":      "Otro",

  "ranking.global":           "Global",
  "ranking.country":          "Mi país",
  "ranking.newMembers":       "Nuevos",
  "ranking.recentlyJoined":   "Recién llegados",
  "ranking.justJoined":       "¡Acaba de unirse!",
  "ranking.welcomeNew":       "Bienvenido a la comunidad",
  "ranking.joinedDaysAgo":    "hace {n}d",
  "ranking.joinedHoursAgo":   "hace {n}h",
  "ranking.joinedMinutesAgo": "hace {n}m",
  "ranking.joinedJustNow":    "Ahora mismo",
  "ranking.streak":           "racha",
  "ranking.findMe":           "Encuéntrame →",
  "ranking.stickers":         "estampas",

  "common.share":    "Compartir",
  "common.trade":    "Intercambiar",
  "common.grid":     "Cuadrícula",
  "common.list":     "Lista",
  "common.new":      "Nuevo",
  "common.viewAll":  "Ver todo",
  "common.back":     "Atrás",
  "common.next":     "Siguiente",
  "common.done":     "Listo",
  "common.publish":  "Publicar",
  "common.create":   "Crear",

  "rarity.common":    "Común",
  "rarity.uncommon":  "Poco común",
  "rarity.rare":      "Raro",
  "rarity.epic":      "Épico",
  "rarity.legendary": "Legendario",
};

const pt: Translations = {
  "nav.dashboard":    "Início",
  "nav.album":        "Meu Álbum",
  "nav.packs":        "Pacotes",
  "nav.ranking":      "Ranking",
  "nav.events":       "Eventos Fã",
  "nav.coach":        "Coach IA",
  "nav.marketplace":  "Mercado",
  "nav.profile":      "Perfil",
  "nav.upgrade":      "Seja PRO",
  "nav.upgradeDesc":  "IA ilimitada · 2x pacotes",

  "common.open":      "Abrir",
  "common.close":     "Fechar",
  "common.cancel":    "Cancelar",
  "common.collect":   "Coletar",
  "common.loading":   "Carregando...",
  "common.error":     "Erro",
  "common.save":      "Salvar",
  "common.confirm":   "Confirmar",
  "common.search":    "Buscar",
  "common.filter":    "Filtrar",
  "common.all":       "Todos",
  "common.owned":     "Tenho",
  "common.missing":   "Falta",
  "common.free":      "GRÁTIS",
  "common.level":     "Nível",
  "common.xp":        "XP",
  "common.coins":     "Moedas",
  "common.language":  "Idioma",

  "dashboard.welcome":        "Bem-vindo de volta",
  "dashboard.totalXp":        "XP Total",
  "dashboard.level":          "Nível",
  "dashboard.stickers":       "Figurinhas",
  "dashboard.streak":         "Dias seguidos",
  "dashboard.dailyMissions":  "Missões do dia",
  "dashboard.recentActivity": "Atividade recente",
  "dashboard.topPlayers":     "Top jogadores",
  "dashboard.startOpen":      "Abrir pacote grátis →",

  "packs.title":        "Loja de Pacotes",
  "packs.subtitle":     "Abra pacotes · Colecione · Suba de nível",
  "packs.freeDailyPack":"PACOTE DIÁRIO GRÁTIS",
  "packs.freeDailyDesc":"figurinhas · Renova a cada 24h",
  "packs.openFree":     "Abrir grátis →",
  "packs.storeTitle":   "Loja de Pacotes",
  "packs.recentOpens":  "Aberturas recentes",
  "packs.tapToOpen":    "TOQUE O PACOTE",
  "packs.again":        "DE NOVO...",
  "packs.oneMore":      "MAIS UM!",
  "packs.tapsLeft":     "toques para abrir",
  "packs.opening":      "ABRINDO...",
  "packs.youGot":       "VOCÊ GANHOU",
  "packs.revealAll":    "Revelar tudo",
  "packs.addToAlbum":   "Adicionar ao álbum",
  "packs.openAnother":  "Abrir outro 🔥",
  "packs.xpBonus":      "bônus XP",
  "packs.resetsDaily":  "Renova a cada 24h",
  "packs.soldOut":      "ESGOTADO",
  "packs.left":         "restantes",

  "album.title":          "Meu Álbum",
  "album.progress":       "Progresso do álbum",
  "album.complete":       "completo",
  "album.rarityBreakdown":"Por raridade",
  "album.searchStickers": "Buscar figurinhas...",
  "album.allRarities":    "Todas as raridades",
  "album.allTeams":       "🌍 Todas as seleções",
  "album.showingStickers":"Mostrando {n} figurinhas",
  "album.noMatch":        "Nenhuma figurinha encontrada",
  "album.noMatchHint":    "Tente mudar o filtro de time ou raridade",
  "album.listOnMarket":   "Vender no mercado",
  "album.notOwned":       "Não tenho",
  "album.inCollection":   "Na minha coleção",

  "ranking.title":    "Ranking",
  "ranking.subtitle": "Veja quem lidera",
  "ranking.thisWeek": "Esta semana",
  "ranking.allTime":  "Histórico",
  "ranking.yourRank": "Sua posição",

  "events.title":    "Eventos Fã",
  "events.subtitle": "Compita, ganhe prêmios",
  "events.upcoming": "Em breve",
  "events.live":     "Ao vivo",
  "events.past":     "Encerrados",

  "market.title":      "Mercado",
  "market.subtitle":   "Compre e venda figurinhas",
  "market.buy":        "Comprar",
  "market.sell":       "Vender",
  "market.drops":      "Drops",
  "market.myListings": "Minhas vendas",

  "profile.title":       "Perfil",
  "profile.editProfile": "Editar perfil",
  "profile.stats":       "Estatísticas",
  "profile.achievements":"Conquistas",
  "profile.collection":  "Coleção",

  "album.xpBonus":      "+XP bônus",
  "album.groupByTeam":  "Agrupar por seleção",
  "album.gridView":     "Grade",
  "album.listView":     "Lista",
  "album.share":        "Compartilhar",
  "album.trade":        "Trocar",
  "album.stickers":     "figurinhas",
  "album.collapseAll":  "Recolher tudo",
  "album.expandAll":    "Expandir tudo",
  "album.noStickers":   "Sem figurinhas ainda",

  "events.createEvent":    "Criar evento",
  "events.noEvents":       "Sem eventos ainda",
  "events.noEventsHint":   "Seja o primeiro a organizar um encontro de fãs!",
  "events.joinEvent":      "Participar",
  "events.attendees":      "participantes",
  "events.full":           "Lotado",
  "events.stepType":       "Tipo",
  "events.stepWhen":       "Quando e onde",
  "events.stepDetails":    "Detalhes",
  "events.publish":        "Publicar evento",
  "events.published":      "Evento publicado!",
  "events.publishedDesc":  "Seu evento está no ar. Os fãs podem participar!",
  "events.totalFans":      "fãs",
  "events.totalCities":    "cidades",
  "events.myEvents":       "Meus eventos",
  "events.createFirst":    "Crie seu primeiro evento",
  "events.description":    "Descrição",
  "events.maxAttendees":   "Máx. participantes",
  "events.venue":          "Local / Venue",
  "events.city":           "Cidade",
  "events.selectCountry":  "Selecione o país",
  "events.optional":       "opcional",
  "events.typeMatch":      "Ver jogo",
  "events.typeBarCrawl":   "Bar Crawl",
  "events.typeFanzone":    "Fan Zone",
  "events.typeTournament": "Torneio",
  "events.typeWatch":      "Exibição",
  "events.typeOther":      "Outro",

  "ranking.global":           "Global",
  "ranking.country":          "Meu país",
  "ranking.newMembers":       "Novos",
  "ranking.recentlyJoined":   "Recém chegados",
  "ranking.justJoined":       "Acabou de entrar!",
  "ranking.welcomeNew":       "Bem-vindo à comunidade",
  "ranking.joinedDaysAgo":    "{n}d atrás",
  "ranking.joinedHoursAgo":   "{n}h atrás",
  "ranking.joinedMinutesAgo": "{n}m atrás",
  "ranking.joinedJustNow":    "Agora mesmo",
  "ranking.streak":           "sequência",
  "ranking.findMe":           "Me encontrar →",
  "ranking.stickers":         "figurinhas",

  "common.share":    "Compartilhar",
  "common.trade":    "Trocar",
  "common.grid":     "Grade",
  "common.list":     "Lista",
  "common.new":      "Novo",
  "common.viewAll":  "Ver tudo",
  "common.back":     "Voltar",
  "common.next":     "Próximo",
  "common.done":     "Pronto",
  "common.publish":  "Publicar",
  "common.create":   "Criar",

  "rarity.common":    "Comum",
  "rarity.uncommon":  "Incomum",
  "rarity.rare":      "Raro",
  "rarity.epic":      "Épico",
  "rarity.legendary": "Lendário",
};

const fr: Translations = {
  "nav.dashboard":    "Tableau de bord",
  "nav.album":        "Mon Album",
  "nav.packs":        "Packs",
  "nav.ranking":      "Classement",
  "nav.events":       "Événements",
  "nav.coach":        "Coach IA",
  "nav.marketplace":  "Marché",
  "nav.profile":      "Profil",
  "nav.upgrade":      "Passer PRO",
  "nav.upgradeDesc":  "IA illimitée · 2x packs",

  "common.open":      "Ouvrir",
  "common.close":     "Fermer",
  "common.cancel":    "Annuler",
  "common.collect":   "Collecter",
  "common.loading":   "Chargement...",
  "common.error":     "Erreur",
  "common.save":      "Sauvegarder",
  "common.confirm":   "Confirmer",
  "common.search":    "Rechercher",
  "common.filter":    "Filtrer",
  "common.all":       "Tous",
  "common.owned":     "Possédés",
  "common.missing":   "Manquants",
  "common.free":      "GRATUIT",
  "common.level":     "Niveau",
  "common.xp":        "XP",
  "common.coins":     "Pièces",
  "common.language":  "Langue",

  "dashboard.welcome":        "Bon retour",
  "dashboard.totalXp":        "XP Total",
  "dashboard.level":          "Niveau",
  "dashboard.stickers":       "Stickers",
  "dashboard.streak":         "Jours consécutifs",
  "dashboard.dailyMissions":  "Missions du jour",
  "dashboard.recentActivity": "Activité récente",
  "dashboard.topPlayers":     "Top joueurs",
  "dashboard.startOpen":      "Ouvrir pack gratuit →",

  "packs.title":        "Boutique de Packs",
  "packs.subtitle":     "Ouvrez des packs · Collectez · Montez en niveau",
  "packs.freeDailyPack":"PACK QUOTIDIEN GRATUIT",
  "packs.freeDailyDesc":"stickers · Se renouvelle toutes les 24h",
  "packs.openFree":     "Ouvrir gratuitement →",
  "packs.storeTitle":   "Boutique",
  "packs.recentOpens":  "Ouvertures récentes",
  "packs.tapToOpen":    "TAPEZ LE PACK",
  "packs.again":        "ENCORE...",
  "packs.oneMore":      "ENCORE UN!",
  "packs.tapsLeft":     "taps pour ouvrir",
  "packs.opening":      "OUVERTURE...",
  "packs.youGot":       "VOUS AVEZ OBTENU",
  "packs.revealAll":    "Tout révéler",
  "packs.addToAlbum":   "Ajouter à l'album",
  "packs.openAnother":  "Ouvrir un autre 🔥",
  "packs.xpBonus":      "bonus XP",
  "packs.resetsDaily":  "Renouvellement toutes les 24h",
  "packs.soldOut":      "ÉPUISÉ",
  "packs.left":         "restants",

  "album.title":          "Mon Album",
  "album.progress":       "Progression de l'album",
  "album.complete":       "complété",
  "album.rarityBreakdown":"Par rareté",
  "album.searchStickers": "Rechercher des stickers...",
  "album.allRarities":    "Toutes raretés",
  "album.allTeams":       "🌍 Toutes les équipes",
  "album.showingStickers":"Affichage de {n} stickers",
  "album.noMatch":        "Aucun sticker ne correspond",
  "album.noMatchHint":    "Essayez de changer le filtre",
  "album.listOnMarket":   "Vendre sur le marché",
  "album.notOwned":       "Non possédé",
  "album.inCollection":   "Dans ma collection",

  "ranking.title":    "Classement",
  "ranking.subtitle": "Voir qui est en tête",
  "ranking.thisWeek": "Cette semaine",
  "ranking.allTime":  "Meilleur score",
  "ranking.yourRank": "Votre rang",

  "events.title":    "Événements Fan",
  "events.subtitle": "Compétez, gagnez des récompenses",
  "events.upcoming": "À venir",
  "events.live":     "En direct",
  "events.past":     "Terminés",

  "market.title":      "Marché",
  "market.subtitle":   "Achetez et vendez des stickers",
  "market.buy":        "Acheter",
  "market.sell":       "Vendre",
  "market.drops":      "Drops",
  "market.myListings": "Mes annonces",

  "profile.title":       "Profil",
  "profile.editProfile": "Modifier le profil",
  "profile.stats":       "Statistiques",
  "profile.achievements":"Succès",
  "profile.collection":  "Collection",

  "album.xpBonus":      "+XP bonus",
  "album.groupByTeam":  "Grouper par équipe",
  "album.gridView":     "Grille",
  "album.listView":     "Liste",
  "album.share":        "Partager",
  "album.trade":        "Échanger",
  "album.stickers":     "stickers",
  "album.collapseAll":  "Tout replier",
  "album.expandAll":    "Tout développer",
  "album.noStickers":   "Aucun sticker encore",

  "events.createEvent":    "Créer un événement",
  "events.noEvents":       "Aucun événement",
  "events.noEventsHint":   "Soyez le premier à organiser un rassemblement de fans!",
  "events.joinEvent":      "Rejoindre",
  "events.attendees":      "participants",
  "events.full":           "Complet",
  "events.stepType":       "Type",
  "events.stepWhen":       "Quand et où",
  "events.stepDetails":    "Détails",
  "events.publish":        "Publier",
  "events.published":      "Événement publié!",
  "events.publishedDesc":  "Votre événement est en ligne. Les fans peuvent rejoindre!",
  "events.totalFans":      "fans",
  "events.totalCities":    "villes",
  "events.myEvents":       "Mes événements",
  "events.createFirst":    "Créez votre premier événement",
  "events.description":    "Description",
  "events.maxAttendees":   "Max participants",
  "events.venue":          "Lieu / Venue",
  "events.city":           "Ville",
  "events.selectCountry":  "Sélectionner pays",
  "events.optional":       "optionnel",
  "events.typeMatch":      "Regarder match",
  "events.typeBarCrawl":   "Bar Crawl",
  "events.typeFanzone":    "Fan Zone",
  "events.typeTournament": "Tournoi",
  "events.typeWatch":      "Projection",
  "events.typeOther":      "Autre",

  "ranking.global":           "Global",
  "ranking.country":          "Mon pays",
  "ranking.newMembers":       "Nouveaux",
  "ranking.recentlyJoined":   "Récemment inscrits",
  "ranking.justJoined":       "Vient de rejoindre!",
  "ranking.welcomeNew":       "Bienvenue dans la communauté",
  "ranking.joinedDaysAgo":    "il y a {n}j",
  "ranking.joinedHoursAgo":   "il y a {n}h",
  "ranking.joinedMinutesAgo": "il y a {n}m",
  "ranking.joinedJustNow":    "À l'instant",
  "ranking.streak":           "série",
  "ranking.findMe":           "Me trouver →",
  "ranking.stickers":         "stickers",

  "common.share":    "Partager",
  "common.trade":    "Échanger",
  "common.grid":     "Grille",
  "common.list":     "Liste",
  "common.new":      "Nouveau",
  "common.viewAll":  "Tout voir",
  "common.back":     "Retour",
  "common.next":     "Suivant",
  "common.done":     "Terminé",
  "common.publish":  "Publier",
  "common.create":   "Créer",

  "rarity.common":    "Commun",
  "rarity.uncommon":  "Peu commun",
  "rarity.rare":      "Rare",
  "rarity.epic":      "Épique",
  "rarity.legendary": "Légendaire",
};

const de: Translations = {
  "nav.dashboard":    "Dashboard",
  "nav.album":        "Mein Album",
  "nav.packs":        "Packs",
  "nav.ranking":      "Rangliste",
  "nav.events":       "Fan-Events",
  "nav.coach":        "Fan-Coach KI",
  "nav.marketplace":  "Marktplatz",
  "nav.profile":      "Profil",
  "nav.upgrade":      "PRO werden",
  "nav.upgradeDesc":  "Unbegrenzte KI · 2x Packs",

  "common.open":      "Öffnen",
  "common.close":     "Schließen",
  "common.cancel":    "Abbrechen",
  "common.collect":   "Sammeln",
  "common.loading":   "Laden...",
  "common.error":     "Fehler",
  "common.save":      "Speichern",
  "common.confirm":   "Bestätigen",
  "common.search":    "Suchen",
  "common.filter":    "Filtern",
  "common.all":       "Alle",
  "common.owned":     "Besitze ich",
  "common.missing":   "Fehlt mir",
  "common.free":      "GRATIS",
  "common.level":     "Level",
  "common.xp":        "XP",
  "common.coins":     "Münzen",
  "common.language":  "Sprache",

  "dashboard.welcome":        "Willkommen zurück",
  "dashboard.totalXp":        "Gesamt XP",
  "dashboard.level":          "Level",
  "dashboard.stickers":       "Sticker",
  "dashboard.streak":         "Tage in Folge",
  "dashboard.dailyMissions":  "Tägliche Missionen",
  "dashboard.recentActivity": "Letzte Aktivität",
  "dashboard.topPlayers":     "Top-Spieler",
  "dashboard.startOpen":      "Gratis Pack öffnen →",

  "packs.title":        "Pack-Shop",
  "packs.subtitle":     "Packs öffnen · Sticker sammeln · Aufleveln",
  "packs.freeDailyPack":"TÄGLICHES GRATIS-PACK",
  "packs.freeDailyDesc":"Sticker · Erneuert alle 24h",
  "packs.openFree":     "Gratis öffnen →",
  "packs.storeTitle":   "Pack-Shop",
  "packs.recentOpens":  "Letzte Öffnungen",
  "packs.tapToOpen":    "PACK ANTIPPEN",
  "packs.again":        "NOCHMAL...",
  "packs.oneMore":      "NOCH EINES!",
  "packs.tapsLeft":     "Taps zum Öffnen",
  "packs.opening":      "ÖFFNET...",
  "packs.youGot":       "DU HAST BEKOMMEN",
  "packs.revealAll":    "Alle aufdecken",
  "packs.addToAlbum":   "Zum Album hinzufügen",
  "packs.openAnother":  "Noch eines öffnen 🔥",
  "packs.xpBonus":      "XP-Bonus",
  "packs.resetsDaily":  "Erneuert alle 24h",
  "packs.soldOut":      "AUSVERKAUFT",
  "packs.left":         "verbleibend",

  "album.title":          "Mein Album",
  "album.progress":       "Album-Fortschritt",
  "album.complete":       "abgeschlossen",
  "album.rarityBreakdown":"Nach Seltenheit",
  "album.searchStickers": "Sticker suchen...",
  "album.allRarities":    "Alle Seltenheiten",
  "album.allTeams":       "🌍 Alle Teams",
  "album.showingStickers":"Zeige {n} Sticker",
  "album.noMatch":        "Keine Sticker gefunden",
  "album.noMatchHint":    "Versuche einen anderen Filter",
  "album.listOnMarket":   "Im Marktplatz anbieten",
  "album.notOwned":       "Nicht besessen",
  "album.inCollection":   "In meiner Sammlung",

  "ranking.title":    "Rangliste",
  "ranking.subtitle": "Wer ist vorne?",
  "ranking.thisWeek": "Diese Woche",
  "ranking.allTime":  "Allzeit",
  "ranking.yourRank": "Dein Rang",

  "events.title":    "Fan-Events",
  "events.subtitle": "Mitmachen, gewinnen",
  "events.upcoming": "Bevorstehend",
  "events.live":     "Live",
  "events.past":     "Vergangen",

  "market.title":      "Marktplatz",
  "market.subtitle":   "Sticker kaufen und verkaufen",
  "market.buy":        "Kaufen",
  "market.sell":       "Verkaufen",
  "market.drops":      "Drops",
  "market.myListings": "Meine Angebote",

  "profile.title":       "Profil",
  "profile.editProfile": "Profil bearbeiten",
  "profile.stats":       "Statistiken",
  "profile.achievements":"Errungenschaften",
  "profile.collection":  "Sammlung",

  "album.xpBonus":      "+XP Bonus",
  "album.groupByTeam":  "Nach Team gruppieren",
  "album.gridView":     "Raster",
  "album.listView":     "Liste",
  "album.share":        "Teilen",
  "album.trade":        "Tauschen",
  "album.stickers":     "Sticker",
  "album.collapseAll":  "Alle einklappen",
  "album.expandAll":    "Alle ausklappen",
  "album.noStickers":   "Noch keine Sticker",

  "events.createEvent":    "Event erstellen",
  "events.noEvents":       "Noch keine Events",
  "events.noEventsHint":   "Sei der Erste und organisiere ein Fan-Treffen!",
  "events.joinEvent":      "Teilnehmen",
  "events.attendees":      "Teilnehmer",
  "events.full":           "Voll",
  "events.stepType":       "Typ",
  "events.stepWhen":       "Wann & Wo",
  "events.stepDetails":    "Details",
  "events.publish":        "Veröffentlichen",
  "events.published":      "Event veröffentlicht!",
  "events.publishedDesc":  "Dein Event ist live. Fans können beitreten!",
  "events.totalFans":      "Fans",
  "events.totalCities":    "Städte",
  "events.myEvents":       "Meine Events",
  "events.createFirst":    "Erstelle dein erstes Event",
  "events.description":    "Beschreibung",
  "events.maxAttendees":   "Max. Teilnehmer",
  "events.venue":          "Veranstaltungsort",
  "events.city":           "Stadt",
  "events.selectCountry":  "Land auswählen",
  "events.optional":       "optional",
  "events.typeMatch":      "Spielabend",
  "events.typeBarCrawl":   "Bar-Tour",
  "events.typeFanzone":    "Fan-Zone",
  "events.typeTournament": "Turnier",
  "events.typeWatch":      "Screening",
  "events.typeOther":      "Sonstiges",

  "ranking.global":           "Global",
  "ranking.country":          "Mein Land",
  "ranking.newMembers":       "Neue",
  "ranking.recentlyJoined":   "Neu eingetreten",
  "ranking.justJoined":       "Gerade beigetreten!",
  "ranking.welcomeNew":       "Willkommen in der Community",
  "ranking.joinedDaysAgo":    "vor {n}T",
  "ranking.joinedHoursAgo":   "vor {n}h",
  "ranking.joinedMinutesAgo": "vor {n}min",
  "ranking.joinedJustNow":    "Gerade eben",
  "ranking.streak":           "Serie",
  "ranking.findMe":           "Find me →",
  "ranking.stickers":         "Sticker",

  "common.share":    "Teilen",
  "common.trade":    "Tauschen",
  "common.grid":     "Raster",
  "common.list":     "Liste",
  "common.new":      "Neu",
  "common.viewAll":  "Alle sehen",
  "common.back":     "Zurück",
  "common.next":     "Weiter",
  "common.done":     "Fertig",
  "common.publish":  "Veröffentlichen",
  "common.create":   "Erstellen",

  "rarity.common":    "Gewöhnlich",
  "rarity.uncommon":  "Ungewöhnlich",
  "rarity.rare":      "Selten",
  "rarity.epic":      "Episch",
  "rarity.legendary": "Legendär",
};

const ar: Translations = {
  "nav.dashboard":    "الرئيسية",
  "nav.album":        "ألبومي",
  "nav.packs":        "الحزم",
  "nav.ranking":      "الترتيب",
  "nav.events":       "أحداث المشجعين",
  "nav.coach":        "المدرب الذكي",
  "nav.marketplace":  "السوق",
  "nav.profile":      "الملف الشخصي",
  "nav.upgrade":      "اشترك PRO",
  "nav.upgradeDesc":  "ذكاء اصطناعي غير محدود",

  "common.open":      "فتح",
  "common.close":     "إغلاق",
  "common.cancel":    "إلغاء",
  "common.collect":   "تجميع",
  "common.loading":   "جار التحميل...",
  "common.error":     "خطأ",
  "common.save":      "حفظ",
  "common.confirm":   "تأكيد",
  "common.search":    "بحث",
  "common.filter":    "تصفية",
  "common.all":       "الكل",
  "common.owned":     "أمتلكه",
  "common.missing":   "مفقود",
  "common.free":      "مجاني",
  "common.level":     "المستوى",
  "common.xp":        "نقاط XP",
  "common.coins":     "عملات",
  "common.language":  "اللغة",

  "dashboard.welcome":        "مرحباً بعودتك",
  "dashboard.totalXp":        "إجمالي XP",
  "dashboard.level":          "المستوى",
  "dashboard.stickers":       "الملصقات",
  "dashboard.streak":         "أيام متتالية",
  "dashboard.dailyMissions":  "مهام اليوم",
  "dashboard.recentActivity": "النشاط الأخير",
  "dashboard.topPlayers":     "أفضل اللاعبين",
  "dashboard.startOpen":      "افتح حزمة مجانية ←",

  "packs.title":        "متجر الحزم",
  "packs.subtitle":     "افتح الحزم · جمّع الملصقات · ارتقِ",
  "packs.freeDailyPack":"حزمة يومية مجانية",
  "packs.freeDailyDesc":"ملصقات · تتجدد كل 24 ساعة",
  "packs.openFree":     "فتح مجاني ←",
  "packs.storeTitle":   "المتجر",
  "packs.recentOpens":  "الفتحات الأخيرة",
  "packs.tapToOpen":    "اضغط على الحزمة",
  "packs.again":        "مرة أخرى...",
  "packs.oneMore":      "ضغطة أخيرة!",
  "packs.tapsLeft":     "ضغطات للفتح",
  "packs.opening":      "جار الفتح...",
  "packs.youGot":       "حصلت على",
  "packs.revealAll":    "اكشف الكل",
  "packs.addToAlbum":   "أضف للألبوم",
  "packs.openAnother":  "افتح أخرى 🔥",
  "packs.xpBonus":      "مكافأة XP",
  "packs.resetsDaily":  "تتجدد كل 24 ساعة",
  "packs.soldOut":      "نفدت الكمية",
  "packs.left":         "متبقي",

  "album.title":          "ألبومي",
  "album.progress":       "تقدم الألبوم",
  "album.complete":       "مكتمل",
  "album.rarityBreakdown":"حسب الندرة",
  "album.searchStickers": "ابحث عن ملصقات...",
  "album.allRarities":    "كل الندرات",
  "album.allTeams":       "🌍 كل المنتخبات",
  "album.showingStickers":"عرض {n} ملصقات",
  "album.noMatch":        "لا توجد ملصقات مطابقة",
  "album.noMatchHint":    "حاول تغيير الفلتر",
  "album.listOnMarket":   "عرض في السوق",
  "album.notOwned":       "غير مملوك",
  "album.inCollection":   "في مجموعتي",

  "ranking.title":    "الترتيب",
  "ranking.subtitle": "من في المقدمة؟",
  "ranking.thisWeek": "هذا الأسبوع",
  "ranking.allTime":  "كل الوقت",
  "ranking.yourRank": "ترتيبك",

  "events.title":    "أحداث المشجعين",
  "events.subtitle": "نافس واربح",
  "events.upcoming": "قادم",
  "events.live":     "مباشر",
  "events.past":     "منتهي",

  "market.title":      "السوق",
  "market.subtitle":   "اشترِ وبِع الملصقات",
  "market.buy":        "شراء",
  "market.sell":       "بيع",
  "market.drops":      "Drops",
  "market.myListings": "عروضي",

  "profile.title":       "الملف الشخصي",
  "profile.editProfile": "تعديل الملف",
  "profile.stats":       "الإحصاءات",
  "profile.achievements":"الإنجازات",
  "profile.collection":  "المجموعة",

  "album.xpBonus":      "+مكافأة XP",
  "album.groupByTeam":  "تجميع حسب الفريق",
  "album.gridView":     "شبكة",
  "album.listView":     "قائمة",
  "album.share":        "مشاركة",
  "album.trade":        "تبادل",
  "album.stickers":     "ملصقات",
  "album.collapseAll":  "طي الكل",
  "album.expandAll":    "توسيع الكل",
  "album.noStickers":   "لا ملصقات بعد",

  "events.createEvent":    "إنشاء حدث",
  "events.noEvents":       "لا أحداث بعد",
  "events.noEventsHint":   "كن أول من ينظم لقاء للمشجعين!",
  "events.joinEvent":      "انضمام",
  "events.attendees":      "حضور",
  "events.full":           "مكتمل",
  "events.stepType":       "النوع",
  "events.stepWhen":       "متى وأين",
  "events.stepDetails":    "تفاصيل",
  "events.publish":        "نشر الحدث",
  "events.published":      "تم النشر!",
  "events.publishedDesc":  "حدثك الآن مباشر. يمكن للمشجعين الانضمام!",
  "events.totalFans":      "مشجع",
  "events.totalCities":    "مدن",
  "events.myEvents":       "أحداثي",
  "events.createFirst":    "أنشئ حدثك الأول",
  "events.description":    "وصف",
  "events.maxAttendees":   "أقصى عدد",
  "events.venue":          "المكان",
  "events.city":           "المدينة",
  "events.selectCountry":  "اختر الدولة",
  "events.optional":       "اختياري",
  "events.typeMatch":      "مشاهدة مباراة",
  "events.typeBarCrawl":   "جولة مقاهي",
  "events.typeFanzone":    "منطقة المشجعين",
  "events.typeTournament": "بطولة",
  "events.typeWatch":      "عرض خاص",
  "events.typeOther":      "أخرى",

  "ranking.global":           "عالمي",
  "ranking.country":          "بلدي",
  "ranking.newMembers":       "جدد",
  "ranking.recentlyJoined":   "المنضمون حديثاً",
  "ranking.justJoined":       "انضم للتو!",
  "ranking.welcomeNew":       "مرحباً في المجتمع",
  "ranking.joinedDaysAgo":    "منذ {n} أيام",
  "ranking.joinedHoursAgo":   "منذ {n} ساعات",
  "ranking.joinedMinutesAgo": "منذ {n} دقائق",
  "ranking.joinedJustNow":    "الآن",
  "ranking.streak":           "سلسلة",
  "ranking.findMe":           "← جدني",
  "ranking.stickers":         "ملصقات",

  "common.share":    "مشاركة",
  "common.trade":    "تبادل",
  "common.grid":     "شبكة",
  "common.list":     "قائمة",
  "common.new":      "جديد",
  "common.viewAll":  "عرض الكل",
  "common.back":     "رجوع",
  "common.next":     "التالي",
  "common.done":     "تم",
  "common.publish":  "نشر",
  "common.create":   "إنشاء",

  "rarity.common":    "شائع",
  "rarity.uncommon":  "غير شائع",
  "rarity.rare":      "نادر",
  "rarity.epic":      "ملحمي",
  "rarity.legendary": "أسطوري",
};

// -- Main dictionary ------------------------------------------------------------
export const TRANSLATIONS: Record<Locale, Translations> = { en, es, pt, fr, de, ar };

// -- t() helper — used by components -------------------------------------------
export function t(locale: Locale, key: TranslationKey, vars?: Record<string, string | number>): string {
  const str = TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  if (!vars) return str;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
    str
  );
}
