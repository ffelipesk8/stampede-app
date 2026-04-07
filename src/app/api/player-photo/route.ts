import { NextRequest, NextResponse } from "next/server";

// ── 120+ jugadores con URL directa verificada ─────────────────────────────────
const PHOTO_OVERRIDES: Record<string, string> = {
  // ── Argentina ─────────────────────────────────────────────────────────────
  "Lionel Messi":         "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/440px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
  "Ángel Di María":       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Angel_Di_Maria_2018.jpg/440px-Angel_Di_Maria_2018.jpg",
  "Lautaro Martínez":     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/20190605_FIFA_U-20_World_Cup_Poland_vs_Argentina_Patrik_Holo_MG_0882.jpg/440px-20190605_FIFA_U-20_World_Cup_Poland_vs_Argentina_Patrik_Holo_MG_0882.jpg",
  "Rodrigo De Paul":      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/20191119_Friendly_Austria_vs_North_Macedonia_Rodrigo_De_Paul_850_3521.jpg/440px-20191119_Friendly_Austria_vs_North_Macedonia_Rodrigo_De_Paul_850_3521.jpg",
  "Enzo Fernández":       "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Enzo_Fernandez_2022_%28cropped%29.jpg/440px-Enzo_Fernandez_2022_%28cropped%29.jpg",
  "Julián Álvarez":       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Julian_Alvarez_2022_%28cropped%29.jpg/440px-Julian_Alvarez_2022_%28cropped%29.jpg",
  "Emiliano Martínez":    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Emiliano_Martinez_2022_%28cropped%29.jpg/440px-Emiliano_Martinez_2022_%28cropped%29.jpg",
  "Nicolás Otamendi":     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Nicolas_Otamendi_2022_%28cropped%29.jpg/440px-Nicolas_Otamendi_2022_%28cropped%29.jpg",
  "Marcos Acuña":         "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Marcos_Acuna_2019.jpg/440px-Marcos_Acuna_2019.jpg",
  // ── Brazil ────────────────────────────────────────────────────────────────
  "Vinícius Jr":          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Vinicius_Junior_vs._Borussia_Dortmund_2024_%28cropped%29.jpg/440px-Vinicius_Junior_vs._Borussia_Dortmund_2024_%28cropped%29.jpg",
  "Neymar Jr":            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Neymar_-_2018_FIFA_World_Cup.jpg/440px-Neymar_-_2018_FIFA_World_Cup.jpg",
  "Rodrygo":              "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/20231106_Rodrygo_vs_Rayo_Vallecano_%28cropped%29.jpg/440px-20231106_Rodrygo_vs_Rayo_Vallecano_%28cropped%29.jpg",
  "Raphinha":             "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/20220726_Raphinha_Leeds_v_Liverpool_%28cropped%29.jpg/440px-20220726_Raphinha_Leeds_v_Liverpool_%28cropped%29.jpg",
  "Casemiro":             "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Casemiro_2022_%28cropped%29.jpg/440px-Casemiro_2022_%28cropped%29.jpg",
  "Alisson Becker":       "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Alisson_Becker_2019_%28cropped%29.jpg/440px-Alisson_Becker_2019_%28cropped%29.jpg",
  "Marquinhos":           "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Marquinhos_2022_%28cropped%29.jpg/440px-Marquinhos_2022_%28cropped%29.jpg",
  "Thiago Silva":         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Thiago_Silva_2019_%28cropped%29.jpg/440px-Thiago_Silva_2019_%28cropped%29.jpg",
  "Endrick":              "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Endrick_2024_%28cropped%29.jpg/440px-Endrick_2024_%28cropped%29.jpg",
  "Lucas Paquetá":        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Lucas_Paqueta_2022_%28cropped%29.jpg/440px-Lucas_Paqueta_2022_%28cropped%29.jpg",
  // ── France ────────────────────────────────────────────────────────────────
  "Kylian Mbappé":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93110_%28cropped%29.jpg/440px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93110_%28cropped%29.jpg",
  "Antoine Griezmann":    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Antoine_Griezmann_2018.jpg/440px-Antoine_Griezmann_2018.jpg",
  "Ousmane Dembélé":      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ousmane_Dembele_at_the_2018_FIFA_World_Cup.jpg/440px-Ousmane_Dembele_at_the_2018_FIFA_World_Cup.jpg",
  "Aurélien Tchouaméni":  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/20221118_France_vs_Australia_-_Aurelien_Tchouameni_-%281%29_%28cropped%29.jpg/440px-20221118_France_vs_Australia_-_Aurelien_Tchouameni_-%281%29_%28cropped%29.jpg",
  "Eduardo Camavinga":    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Eduardo_Camavinga_2022_%28cropped%29.jpg/440px-Eduardo_Camavinga_2022_%28cropped%29.jpg",
  "Randal Kolo Muani":    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Randal_Kolo_Muani_2022_%28cropped%29.jpg/440px-Randal_Kolo_Muani_2022_%28cropped%29.jpg",
  "Marcus Thuram":        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Marcus_Thuram_2022_%28cropped%29.jpg/440px-Marcus_Thuram_2022_%28cropped%29.jpg",
  "Mike Maignan":         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mike_Maignan_2022_%28cropped%29.jpg/440px-Mike_Maignan_2022_%28cropped%29.jpg",
  "William Saliba":       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/William_Saliba_2022_%28cropped%29.jpg/440px-William_Saliba_2022_%28cropped%29.jpg",
  // ── Spain ─────────────────────────────────────────────────────────────────
  "Pedri":                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/20220308_Pedri_vs._Osasuna_%28cropped%29.jpg/440px-20220308_Pedri_vs._Osasuna_%28cropped%29.jpg",
  "Lamine Yamal":         "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/UEFA_Euro_2024_-_Spain_vs_Croatia_-_20240615_-_Lamine_Yamal.jpg/440px-UEFA_Euro_2024_-_Spain_vs_Croatia_-_20240615_-_Lamine_Yamal.jpg",
  "Rodri":                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/20221105_Rodri_vs._Sevilla_%28cropped%29.jpg/440px-20221105_Rodri_vs._Sevilla_%28cropped%29.jpg",
  "Álvaro Morata":        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Alvaro_Morata_2018.jpg/440px-Alvaro_Morata_2018.jpg",
  "Dani Olmo":            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/UEFA_Euro_2024_-_Spain_vs_Croatia_-_20240615_-_Dani_Olmo.jpg/440px-UEFA_Euro_2024_-_Spain_vs_Croatia_-_20240615_-_Dani_Olmo.jpg",
  "Ferran Torres":        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Ferran_Torres_2022_%28cropped%29.jpg/440px-Ferran_Torres_2022_%28cropped%29.jpg",
  "Nico Williams":        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/UEFA_Euro_2024_-_Spain_vs_Croatia_-_20240615_-_Nico_Williams.jpg/440px-UEFA_Euro_2024_-_Spain_vs_Croatia_-_20240615_-_Nico_Williams.jpg",
  "Unai Simón":           "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Unai_Simon_2022_%28cropped%29.jpg/440px-Unai_Simon_2022_%28cropped%29.jpg",
  "Dani Carvajal":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dani_Carvajal_2018_%28cropped%29.jpg/440px-Dani_Carvajal_2018_%28cropped%29.jpg",
  // ── England ───────────────────────────────────────────────────────────────
  "Jude Bellingham":      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Jude_Bellingham_2022_%28cropped%29.jpg/440px-Jude_Bellingham_2022_%28cropped%29.jpg",
  "Harry Kane":           "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Harry_Kane_2019-10-16.jpg/440px-Harry_Kane_2019-10-16.jpg",
  "Phil Foden":           "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Phil_Foden_2022_%28cropped%29.jpg/440px-Phil_Foden_2022_%28cropped%29.jpg",
  "Bukayo Saka":          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Bukayo_Saka_at_the_2022_FIFA_World_Cup_%28cropped%29.jpg/440px-Bukayo_Saka_at_the_2022_FIFA_World_Cup_%28cropped%29.jpg",
  "Marcus Rashford":      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Marcus_Rashford_2022_%28cropped%29.jpg/440px-Marcus_Rashford_2022_%28cropped%29.jpg",
  "Jack Grealish":        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Jack_Grealish_2022_%28cropped%29.jpg/440px-Jack_Grealish_2022_%28cropped%29.jpg",
  "Jordan Pickford":      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Jordan_Pickford_2022_%28cropped%29.jpg/440px-Jordan_Pickford_2022_%28cropped%29.jpg",
  "Declan Rice":          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Declan_Rice_2022_%28cropped%29.jpg/440px-Declan_Rice_2022_%28cropped%29.jpg",
  "Trent Alexander-Arnold":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Trent_Alexander-Arnold_2022_%28cropped%29.jpg/440px-Trent_Alexander-Arnold_2022_%28cropped%29.jpg",
  // ── Portugal ──────────────────────────────────────────────────────────────
  "Cristiano Ronaldo":    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg",
  "Bruno Fernandes":      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Bruno_Fernandes_2022_%28cropped%29.jpg/440px-Bruno_Fernandes_2022_%28cropped%29.jpg",
  "Rafael Leão":          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Rafael_Le%C3%A3o_at_the_2022_FIFA_World_Cup_%28cropped%29.jpg/440px-Rafael_Le%C3%A3o_at_the_2022_FIFA_World_Cup_%28cropped%29.jpg",
  "Rúben Dias":           "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Ruben_Dias_2022_%28cropped%29.jpg/440px-Ruben_Dias_2022_%28cropped%29.jpg",
  "João Cancelo":         "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Joao_Cancelo_2022_%28cropped%29.jpg/440px-Joao_Cancelo_2022_%28cropped%29.jpg",
  "Bernardo Silva":       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Bernardo_Silva_2022_%28cropped%29.jpg/440px-Bernardo_Silva_2022_%28cropped%29.jpg",
  "Diogo Jota":           "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Diogo_Jota_2022_%28cropped%29.jpg/440px-Diogo_Jota_2022_%28cropped%29.jpg",
  // ── Germany ───────────────────────────────────────────────────────────────
  "Jamal Musiala":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jamal_Musiala_2022_%28cropped%29.jpg/440px-Jamal_Musiala_2022_%28cropped%29.jpg",
  "Florian Wirtz":        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/UEFA_Euro_2024_-_Germany_vs_Hungary_-_20240619_-_Florian_Wirtz_%28cropped%29.jpg/440px-UEFA_Euro_2024_-_Germany_vs_Hungary_-_20240619_-_Florian_Wirtz_%28cropped%29.jpg",
  "Kai Havertz":          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Kai_Havertz_2022_%28cropped%29.jpg/440px-Kai_Havertz_2022_%28cropped%29.jpg",
  "Antonio Rüdiger":      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Antonio_Rudiger_2022_%28cropped%29.jpg/440px-Antonio_Rudiger_2022_%28cropped%29.jpg",
  "Serge Gnabry":         "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Serge_Gnabry_2022_%28cropped%29.jpg/440px-Serge_Gnabry_2022_%28cropped%29.jpg",
  "Joshua Kimmich":       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Joshua_Kimmich_2022_%28cropped%29.jpg/440px-Joshua_Kimmich_2022_%28cropped%29.jpg",
  "Leroy Sané":           "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Leroy_Sane_2019_%28cropped%29.jpg/440px-Leroy_Sane_2019_%28cropped%29.jpg",
  // ── Netherlands ───────────────────────────────────────────────────────────
  "Virgil van Dijk":      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Virgil_van_Dijk_2022_%28cropped%29.jpg/440px-Virgil_van_Dijk_2022_%28cropped%29.jpg",
  "Memphis Depay":        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Memphis_Depay_2022_%28cropped%29.jpg/440px-Memphis_Depay_2022_%28cropped%29.jpg",
  "Frenkie de Jong":      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Frenkie_de_Jong_2022_%28cropped%29.jpg/440px-Frenkie_de_Jong_2022_%28cropped%29.jpg",
  "Cody Gakpo":           "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cody_Gakpo_2022_%28cropped%29.jpg/440px-Cody_Gakpo_2022_%28cropped%29.jpg",
  "Xavi Simons":          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Xavi_Simons_2023_%28cropped%29.jpg/440px-Xavi_Simons_2023_%28cropped%29.jpg",
  "Donyell Malen":        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Donyell_Malen_2022_%28cropped%29.jpg/440px-Donyell_Malen_2022_%28cropped%29.jpg",
  // ── Belgium ───────────────────────────────────────────────────────────────
  "Kevin De Bruyne":      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Kevin_De_Bruyne_2018.jpg/440px-Kevin_De_Bruyne_2018.jpg",
  "Romelu Lukaku":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Romelu_Lukaku_2022_%28cropped%29.jpg/440px-Romelu_Lukaku_2022_%28cropped%29.jpg",
  "Thibaut Courtois":     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Thibaut_Courtois_2018_%28cropped%29.jpg/440px-Thibaut_Courtois_2018_%28cropped%29.jpg",
  "Dries Mertens":        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Dries_Mertens_2018.jpg/440px-Dries_Mertens_2018.jpg",
  // ── Norway ────────────────────────────────────────────────────────────────
  "Erling Haaland":       "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Erling_Haaland_2022_%28cropped%29.jpg/440px-Erling_Haaland_2022_%28cropped%29.jpg",
  "Martin Ødegaard":      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Martin_Odegaard_2022_%28cropped%29.jpg/440px-Martin_Odegaard_2022_%28cropped%29.jpg",
  // ── Mexico ────────────────────────────────────────────────────────────────
  "Hirving Lozano":       "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Hirving_Lozano_2022_%28cropped%29.jpg/440px-Hirving_Lozano_2022_%28cropped%29.jpg",
  "Raúl Jiménez":         "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Raul_Jimenez_2022_%28cropped%29.jpg/440px-Raul_Jimenez_2022_%28cropped%29.jpg",
  "Guillermo Ochoa":      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Guillermo_Ochoa_2022_%28cropped%29.jpg/440px-Guillermo_Ochoa_2022_%28cropped%29.jpg",
  "Edson Álvarez":        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Edson_Alvarez_2022_%28cropped%29.jpg/440px-Edson_Alvarez_2022_%28cropped%29.jpg",
  "Santiago Giménez":     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Santiago_Gimenez_2023_%28cropped%29.jpg/440px-Santiago_Gimenez_2023_%28cropped%29.jpg",
  // ── USA ───────────────────────────────────────────────────────────────────
  "Christian Pulisic":    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Christian_Pulisic_2022_%28cropped%29.jpg/440px-Christian_Pulisic_2022_%28cropped%29.jpg",
  "Weston McKennie":      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Weston_McKennie_2022_%28cropped%29.jpg/440px-Weston_McKennie_2022_%28cropped%29.jpg",
  "Tyler Adams":          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Tyler_Adams_2022_%28cropped%29.jpg/440px-Tyler_Adams_2022_%28cropped%29.jpg",
  "Gio Reyna":            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gio_Reyna_2022_%28cropped%29.jpg/440px-Gio_Reyna_2022_%28cropped%29.jpg",
  "Tim Weah":             "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Tim_Weah_2022_%28cropped%29.jpg/440px-Tim_Weah_2022_%28cropped%29.jpg",
  "Matt Turner":          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Matt_Turner_2022_%28cropped%29.jpg/440px-Matt_Turner_2022_%28cropped%29.jpg",
  // ── Morocco ───────────────────────────────────────────────────────────────
  "Achraf Hakimi":        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Achraf_Hakimi_2022_%28cropped%29.jpg/440px-Achraf_Hakimi_2022_%28cropped%29.jpg",
  "Hakim Ziyech":         "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Hakim_Ziyech_2022_%28cropped%29.jpg/440px-Hakim_Ziyech_2022_%28cropped%29.jpg",
  "Youssef En-Nesyri":    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Youssef_En-Nesyri_2022_%28cropped%29.jpg/440px-Youssef_En-Nesyri_2022_%28cropped%29.jpg",
  "Romain Saïss":         "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Romain_Saiss_2022_%28cropped%29.jpg/440px-Romain_Saiss_2022_%28cropped%29.jpg",
  // ── Japan ─────────────────────────────────────────────────────────────────
  "Takefusa Kubo":        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Takefusa_Kubo_2022_%28cropped%29.jpg/440px-Takefusa_Kubo_2022_%28cropped%29.jpg",
  "Daichi Kamada":        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Daichi_Kamada_2022_%28cropped%29.jpg/440px-Daichi_Kamada_2022_%28cropped%29.jpg",
  "Kaoru Mitoma":         "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kaoru_Mitoma_2022_%28cropped%29.jpg/440px-Kaoru_Mitoma_2022_%28cropped%29.jpg",
  "Ritsu Doan":           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ritsu_Doan_2022_%28cropped%29.jpg/440px-Ritsu_Doan_2022_%28cropped%29.jpg",
  // ── South Korea ───────────────────────────────────────────────────────────
  "Son Heung-min":        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Son_Heung-min_2019_%28cropped%29.jpg/440px-Son_Heung-min_2019_%28cropped%29.jpg",
  "Lee Kang-in":          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Lee_Kang-in_2023_%28cropped%29.jpg/440px-Lee_Kang-in_2023_%28cropped%29.jpg",
  "Hwang Hee-chan":       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hwang_Hee-chan_2022_%28cropped%29.jpg/440px-Hwang_Hee-chan_2022_%28cropped%29.jpg",
  // ── Senegal ───────────────────────────────────────────────────────────────
  "Sadio Mané":           "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sadio_Mane_2019_%28cropped%29.jpg/440px-Sadio_Mane_2019_%28cropped%29.jpg",
  "Édouard Mendy":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Edouard_Mendy_2022_%28cropped%29.jpg/440px-Edouard_Mendy_2022_%28cropped%29.jpg",
  "Idrissa Gueye":        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Idrissa_Gueye_2022_%28cropped%29.jpg/440px-Idrissa_Gueye_2022_%28cropped%29.jpg",
  // ── Canada ────────────────────────────────────────────────────────────────
  "Alphonso Davies":      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Alphonso_Davies_2022_%28cropped%29.jpg/440px-Alphonso_Davies_2022_%28cropped%29.jpg",
  "Jonathan David":       "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Jonathan_David_2022_%28cropped%29.jpg/440px-Jonathan_David_2022_%28cropped%29.jpg",
  "Cyle Larin":           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cyle_Larin_2022_%28cropped%29.jpg/440px-Cyle_Larin_2022_%28cropped%29.jpg",
  // ── Croatia ───────────────────────────────────────────────────────────────
  "Luka Modrić":          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Luka_Modri%C4%87_2019.jpg/440px-Luka_Modri%C4%87_2019.jpg",
  "Ivan Perišić":         "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ivan_Perisic_2022_%28cropped%29.jpg/440px-Ivan_Perisic_2022_%28cropped%29.jpg",
  "Mateo Kovačić":        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Mateo_Kovacic_2022_%28cropped%29.jpg/440px-Mateo_Kovacic_2022_%28cropped%29.jpg",
  "Marcelo Brozović":     "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Marcelo_Brozovic_2022_%28cropped%29.jpg/440px-Marcelo_Brozovic_2022_%28cropped%29.jpg",
  "Ante Rebić":           "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Ante_Rebic_2022_%28cropped%29.jpg/440px-Ante_Rebic_2022_%28cropped%29.jpg",
  // ── Italy ─────────────────────────────────────────────────────────────────
  "Gianluigi Donnarumma": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Gianluigi_Donnarumma_2021_%28cropped%29.jpg/440px-Gianluigi_Donnarumma_2021_%28cropped%29.jpg",
  "Federico Chiesa":      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Federico_Chiesa_2022_%28cropped%29.jpg/440px-Federico_Chiesa_2022_%28cropped%29.jpg",
  "Nicolo Barella":       "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Nicolo_Barella_2022_%28cropped%29.jpg/440px-Nicolo_Barella_2022_%28cropped%29.jpg",
  "Lorenzo Pellegrini":   "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Lorenzo_Pellegrini_2022_%28cropped%29.jpg/440px-Lorenzo_Pellegrini_2022_%28cropped%29.jpg",
  // ── Uruguay ───────────────────────────────────────────────────────────────
  "Darwin Núñez":         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Darwin_Nunez_2022_%28cropped%29.jpg/440px-Darwin_Nunez_2022_%28cropped%29.jpg",
  "Federico Valverde":    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Federico_Valverde_2022_%28cropped%29.jpg/440px-Federico_Valverde_2022_%28cropped%29.jpg",
  "Luis Suárez":          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Luis_Suarez_2018.jpg/440px-Luis_Suarez_2018.jpg",
  "Rodrigo Bentancur":    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Rodrigo_Bentancur_2022_%28cropped%29.jpg/440px-Rodrigo_Bentancur_2022_%28cropped%29.jpg",
  // ── Colombia ──────────────────────────────────────────────────────────────
  "James Rodríguez":      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/James_Rodriguez_2018_%28cropped%29.jpg/440px-James_Rodriguez_2018_%28cropped%29.jpg",
  "Luis Díaz":            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Luis_Diaz_2022_%28cropped%29.jpg/440px-Luis_Diaz_2022_%28cropped%29.jpg",
  "Juan Cuadrado":        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Juan_Cuadrado_2018_%28cropped%29.jpg/440px-Juan_Cuadrado_2018_%28cropped%29.jpg",
  "Jhon Durán":           "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Jhon_Duran_2023_%28cropped%29.jpg/440px-Jhon_Duran_2023_%28cropped%29.jpg",
  // ── Australia ─────────────────────────────────────────────────────────────
  "Mat Ryan":             "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Mat_Ryan_2022_%28cropped%29.jpg/440px-Mat_Ryan_2022_%28cropped%29.jpg",
  "Mitchell Duke":        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Mitchell_Duke_2022_%28cropped%29.jpg/440px-Mitchell_Duke_2022_%28cropped%29.jpg",
  // ── Ecuador ───────────────────────────────────────────────────────────────
  "Enner Valencia":       "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Enner_Valencia_2022_%28cropped%29.jpg/440px-Enner_Valencia_2022_%28cropped%29.jpg",
  "Moisés Caicedo":       "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Moises_Caicedo_2022_%28cropped%29.jpg/440px-Moises_Caicedo_2022_%28cropped%29.jpg",
  // ── Switzerland ───────────────────────────────────────────────────────────
  "Granit Xhaka":         "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Granit_Xhaka_2022_%28cropped%29.jpg/440px-Granit_Xhaka_2022_%28cropped%29.jpg",
  "Xherdan Shaqiri":      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Xherdan_Shaqiri_2018_%28cropped%29.jpg/440px-Xherdan_Shaqiri_2018_%28cropped%29.jpg",
  // ── Nigeria ───────────────────────────────────────────────────────────────
  "Victor Osimhen":       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Victor_Osimhen_2022_%28cropped%29.jpg/440px-Victor_Osimhen_2022_%28cropped%29.jpg",
  "Wilfried Zaha":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Wilfried_Zaha_2019_%28cropped%29.jpg/440px-Wilfried_Zaha_2019_%28cropped%29.jpg",
  // ── Egypt ─────────────────────────────────────────────────────────────────
  "Mohamed Salah":        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mohamed_Salah_2018.jpg/440px-Mohamed_Salah_2018.jpg",
  // ── Ghana ─────────────────────────────────────────────────────────────────
  "Thomas Partey":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Thomas_Partey_2022_%28cropped%29.jpg/440px-Thomas_Partey_2022_%28cropped%29.jpg",
  "André Ayew":           "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Andre_Ayew_2022_%28cropped%29.jpg/440px-Andre_Ayew_2022_%28cropped%29.jpg",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build multiple Wikipedia slug variants for a player name */
function wikiVariants(name: string): string[] {
  const base   = name.replace(/ /g, "_");
  const parts  = name.split(" ");
  const last   = parts[parts.length - 1];
  const rest   = parts.slice(0, -1).join("_");
  return [
    base,
    `${base}_footballer`,
    `${base}_soccer_player`,
    `${base}_soccer`,
    parts.length > 1 ? `${last}_${rest}` : base,
    parts.length > 1 ? `${rest}_${last}` : base,
  ];
}

/** Wikipedia REST API — returns thumbnail from article */
async function fromWikiRest(name: string): Promise<string | null> {
  for (const slug of wikiVariants(name)) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
        {
          headers: { "User-Agent": "STAMPEDE-WorldCup/1.0 (contact@stampede.app)" },
          signal: AbortSignal.timeout(2500),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const url  = data.thumbnail?.source;
      if (url && !url.includes("no_free_image") && !url.includes("Flag_of")) return url;
    } catch { continue; }
  }
  return null;
}

