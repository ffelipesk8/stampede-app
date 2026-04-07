/**
 * STAMPEDE — Database Seed
 * Run: npm run db:seed
 *
 * Creates:
 *  - ~800 stickers across 32 World Cup 2026 teams
 *  - 8 pack definitions
 *  - 15 badge definitions
 *  - 12 mission templates
 */

import { PrismaClient, Rarity, PackType, MissionType, BadgeRarity } from "@prisma/client";

const db = new PrismaClient();

// ── TEAMS ─────────────────────────────────────────────────────────────────────

const TEAMS = [
  { code: "USA", name: "United States", flag: "🇺🇸", tier: 2 as const },
  { code: "MEX", name: "Mexico",        flag: "🇲🇽", tier: 2 as const },
  { code: "CAN", name: "Canada",        flag: "🇨🇦", tier: 2 as const },
  { code: "ARG", name: "Argentina",     flag: "🇦🇷", tier: 1 as const },
  { code: "BRA", name: "Brazil",        flag: "🇧🇷", tier: 1 as const },
  { code: "FRA", name: "France",        flag: "🇫🇷", tier: 1 as const },
  { code: "ENG", name: "England",       flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 1 as const },
  { code: "ESP", name: "Spain",         flag: "🇪🇸", tier: 1 as const },
  { code: "GER", name: "Germany",       flag: "🇩🇪", tier: 1 as const },
  { code: "POR", name: "Portugal",      flag: "🇵🇹", tier: 1 as const },
  { code: "NED", name: "Netherlands",   flag: "🇳🇱", tier: 2 as const },
  { code: "BEL", name: "Belgium",       flag: "🇧🇪", tier: 2 as const },
  { code: "ITA", name: "Italy",         flag: "🇮🇹", tier: 2 as const },
  { code: "CRO", name: "Croatia",       flag: "🇭🇷", tier: 2 as const },
  { code: "DEN", name: "Denmark",       flag: "🇩🇰", tier: 2 as const },
  { code: "SUI", name: "Switzerland",   flag: "🇨🇭", tier: 2 as const },
  { code: "AUT", name: "Austria",       flag: "🇦🇹", tier: 2 as const },
  { code: "URU", name: "Uruguay",       flag: "🇺🇾", tier: 2 as const },
  { code: "COL", name: "Colombia",      flag: "🇨🇴", tier: 2 as const },
  { code: "ECU", name: "Ecuador",       flag: "🇪🇨", tier: 3 as const },
  { code: "MAR", name: "Morocco",       flag: "🇲🇦", tier: 2 as const },
  { code: "SEN", name: "Senegal",       flag: "🇸🇳", tier: 2 as const },
  { code: "NGA", name: "Nigeria",       flag: "🇳🇬", tier: 2 as const },
  { code: "EGY", name: "Egypt",         flag: "🇪🇬", tier: 2 as const },
  { code: "JPN", name: "Japan",         flag: "🇯🇵", tier: 2 as const },
  { code: "KOR", name: "South Korea",   flag: "🇰🇷", tier: 2 as const },
  { code: "AUS", name: "Australia",     flag: "🇦🇺", tier: 3 as const },
  { code: "IRN", name: "Iran",          flag: "🇮🇷", tier: 3 as const },
  { code: "SAU", name: "Saudi Arabia",  flag: "🇸🇦", tier: 3 as const },
  { code: "QAT", name: "Qatar",         flag: "🇶🇦", tier: 3 as const },
  { code: "GHA", name: "Ghana",         flag: "🇬🇭", tier: 3 as const },
  { code: "NZL", name: "New Zealand",   flag: "🇳🇿", tier: 3 as const },
];

