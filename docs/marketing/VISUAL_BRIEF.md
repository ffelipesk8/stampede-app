# Brief de dirección visual — KARTAZO

**Para:** diseñador freelance senior (recomiendo presupuesto $1500-$3000 USD por todo el paquete)
**Plazo sugerido:** 10-14 días desde aceptación
**Producto:** kartazo.com — plataforma fan del Mundial 2026
**Tono:** premium-deportivo, urgente, hincha, NO corporativo, NO FIFA-oficial

---

## Contexto del proyecto en 3 párrafos

KARTAZO es una plataforma web (Next.js, deploy en producción) donde fans del Mundial 2026 coleccionan cartas digitales de jugadores, estadios y ciudades anfitrionas. El producto ya está construido y funcional: hay sobres diarios con rachas, marketplace, eventos creados por fans, ranking global, y cartas sociales (foto del usuario con un jugador convertida en carta). El Mundial empieza el 11 de junio de 2026 — quedan 4-5 semanas para el kickoff.

La marca tiene una identidad visual base sólida que el dev ya implementó (paleta, fuentes, gradiente principal), pero necesita un paso al siguiente nivel en assets clave: ilustración propia de jugadores (para reemplazar fotos de Wikipedia que tienen riesgo legal y se ven amateur), sistema de cartas premium por rareza, OG image potente, kit para redes sociales, y refinamiento del logo.

KARTAZO NO está afiliado con FIFA. Eso es por diseño legal — no podemos usar marcas FIFA, escudos oficiales de selecciones, ni fotos reales de jugadores con derechos restrictivos. El diseñador tiene que crear visuales que comuniquen "Mundial 2026" sin usar IP de FIFA. Esto es restricción y oportunidad: nos obliga a tener look único.

## Brand kit existente (NO inventar, usar lo que ya está)

### Paleta principal

| Color | Hex | Uso |
|---|---|---|
| Red | `#E8003D` | Acento principal, urgencia, CTAs |
| Orange | `#FF5E00` | Highlights, "K" del logo |
| Gold | `#FFB800` | Premium, rareza Legendary, "R" del logo |
| Green | `#00D97E` | Éxito, rareza Rare |
| Blue | `#4A6FFF` | Info, rareza Uncommon |
| Purple | `#9B59B6` o `#A855F7` | Rareza Epic |
| BG dark | `#07070F` | Fondo principal |
| Text 1 | `#F2F2FF` | Texto principal |
| Text 2 | `#9090B8` | Texto secundario, rareza Common |
| Text 3 | `#5A5A80` | Texto deshabilitado |

### Gradiente firma (fire-gradient)

`linear-gradient(135deg, #E8003D 0%, #FF5E00 50%, #FFB800 100%)`

Este gradiente es la firma visual de la marca. Aparece en CTAs, headlines clave, hero. Mantenerlo y construir alrededor.

### Tipografía

- **Display/Hero:** Barlow Condensed (`font-condensed`) — black weight (900) para titulares.
- **Display secundaria:** Space Grotesk (`font-display`) — semibold/bold para subtítulos y UI.
- **Body:** Inter (`font-body`) — regular para texto largo.

Todas son Google Fonts ya integradas. NO proponer cambio de fuentes a menos que haya motivo fuerte.

### Logo actual

El logotipo es "KARTAZO" en Barlow Condensed black con las primeras 3 letras coloreadas (K=red, A=orange, R=gold) y "TAZO" en blanco. Funciona — necesita refinamiento, no rediseño:

- Versión vertical (para favicons cuadrados, perfiles redes sociales)
- Versión con isotipo (un símbolo solo, sin texto, para iconos pequeños)
- Versión mono blanco y mono negro
- Versión sobre fire-gradient

## Sistema de rareza de cartas