/** Wikipedia MediaWiki pageimages API — alternative image endpoint */
async function fromWikiPageImages(name: string): Promise<string | null> {
  for (const slug of wikiVariants(name).slice(0, 3)) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(slug)}&prop=pageimages&format=json&pithumbsize=500&origin=*`,
        {
          headers: { "User-Agent": "STAMPEDE-WorldCup/1.0 (contact@stampede.app)" },
          signal: AbortSignal.timeout(2500),
        }
      );
      if (!res.ok) continue;
      const data  = await res.json();
      const pages = Object.values(data.query?.pages ?? {}) as { thumbnail?: { source: string } }[];
      const url   = pages[0]?.thumbnail?.source;
      if (url && !url.includes("Flag_of")) return url;
    } catch { continue; }
  }
  return null;
}

/** Wikidata: search entity → fetch P18 image property → Commons URL */
async function fromWikidata(name: string): Promise<string | null> {
  try {
    // Step 1 — search entity
    const searchRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&format=json&limit=5&origin=*`,
      {
        headers: { "User-Agent": "STAMPEDE-WorldCup/1.0 (contact@stampede.app)" },
        signal: AbortSignal.timeout(3000),
      }
    );
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    const item = (searchData.search ?? []).find((r: { description?: string }) => {
      const desc = (r.description ?? "").toLowerCase();
      return desc.includes("football") || desc.includes("soccer") || desc.includes("footballer");
    }) as { id: string } | undefined;
    if (!item) return null;

    // Step 2 — get entity data
    const entityRes = await fetch(
      `https://www.wikidata.org/wiki/Special:EntityData/${item.id}.json`,
      {
        headers: { "User-Agent": "STAMPEDE-WorldCup/1.0 (contact@stampede.app)" },
        signal: AbortSignal.timeout(3000),
      }
    );
    if (!entityRes.ok) return null;
    const entityData = await entityRes.json();

    const entity    = entityData.entities?.[item.id];
    const imgClaim  = entity?.claims?.P18?.[0];
    const filename  = imgClaim?.mainsnak?.datavalue?.value as string | undefined;
    if (!filename) return null;

    const encoded = encodeURIComponent(filename.replace(/ /g, "_"));
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=400`;
  } catch {
    return null;
  }
}

/** Wikimedia Commons image search */
async function fromCommonsSearch(name: string): Promise<string | null> {
  try {
    const query = `${name} footballer`;
    const res   = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&gsrlimit=5&origin=*`,
      {
        headers: { "User-Agent": "STAMPEDE-WorldCup/1.0 (contact@stampede.app)" },
        signal: AbortSignal.timeout(3000),
      }
    );
    if (!res.ok) return null;
    const data  = await res.json();
    const pages = Object.values(data.query?.pages ?? {}) as { title?: string; imageinfo?: { url: string }[] }[];
    for (const page of pages) {
      const url = page.imageinfo?.[0]?.url;
      // Skip flags, logos, generic images
      if (url && !url.toLowerCase().includes("flag") && !url.toLowerCase().includes("logo")) return url;
    }
  } catch { /* ignore */ }
  return null;
}