// Famous player names per team (index 0 = star player)
const TEAM_PLAYERS: Record<string, string[]> = {
  ARG: ["Lionel Messi","Julián Álvarez","Rodrigo De Paul","Lautaro Martínez","Enzo Fernández","Alexis Mac Allister","Nahuel Molina","Nicolás Otamendi","Germán Pezzella","Emiliano Martínez","Paulo Dybala","Leandro Paredes","Cristian Romero","Marcos Acuña","Nicolás Tagliafico","Thiago Almada","Valentin Carboni","Nicolás González","Walter Kannemann","Guido Rodríguez","Franco Armani","Gonzalo Montiel","Juan Musso"],
  BRA: ["Vinícius Jr","Rodrygo","Casemiro","Raphinha","Bruno Guimarães","Marquinhos","Gabriel Martinelli","Éder Militão","Alisson Becker","Thiago Silva","Antony","Fred","Fabinho","Danilo","Lucas Paquetá","Richarlison","Gabriel Jesus","Matheus Cunha","Wesley","Endrick","Guilherme Arana","Bremer","Gabriel Magalhães"],
  FRA: ["Kylian Mbappé","Antoine Griezmann","Ousmane Dembélé","Aurélien Tchouaméni","Raphaël Varane","Hugo Lloris","N'Golo Kanté","Olivier Giroud","Theo Hernández","Benjamin Pavard","Marcus Thuram","Dayot Upamecano","Ibrahima Konaté","Eduardo Camavinga","Adrien Rabiot","William Saliba","Kingsley Coman","Randal Kolo Muani","Bradley Barcola","Youssouf Fofana","Mike Maignan","Jules Koundé","Ferland Mendy"],
  ENG: ["Jude Bellingham","Harry Kane","Bukayo Saka","Phil Foden","Marcus Rashford","Declan Rice","Trent Alexander-Arnold","Jordan Henderson","Kyle Walker","John Stones","Harry Maguire","Raheem Sterling","Jack Grealish","Conor Gallagher","Jarrod Bowen","Luke Shaw","Kieran Trippier","Aaron Ramsdale","Jordan Pickford","Kalvin Phillips","Ben Chilwell","Tyrone Mings","Reece James"],
  ESP: ["Pedri","Gavi","Rodri","Lamine Yamal","Álvaro Morata","Dani Carvajal","Aymeric Laporte","Ferran Torres","Nico Williams","Marco Asensio","Fabián Ruiz","Mikel Merino","Unai Simón","David Raya","Eric García","Pau Cubarsí","Mikel Oyarzabal","Dani Olmo","Alejandro Grimaldo","Joselu","Robin Le Normand","Yerlan Kuchkov","Iñaki Williams"],
  GER: ["Jamal Musiala","Leroy Sané","Florian Wirtz","Thomas Müller","Joshua Kimmich","Toni Kroos","Antonio Rüdiger","Kai Havertz","Ilkay Gündogan","Serge Gnabry","Niklas Süle","David Raum","Manuel Neuer","Marc-André ter Stegen","Matthias Ginter","Leon Goretzka","Lukas Nmecha","Niclas Füllkrug","Maximilian Beier","Benjamin Henrichs","Robert Andrich","Aleksandar Pavlovic","Jonathan Tah"],
  POR: ["Cristiano Ronaldo","Bruno Fernandes","Bernardo Silva","Rafael Leão","João Cancelo","Diogo Jota","Rúben Dias","Pepe","William Carvalho","Rúben Neves","João Felix","Vitinha","Otávio","Nuno Mendes","Diogo Dalot","Mário Rui","Gonçalo Inácio","Matheus Nunes","Pedro Neto","Francisco Conceição","Rui Patrício","Diogo Costa","Gonçalo Ramos"],
  NED: ["Virgil van Dijk","Frenkie de Jong","Memphis Depay","Cody Gakpo","Daley Blind","Steven Bergwijn","Denzel Dumfries","Nathan Aké","Matthijs de Ligt","Wout Weghorst","Teun Koopmeiners","Marten de Roon","Xavi Simons","Brian Brobbey","Ryan Gravenberch","Lutsharel Geertruida","Devyne Rensch","Tijjani Reijnders","Quinten Timber","Justin Kluivert","Bart Verbruggen","Mark Flekken","Jeremie Frimpong"],
  BEL: ["Kevin De Bruyne","Romelu Lukaku","Thibaut Courtois","Jan Vertonghen","Toby Alderweireld","Eden Hazard","Youri Tielemans","Axel Witsel","Dries Mertens","Leandro Trossard","Jeremy Doku","Charles De Ketelaere","Zeno Debast","Wout Faes","Arthur Theate","Orel Mangala","Thomas Meunier","Koen Casteels","Amadou Onana","Johan Bakayoko","Lois Openda","Loïs Vansina","Maarten Vandevoordt"],
  ITA: ["Federico Chiesa","Lorenzo Pellegrini","Nicolò Barella","Gianluigi Donnarumma","Leonardo Bonucci","Giorgio Chiellini","Marco Verratti","Ciro Immobile","Bryan Cristante","Alessandro Bastoni","Giovanni Di Lorenzo","Federico Dimarco","Giacomo Raspadori","Sandro Tonali","Nicolò Zaniolo","Matteo Politano","Davide Frattesi","Gianluca Scamacca","Riccardo Calafiori","Guglielmo Vicario","Alex Meret","Matteo Darmian","Wilfried Gnonto"],
  USA: ["Christian Pulisic","Weston McKennie","Tyler Adams","Gio Reyna","Matt Turner","Zack Steffen","Sergiño Dest","Miles Robinson","John Brooks","Tim Weah","Josh Sargent","Ricardo Pepi","Folarin Balogun","Yunus Musah","DeAndre Yedlin","Walker Zimmerman","Antonee Robinson","Brendan Aaronson","Jonathan Gomez","Malik Tillman","Cameron Carter-Vickers","Caleb Wiley","Kevin Paredes"],
  MEX: ["Hirving Lozano","Raúl Jiménez","Héctor Moreno","Guillermo Ochoa","Andrés Guardado","Carlos Vela","Jesús Corona","Diego Lainez","Henry Martín","Orbelin Pineda","Edson Álvarez","Hirving Lozano","Roberto Alvarado","Rogelio Funes Mori","Jesús Gallardo","Miguel Layún","Luis Rodríguez","César Montes","Johan Vásquez","Alexis Vega","Jonathan Dos Santos","Erick Aguirre","Carlos Acevedo"],
  CAN: ["Alphonso Davies","Jonathan David","Cyle Larin","Tajon Buchanan","Milan Borjan","Samuel Piette","Stephen Eustáquio","Scott Kennedy","Liam Millar","Jonathan Osorio","Richie Laryea","Alistair Johnston","Derek Cornelius","Joel Waterman","Kamal Miller","Ismaël Koné","Mathieu Choinière","Ali Ahmed","Ike Ugbo","Jayden Nelson","David Wotherspoon","James Pantemis","Nathan Shafir"],
  CRO: ["Luka Modrić","Ivan Perišić","Mateo Kovačić","Marcelo Brozović","Dejan Lovren","Domagoj Vida","Ante Rebić","Andrej Kramarić","Mario Pašalić","Ivan Rakitić","Šime Vrsaljko","Josip Šutalo","Bruno Petković","Borna Sosa","Dominik Livaković","Josip Juranović","Joško Gvardiol","Martin Erlić","Mislav Oršić","Nikola Vlašić","Ivan Zúñiga","Lovro Majer","Petar Sucic"],
  DEN: ["Christian Eriksen","Kasper Schmeichel","Simon Kjær","Pierre-Emile Höjbjerg","Andreas Christensen","Jannik Vestergaard","Joakim Mæhle","Thomas Delaney","Martin Braithwaite","Yussuf Poulsen","Robert Skov","Daniel Wass","Rasmus Nissen Kristensen","Mikkel Damsgaard","Andreas Skov Olsen","Victor Kristiansen","Jonas Wind","Mohammed Daramy","Marcus Ingvartsen","Jacob Bruun Larsen","Lukas Lerager","Jesper Lindström","Mads Hermansen"],
  SUI: ["Granit Xhaka","Xherdan Shaqiri","Breel Embolo","Yann Sommer","Manuel Akanji","Nico Elvedi","Remo Freuler","Steven Zuber","Ricardo Rodriguez","Michel Aebischer","Silvan Widmer","Fabian Schär","Djibril Sow","Renato Steffen","Dan Ndoye","Ruben Vargas","Andi Zeqiri","Ardon Jashari","Kwadwo Duah","Christian Fassnacht","Zeki Amdouni","Jonas Omlin","Sandro Lauper"],
  AUT: ["Marcel Sabitzer","David Alaba","Marko Arnautovic","Stefan Lainer","Aleksandar Dragovic","Florian Grillitsch","Michael Gregoritsch","Stefan Posch","Andreas Ulmer","Konrad Laimer","Christoph Baumgartner","Nicolas Seiwald","Maximilian Wöber","Patrick Wimmer","Gernot Trauner","Florian Kainz","Adrian Grbic","Sasa Kalajdzic","Kevin Danso","Alexander Prass","Romano Schmid","Patrick Pentz","Lukas Mühl"],
  URU: ["Luis Suárez","Edinson Cavani","Diego Godín","Ronald Araújo","Rodrigo Bentancur","Federico Valverde","Darwin Núñez","Sebastián Coates","José María Giménez","Martín Cáceres","Nicolás de la Cruz","Facundo Torres","Maxi Gómez","Agustín Canobbio","Mathías Olivera","Facundo Pellistri","Fernando Muslera","Guillermo Varela","José Luis Rodríguez","Gastón Pereiro","Giorgian De Arrascaeta","Manuel Ugarte","Sebastián Boselli"],
  COL: ["James Rodríguez","Falcao","Radamel Falcao","Davinson Sánchez","Yerry Mina","Juan Guillermo Cuadrado","Wilmar Barrios","Mateus Uribe","Luis Díaz","Rafael Santos Borré","Jhon Cordoba","Juan Fernando Quintero","Edwin Cardona","Duvan Zapata","Jefferson Lerma","Gustavo Puerta","Richard Ríos","Jorge Carrascal","Daniel Muñoz","Sebastián Villa","Jhon Jáder Durán","Camilo Vargas","Carlos Cuesta"],
  MAR: ["Hakim Ziyech","Achraf Hakimi","Youssef En-Nesyri","Sofiane Boufal","Romain Saïss","Nayef Aguerd","Yassine Bounou","Noussair Mazraoui","Azzedine Ounahi","Selim Amallah","Zakaria Aboukhlal","Sofyan Amrabat","Jawad El Yamiq","Achraf Dari","Bilal El Khannouss","Adam Masina","Youssef Aït Bennasser","Ibrahim Cissoko","Amir Richardson","Mohammed Aziz Benali","Yahia Attiat-Allah","Munir El Haddadi","Ilias Chair"],
  SEN: ["Sadio Mané","Kalidou Koulibaly","Édouard Mendy","Ismaïla Sarr","Idrissa Gueye","Cheikhou Kouyaté","Boulaye Dia","Famara Diédhiou","Pape Gueye","Cheikh Ahmadou Tidiane Sabaly","Fodé Ballo-Touré","Saliou Ciss","Alfred Gomis","Nampalys Mendy","Nicolas Jackson","Lamine Camara","Pape Matar Sarr","Krepin Diatta","Habib Diallo","Abdou Diallo","Formose Mendy","Moussa Niakhaté","Iliman Ndiaye"],
  NGA: ["Victor Osimhen","Kelechi Iheanacho","Alex Iwobi","Wilfred Ndidi","William Troost-Ekong","Semi Ajayi","Ola Aina","Ahmed Musa","Moses Simon","Emmanuel Dennis","Samuel Chukwueze","Calvin Bassey","Cyriel Dessers","Ademola Lookman","Frank Onyeka","Terem Moffi","Joe Aribo","Kenneth Omeruo","Zaidu Sanusi","Bright Osayi-Samuel","Stanley Nwabali","Maduka Okoye","Taiwo Awoniyi"],
  EGY: ["Mohamed Salah","Zeki Alaa","Omar Marmoush","Ahmed El-Shenawy","Mohamed El-Shenawy","Ahmed Hegazy","Mahmoud Trezeguet","Amr El Sulaya","Ayman Ashraf","Hamdi Fathi","Ramadan Sobhi","Mostafa Mohamed","Mohamed Hany","Ahmed Sayed Zizo","Karim El Debes","Mohamed Hamdy","Tarek Hamed","Ayman Ashraf","Marwan Hamdy","Ahmed Fatouh","Mohamed Sherif","Salah Mohsen","Sherif Ekramy"],
  JPN: ["Takumi Minamino","Ritsu Doan","Daichi Kamada","Wataru Endo","Hidemasa Morita","Kaoru Mitoma","Maya Yoshida","Hiroki Sakai","Eiji Kawashima","Shuichi Gonda","Ko Itakura","Shogo Taniguchi","Gaku Shibasaki","Junya Ito","Ayase Ueda","Yuya Osako","Hiroki Ito","Yuta Nakayama","Takehiro Tomiyasu","Keito Nakamura","Ao Tanaka","Takefusa Kubo","Zion Suzuki"],
  KOR: ["Son Heung-min","Kim Min-jae","Lee Jae-sung","Hwang Hee-chan","Kwon Chang-hoon","Cho Gue-sung","Hwang In-beom","Kim Young-gwon","Kim Jin-su","Na Sang-ho","Oh Hyeon-gyu","Lee Kang-in","Jung Woo-young","Paik Seung-ho","Kim Moon-hwan","Kim Tae-hwan","Go Seung-beom","Jo Hyeon-woo","Kim Seung-gyu","Seol Young-woo","Song Min-kyu","Jeong Seung-won","Bae Jun-ho"],
  ECU: ["Enner Valencia","Moisés Caicedo","Ángelo Preciado","Pervis Estupiñán","Piero Hincapié","Gonzalo Plata","Romario Ibarra","Jeremy Sarmiento","José Cifuentes","Michael Estrada","Félix Torres","Diego Palacios","Xavier Arreaga","Jordi Caicedo","Juan Izquierdo","Kenny Lissón","Kevin Rodríguez","Hernán Galíndez","Alexander Domínguez","Williams Pacho","Roberto Arboleda","Jhegson Méndez","Alan Minda"],
  AUS: ["Mathew Ryan","Harry Souttar","Miloš Degenek","Aziz Behich","Bailey Wright","Aaron Mooy","Thomas Rogic","Jackson Irvine","Martin Boyle","Mitchell Duke","Adam Taggart","Awer Mabil","Craig Goodwin","Jamie Maclaren","Jason Cummings","Riley McGree","Marco Tilio","Fran Karacic","Nathaniel Atkinson","Joel King","Gianni Stensness","Brandon Borrello","Lachie Wales"],
  IRN: ["Mehdi Taremi","Sardar Azmoun","Alireza Jahanbakhsh","Ehsan Hajsafi","Majid Hosseini","Shojae Khalilzadeh","Morteza Pouraliganji","Ali Gholizadeh","Omid Noorafkan","Karim Ansarifard","Milad Mohammadi","Saman Ghoddos","Ramin Rezaeian","Hossein Kanaanizadegan","Abolhassan Faraji","Saeid Ezatolahi","Ahmad Noorollahi","Ali Karimi","Amirhossein Hosseini","Rouzbeh Cheshmi","Alireza Beiranvand","Hossein Hosseini","Ali Golizadeh"],
  SAU: ["Saleh Al-Shehri","Mohammad Al-Owais","Yasser Al-Shahrani","Ali Al-Bulayhi","Abdulelah Al-Malki","Mohamed Kanno","Hattan Bahbir","Salman Al-Faraj","Firas Al-Buraikan","Abdullah Al-Hamdan","Saud Abdulhamid","Ali Al-Hassan","Ahmed Al-Ghamdi","Nawaf Al-Aqidi","Sultan Al-Ghannam","Ali Al-Nemer","Hassan Al-Tambakti","Abdullah Madu","Abdullah Otayf","Jang Hyun-soo","Khalid Al-Ghannam","Yousef Al-Arabi","Mohammed Al-Buraik"],
  QAT: ["Akram Afif","Almoez Ali","Hassan Al-Haydos","Bassam Al-Rawi","Boualem Khoukhi","Abdelkarim Hassan","Assim Madibo","Karim Boudiaf","Pedro Miguel","Ismaeel Mohammad","Salem Al-Hajri","Musab Kheder","Tarek Salman","Jassem Gaber","Mohamed Waad","Khoukhi Bualem","Yusuf Abdurisag","Tariq Salman","Abdullah Al-Ahrak","Mohammed Waad","Homam Ahmed","Meshaal Barsham","Saad Al-Sheeb"],
  GHA: ["Thomas Partey","Jordan Ayew","André Ayew","Mohammed Salisu","Alexander Djiku","Daniel Amartey","Inaki Williams","Osman Bukari","Joseph Paintsil","Emmanuel Gyasi","Abdul Fatawu Issahaku","Mohammed Kudus","Salis Abdul Samed","Antoine Semenyo","Tariq Lamptey","Edwin Gyasi","Lawrence Ati-Zigi","Joe Wollacott","Joseph Aidoo","Gideon Mensah","Ibrahim Dramani","Benjamin Asare","Jonathan Mensah"],
  NZL: ["Chris Wood","Liberato Cacace","Tommy Smith","Bill Tuilagi","Ryan Thomas","Stefan Marinovic","Joe Bell","Tim Payne","Callum McCowatt","Bozhidar Kraev","Sarpreet Singh","Elijah Just","Michael Boxall","Matt Garbett","Alex Greive","Myer Bevan","Marko Stamenic","Louis Fenton","Clayton Lewis","Callan Elliot","Nando Pijnaker","Max Mata","Logan Rogerson"],
};