| Rareza | Color | Sensación | Frecuencia en packs |
|---|---|---|---|
| Common | `#9090B8` | Plantilla base | Más común |
| Uncommon | `#4A6FFF` | Jugadores clave | Frecuente |
| Rare | `#00D97E` | Estrellas | Eventual |
| Epic | `#A855F7` | Clase mundial | Raro |
| Legendary | `#FFB800` | Nivel GOAT (Messi, Mbappé) | Una en un millón |

Esto se ve hoy con borders simples. Necesita upgrade a tratamiento premium tipo cartas de fútbol coleccionables modernas (Topps Bunt, Panini Adrenalyn XL, FIFA Ultimate Team) pero con identidad propia.

## Entregables esperados (priorizados)

### Tier 1 — CRÍTICO antes del Mundial

**1. Sistema de cartas premium (player cards)**
- Diseñar 5 templates de carta (uno por rareza)
- Cada template incluye: marco/border por rareza, badge de rareza, área para "foto" (que será ilustración estilizada), bandera de país, nombre de jugador, posición, stats opcionales.
- Estilo: cards aspiracionales tipo "FIFA Ultimate Team Icon" pero con identidad KARTAZO (fire-gradient en Legendary, glow effects, materiales premium tipo holograma para Epic+).
- Exportar como componentes SVG o PSD/Figma editable.

**2. Ilustración de jugadores top (15-20 jugadores)**
- Reemplazar fotos de Wikipedia con ilustraciones estilizadas originales.
- Estilo recomendado: vector flat-pop o low-poly geométrico, o silhouette+detail (estilo "Tachiyaba" o ilustraciones de equipos como Inter o PSG en sus posts).
- Jugadores prioritarios: Messi (ARG), Mbappé (FRA), Bellingham (ENG), Vinícius Jr (BRA), Yamal (ESP), Haaland (NOR), Kane (ENG), Pedri (ESP), De Bruyne (BEL), Salah (EGY), Cristiano (POR), Modrić (CRO), Son (KOR), Mahrez (ALG), Lautaro (ARG).
- IMPORTANTE: los jugadores deben ser reconocibles pero estilizados (no fotos retocadas). Esto da defensa fair-use mucho más sólida.

**3. Ilustraciones de estadios y ciudades (10-16)**
- Mismo estilo que jugadores, aplicado a estadios anfitriones (MetLife, Azteca, BMO Field, etc) y siluetas de ciudades (NYC, CDMX, Toronto, LA, etc).
- Ya hay fotos en `/images/stickers/stadiums/` y `/cities/` — usar como referencia visual, pero entregar ilustraciones nuevas.

**4. OG Image (`/og-image.jpg`)**
- 1200×630 px.
- Hoy es genérico. Reemplazar por uno potente: 3-4 cartas legendarias flotando sobre fondo fire-gradient, logo KARTAZO, claim "El álbum del Mundial 2026" en español + small "World Cup 2026 Album" en inglés.
- Versión separada para Twitter card (1200×675) si se siente que el corte no funciona.

### Tier 2 — IMPORTANTE para marketing

**5. Kit redes sociales**
- Plantillas Figma/Canva editables para:
  - Stories Instagram (1080×1920) — 3 templates: card showcase, countdown, evento.
  - Posts Instagram cuadrados (1080×1080) — 3 templates: nuevo drop, anuncio, testimonial.
  - Reels/TikTok cover (1080×1920) — 2 templates.
  - X/Twitter banner (1500×500) — 1 template.
- Todas deben usar la fire-gradient y tipografía Barlow Condensed.

**6. Logo expansion**
- Versión vertical
- Isotipo (símbolo solo)
- Versión mono blanco
- Versión mono negro
- Favicon (16, 32, 192, 512)
- Apple touch icon (180×180)

### Tier 3 — DESEABLE pero no urgente

**7. Sistema de packs (visual del sobre)**
- Los sobres diarios necesitan tener identidad visual propia. Hoy son botones, podrían ser sobres reales animados.
- Diseñar 3 versiones: Free Daily Pack (más sobrio), Premium Pack (vibrante), Legendary Pack (épico).