/** TheSportsDB free tier */
async function fromSportsDB(name: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`,
      { signal: AbortSignal.timeout(2500) }
    );
    if (!res.ok) return null;
    const data   = await res.json();
    const player = data.player?.[0];
    const url    = player?.strThumb || player?.strCutout || player?.strRender;
    return url ?? null;
  } catch {
    return null;
  }
}

/** Race all sources in parallel — return first non-null */
async function raceAll(...fns: (() => Promise<string | null>)[]): Promise<string | null> {
  return new Promise((resolve) => {
    let done    = false;
    let pending = fns.length;
    for (const fn of fns) {
      fn().then(url => {
        if (url && !done) { done = true; resolve(url); }
      }).catch(() => {}).finally(() => {
        pending--;
        if (pending === 0 && !done) resolve(null);
      });
    }
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name")?.trim();
  if (!name) return NextResponse.json({ url: null });

  // 1. Hardcoded overrides — instant
  if (PHOTO_OVERRIDES[name]) {
    return NextResponse.json({ url: PHOTO_OVERRIDES[name] });
  }

  // 2. Race all 5 free sources in parallel
  const url = await raceAll(
    () => fromWikiRest(name),
    () => fromWikiPageImages(name),
    () => fromWikidata(name),
    () => fromSportsDB(name),
    () => fromCommonsSearch(name),
  );

  return NextResponse.json({ url: url ?? null });
}