const POSITIONS = ["GK","CB","LB","RB","CDM","CM","CAM","LW","RW","ST","SS"];

function getPosition(index: number): string {
  if (index === 0) return "ST";
  const pos = POSITIONS[index % POSITIONS.length];
  return pos;
}

function getRarity(playerIndex: number, tier: 1 | 2 | 3): Rarity {
  if (playerIndex === 0 && tier === 1) return "LEGENDARY";
  if (playerIndex === 0 && tier === 2) return "EPIC";
  if (playerIndex === 0 && tier === 3) return "RARE";
  if (playerIndex <= 3 && tier === 1) return "EPIC";
  if (playerIndex <= 3 && tier === 2) return "RARE";
  if (playerIndex <= 6) return "RARE";
  if (playerIndex <= 12) return "UNCOMMON";
  return "COMMON";
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// ── PACKS ─────────────────────────────────────────────────────────────────────

const PACKS = [
  { slug: "free-daily",    name: "Daily Free Pack",   type: PackType.FREE_DAILY,    cardCount: 3, guaranteedMin: Rarity.COMMON,    priceUsd: null,  priceCoins: null  },
  { slug: "welcome",       name: "Welcome Pack",      type: PackType.WELCOME,       cardCount: 5, guaranteedMin: Rarity.RARE,      priceUsd: null,  priceCoins: null  },
  { slug: "common",        name: "Common Pack",       type: PackType.COMMON,        cardCount: 5, guaranteedMin: Rarity.COMMON,    priceUsd: 0.99,  priceCoins: 100   },
  { slug: "premium",       name: "Premium Pack",      type: PackType.PREMIUM,       cardCount: 5, guaranteedMin: Rarity.RARE,      priceUsd: 2.99,  priceCoins: 300   },
  { slug: "gold",          name: "Gold Pack",         type: PackType.GOLD,          cardCount: 5, guaranteedMin: Rarity.EPIC,      priceUsd: 4.99,  priceCoins: 500   },
  { slug: "legendary",     name: "Legendary Pack",    type: PackType.LEGENDARY,     cardCount: 5, guaranteedMin: Rarity.LEGENDARY, priceUsd: 9.99,  priceCoins: 1000  },
  { slug: "team-special",  name: "Team Special Pack", type: PackType.TEAM_SPECIAL,  cardCount: 6, guaranteedMin: Rarity.RARE,      priceUsd: 3.99,  priceCoins: 400   },
  { slug: "match-day",     name: "Match Day Pack",    type: PackType.MATCH_DAY,     cardCount: 4, guaranteedMin: Rarity.UNCOMMON,  priceUsd: 1.99,  priceCoins: 200   },
];

// ── BADGES ────────────────────────────────────────────────────────────────────

const BADGES = [
  { slug: "first-pack",      name: "First Pack",       icon: "🎁", description: "Open your first sticker pack",           rarity: BadgeRarity.BRONZE,    criteria: { action: "open_pack", count: 1 } },
  { slug: "collector-50",    name: "Collector",        icon: "📎", description: "Collect 50 stickers",                   rarity: BadgeRarity.BRONZE,    criteria: { action: "collect", count: 50 } },
  { slug: "collector-200",   name: "Avid Collector",   icon: "🗂️", description: "Collect 200 stickers",                  rarity: BadgeRarity.SILVER,    criteria: { action: "collect", count: 200 } },
  { slug: "album-50pct",     name: "Half Album",       icon: "📖", description: "Complete 50% of your album",            rarity: BadgeRarity.SILVER,    criteria: { action: "album_pct", pct: 50 } },
  { slug: "album-100pct",    name: "Album Champion",   icon: "🏆", description: "Complete 100% of your album",           rarity: BadgeRarity.LEGENDARY, criteria: { action: "album_pct", pct: 100 } },
  { slug: "recruiter",       name: "Recruiter",        icon: "👥", description: "Refer 5 friends to STAMPEDE",           rarity: BadgeRarity.GOLD,      criteria: { action: "referral", count: 5 } },
  { slug: "streak-30",       name: "Streak Master",    icon: "🔥", description: "Maintain a 30-day login streak",        rarity: BadgeRarity.GOLD,      criteria: { action: "streak", days: 30 } },
  { slug: "market-10",       name: "Market Player",    icon: "💰", description: "Complete 10 marketplace transactions",  rarity: BadgeRarity.SILVER,    criteria: { action: "trade", count: 10 } },
  { slug: "event-5",         name: "Event Goer",       icon: "📅", description: "Join 5 fan events",                     rarity: BadgeRarity.BRONZE,    criteria: { action: "event_join", count: 5 } },
  { slug: "ai-fan-20",       name: "AI Fan",           icon: "🤖", description: "Have 20 conversations with Fan Coach",  rarity: BadgeRarity.SILVER,    criteria: { action: "coach_chat", count: 20 } },
  { slug: "legend-hunter",   name: "Legend Hunter",    icon: "⭐", description: "Collect a Legendary sticker",            rarity: BadgeRarity.GOLD,      criteria: { action: "collect_rarity", rarity: "LEGENDARY" } },
  { slug: "early-adopter",   name: "Early Adopter",    icon: "🌟", description: "Joined STAMPEDE during Beta",           rarity: BadgeRarity.PLATINUM,  criteria: { action: "join_before", date: "2026-06-11" } },
  { slug: "world-cup-ready", name: "World Cup Ready",  icon: "⚽", description: "Complete onboarding before kickoff",    rarity: BadgeRarity.BRONZE,    criteria: { action: "onboarding_done" } },
  { slug: "pro-subscriber",  name: "PRO Subscriber",   icon: "⚡", description: "Became a PRO member",                  rarity: BadgeRarity.GOLD,      criteria: { action: "upgrade_pro" } },
  { slug: "top-100",         name: "Top 100",          icon: "🎯", description: "Reach top 100 in global ranking",       rarity: BadgeRarity.PLATINUM,  criteria: { action: "rank", position: 100 } },
];

// ── MISSIONS ──────────────────────────────────────────────────────────────────

const MISSIONS = [
  { slug: "open-daily-pack",   title: "Pack Opener",       description: "Open your free daily pack",                type: MissionType.DAILY,     xpReward: 50,  criteria: { action: "open_pack",    count: 1 },  isRecurring: true,  resetPeriod: "daily"  },
  { slug: "place-5-stickers",  title: "Sticker Spree",     description: "Place 5 stickers in your album",           type: MissionType.DAILY,     xpReward: 80,  criteria: { action: "place",        count: 5 },  isRecurring: true,  resetPeriod: "daily"  },
  { slug: "daily-checkin",     title: "Daily Check-in",    description: "Log in and keep your streak alive",        type: MissionType.DAILY,     xpReward: 25,  criteria: { action: "login",        count: 1 },  isRecurring: true,  resetPeriod: "daily"  },
  { slug: "join-event",        title: "Fan Meetup",        description: "Join or create a fan event today",         type: MissionType.DAILY,     xpReward: 60,  criteria: { action: "event_join",   count: 1 },  isRecurring: true,  resetPeriod: "daily"  },
  { slug: "coach-question",    title: "Ask Your Coach",    description: "Ask the AI Fan Coach a question",          type: MissionType.DAILY,     xpReward: 30,  criteria: { action: "coach_chat",   count: 1 },  isRecurring: true,  resetPeriod: "daily"  },
  { slug: "visit-market",      title: "Market Watch",      description: "Browse the marketplace",                   type: MissionType.DAILY,     xpReward: 20,  criteria: { action: "market_visit", count: 1 },  isRecurring: true,  resetPeriod: "daily"  },
  { slug: "invite-friend",     title: "Bring a Fan",       description: "Invite a friend with your referral link",  type: MissionType.WEEKLY,    xpReward: 100, criteria: { action: "referral",     count: 1 },  isRecurring: true,  resetPeriod: "weekly" },
  { slug: "buy-sticker",       title: "Marketplace Buyer", description: "Buy a sticker from the marketplace",       type: MissionType.WEEKLY,    xpReward: 50,  criteria: { action: "trade_buy",    count: 1 },  isRecurring: true,  resetPeriod: "weekly" },
  { slug: "sell-sticker",      title: "First Listing",     description: "List a sticker for sale",                  type: MissionType.WEEKLY,    xpReward: 40,  criteria: { action: "trade_sell",   count: 1 },  isRecurring: true,  resetPeriod: "weekly" },
  { slug: "collect-rare",      title: "Rare Find",         description: "Collect a Rare or higher sticker",         type: MissionType.WEEKLY,    xpReward: 120, criteria: { action: "collect_rarity", rarity: "RARE" }, isRecurring: true, resetPeriod: "weekly" },
  { slug: "streak-7",          title: "One Week Strong",   description: "Maintain a 7-day login streak",            type: MissionType.WEEKLY,    xpReward: 150, criteria: { action: "streak",       days: 7 },   isRecurring: false, resetPeriod: null     },
  { slug: "album-5pct",        title: "Album Progress",    description: "Collect enough stickers to reach 5%",      type: MissionType.MILESTONE, xpReward: 200, criteria: { action: "album_pct",    pct: 5 },    isRecurring: false, resetPeriod: null     },
];

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting STAMPEDE seed...\n");

  // ── Stickers ──────────────────────────────────────────────────────────────
  console.log("⚽  Seeding stickers (32 teams × 25 each)...");
  let stickerNum = 1;

  for (const team of TEAMS) {
    const players = TEAM_PLAYERS[team.code] ?? [];

    // Crest sticker
    await db.sticker.upsert({
      where:  { number: stickerNum },
      update: {},
      create: {
        number:   stickerNum++,
        slug:     `${team.code.toLowerCase()}-crest-wc2026`,
        name:     `${team.name} Crest`,
        team:     team.code,
        teamFlag: team.flag,
        position: "CREST",
        category: "crest",
        rarity:   team.tier === 1 ? Rarity.RARE : Rarity.UNCOMMON,
        xpValue:  team.tier === 1 ? 20 : 15,
      },
    });

    // Coach sticker
    await db.sticker.upsert({
      where:  { number: stickerNum },
      update: {},
      create: {
        number:   stickerNum++,
        slug:     `${team.code.toLowerCase()}-coach-wc2026`,
        name:     `${team.name} Coach`,
        team:     team.code,
        teamFlag: team.flag,
        position: "COACH",
        category: "coach",
        rarity:   Rarity.UNCOMMON,
        xpValue:  15,
      },
    });

    // Players (23)
    for (let i = 0; i < 23; i++) {
      const playerName = players[i] ?? `Player ${i + 1} (${team.name})`;
      const rarity = getRarity(i, team.tier);
      const xpValues: Record<Rarity, number> = {
        COMMON: 10, UNCOMMON: 15, RARE: 25, EPIC: 50, LEGENDARY: 100
      };
      await db.sticker.upsert({
        where:  { number: stickerNum },
        update: {},
        create: {
          number:   stickerNum++,
          slug:     `${slugify(playerName)}-${team.code.toLowerCase()}-wc2026-${i}`,
          name:     playerName,
          team:     team.code,
          teamFlag: team.flag,
          position: getPosition(i),
          category: "player",
          rarity,
          xpValue:  xpValues[rarity],
        },
      });
    }
  }
  console.log(`   ✓ ${stickerNum - 1} stickers created\n`);

  // ── Packs ──────────────────────────────────────────────────────────────────
  console.log("📦  Seeding pack definitions...");
  for (const pack of PACKS) {
    await db.pack.upsert({
      where:  { slug: pack.slug },
      update: {},
      create: {
        slug:          pack.slug,
        name:          pack.name,
        type:          pack.type,
        cardCount:     pack.cardCount,
        guaranteedMin: pack.guaranteedMin,
        priceUsd:      pack.priceUsd !== null ? pack.priceUsd : undefined,
        priceCoins:    pack.priceCoins !== null ? pack.priceCoins : undefined,
        rarity:        pack.guaranteedMin,
      },
    });
  }
  console.log(`   ✓ ${PACKS.length} pack types created\n`);

  // ── Badges ─────────────────────────────────────────────────────────────────
  console.log("🏅  Seeding badge definitions...");
  for (const badge of BADGES) {
    await db.badge.upsert({
      where:  { slug: badge.slug },
      update: {},
      create: {
        slug:        badge.slug,
        name:        badge.name,
        icon:        badge.icon,
        description: badge.description,
        rarity:      badge.rarity,
        criteria:    badge.criteria,
      },
    });
  }
  console.log(`   ✓ ${BADGES.length} badges created\n`);

  // ── Missions ───────────────────────────────────────────────────────────────
  console.log("🎯  Seeding mission definitions...");
  for (const [i, mission] of MISSIONS.entries()) {
    await db.mission.upsert({
      where:  { slug: mission.slug },
      update: {},
      create: {
        slug:        mission.slug,
        title:       mission.title,
        description: mission.description,
        type:        mission.type,
        xpReward:    mission.xpReward,
        criteria:    mission.criteria,
        isRecurring: mission.isRecurring,
        resetPeriod: mission.resetPeriod ?? undefined,
        sortOrder:   i,
      },
    });
  }
  console.log(`   ✓ ${MISSIONS.length} missions created\n`);

  // ── Summary ────────────────────────────────────────────────────────────────
  const [stickers, packs, badges, missions] = await Promise.all([
    db.sticker.count(),
    db.pack.count(),
    db.badge.count(),
    db.mission.count(),
  ]);

  console.log("✅  Seed complete!\n");
  console.log(`   Stickers:  ${stickers}`);
  console.log(`   Packs:     ${packs}`);
  console.log(`   Badges:    ${badges}`);
  console.log(`   Missions:  ${missions}`);
  console.log("\n🚀  Run: npm run dev\n");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => db.$disconnect());