**8. Animaciones key**
- Sugerir 2-3 micro-animaciones para momentos clave: apertura de pack, descubrimiento de carta legendaria, racha completa.
- Pueden ser referencias en video o Lottie files si el diseñador es capaz.

## Restricciones legales que el diseñador DEBE respetar

1. **NO usar logos, escudos o marcas oficiales de FIFA** (FIFA logo, World Cup trophy oficial, marca "FIFA World Cup", logo del torneo 2026).
2. **NO usar escudos oficiales de federaciones** (escudo Argentina AFA, escudo Brasil CBF, etc). Usar la bandera del país en su lugar.
3. **NO usar uniformes/jerseys oficiales con sponsors visibles** (Adidas en Argentina, Nike en Brasil, etc). Si se sugieren los colores del equipo, abstraer.
4. **NO usar fotos reales de jugadores como base directa** — siempre ilustración nueva donde la fuente fotográfica solo sea referencia anatómica.
5. **NO incluir la palabra "official" / "oficial"** en ningún copy visual.

## Referencias visuales que se pueden tomar como inspiración

- **Topps Bunt** (digital trading cards) — para tratamiento de cards premium con glow y holograma.
- **Panini Adrenalyn XL** — para sistema de stats y rareza en cartas físicas.
- **FIFA Ultimate Team Icons** — para cómo se tratan jugadores legendarios.
- **Sorare** — para look digital limpio + identidad gaming.
- **Inter Miami / PSG / Manchester City branding** — para el lado deportivo premium moderno.
- **Linear / Vercel** — para el rigor visual minimalista del dashboard.
- **Spotify Wrapped** — para el estilo de stories anuales con gradientes fuertes.

## Tono y voz de marca para el diseño

- Hincha, no corporativo.
- Energético, urgente (hay 31 días al Mundial).
- LATAM-first pero global. El Mundial está en USA/MEX/CAN — celebrar las tres culturas anfitrionas.
- Premium pero accesible — no debe verse caro/elitista, debe verse "para todos los hinchas".
- Moderno sin ser frío. Tiene que sentirse como fútbol, no como software.
- Una palabra que captura el tono: **fiebre**.

## Formato de entrega

- Figma file con todos los componentes y variantes (no PSD).
- Assets exportados en SVG (preferido) o PNG @2x donde no se pueda SVG.
- Manual de marca corto (5-10 páginas PDF) que documente paleta, tipografía, uso del logo, sistema de cartas, do's & don'ts.
- Carpeta organizada por entregable.

## Proceso recomendado

1. **Día 1-2:** diseñador presenta concepto visual de UN solo template de carta (cualquier rareza) para alinear dirección antes de producir todos.
2. **Día 3-5:** una vez aprobado el concepto, produce los 5 templates de rareza completos + 5 ilustraciones de jugadores top.
3. **Día 6-9:** completa el resto de ilustraciones (jugadores, estadios, ciudades) + OG image.
4. **Día 10-12:** kit redes sociales + logo expansion.
5. **Día 13-14:** ajustes finales + entrega.

Pagos sugeridos: 30% al inicio, 30% en hito día 5, 40% en entrega final.

## Lo que NO debería entregar el diseñador

- Rediseño completo del landing — eso ya está y funciona.
- Nueva paleta de colores — la actual está calibrada con el código.
- Cambio de tipografía sin justificación fuerte.
- Mockups de funcionalidades nuevas — su trabajo es visual, no producto.
- Animaciones complejas que requieran código — solo specs visuales.

---

**Notas finales para Felo:** este brief asume diseñador con experiencia en sports/gaming/branding deportivo. Si vas a contratar por Upwork/Toptal/local, filtra por portfolios con cartas coleccionables, branding deportivo o gaming. Evita generalistas. El precio bajo en este caso = riesgo alto de tener que rehacer.
