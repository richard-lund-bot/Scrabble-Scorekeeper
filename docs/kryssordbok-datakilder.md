# Kryssordbok – analyse av datakilder

Dyp analyse av tre norske kryssord-nettsteder og en gjennomgang av hvilke
datakilder vi lovlig kan bruke for å forbedre kryssordboka i appen.

Dato: 2026-07-12 · oppdatert 2026-07-14

> **Status:** Alle tre anbefalte åpne datakildene (Wikidata, ConceptNet,
> Bokmålsordboka-definisjoner) er **implementert** og bygget inn i appen (seksjon 7).
> Etter tilbakemelding om at søket fortsatt var svakt (f.eks. «Demre» ga ingen
> treff) er hovedstad-dataene ryddet opp, en generell by/øy-kategori lagt til,
> og søket gjort **toveis** (omvendt oppslag) — se seksjon 8.

---

## 1. Sammendrag (TL;DR)

- **De tre nettstedene kan vi ikke bruke som datakilde.** Ingen av dem tilbyr
  API, nedlasting eller åpen lisens. Alle tre blokkerer AI-/datainnhøsting i
  `robots.txt`, og databasene er vernet av databasevernet i åndsverkloven
  (EU-databasedirektivet via EØS). Skraping ville vært både brudd på vilkår og
  ulovlig.
- **Grunnen til at kryssordboka vår er «dårlig» er ikke ordlisten, men
  ledetråd-dataene.** Mønstersøket vårt bruker allerede Norsk Ordbank med
  494 902 ord – det er like stort eller større enn de kommersielle sidene.
  Problemet er ledetråd-modus, som bare har **9 444 synonym-oppslag** og
  **6 041 kategori-oppslag** fra Norsk Ordvev. Ekte kryssord-ledetråder er
  encyklopediske og assosiative («hovedstad i Italia», «norsk elv», «gresk
  gud», «bilmerke»), ikke ordbok-synonymer.
- **Det finnes gode, lovlige åpne kilder som fyller akkurat dette hullet.**
  Rangert: **Wikidata (CC0)** > **ConceptNet (CC-BY-SA)** >
  **Bokmåls-/Nynorskordboka-definisjoner (CC-BY)** > bedre bruk av Ordvev vi
  allerede har. Wikidata er den klart største gevinsten og har ingen
  lisensbånd.

---

## 2. Slik fungerer kryssordboka vår i dag

Appen er én statisk HTML-fil med innebygde, komprimerte datablokker (ingen
server, ingen nettverkskall for selve oppslaget – kun utgående lenker til
naob.no, synonymordboka.no og ordbokene.no for «slå opp på nett»).

To datakilder er innebygd:

| Blokk | Kilde | Lisens | Størrelse | Brukes til |
|---|---|---|---|---|
| `SCRABBLE_ORDBOK` | Norsk Ordbank (Språkbanken/UiB) | CC-BY 4.0 | **494 902 ord** | Mønster-/lengde-/inneholder-søk |
| `SCRABBLE_SYNVEV` | Norsk Ordvev (Språkbanken/NB) | CC-BY | ~53 000 ord, **9 444 synonym- + 6 041 kategori-oppslag** | Ledetråd-modus |

Kryssord-motoren (`kryssSearch` i `index.html`) har to moduser:

1. **Mønster-modus** – f.eks. `K_YSS_RD`, lengde, «inneholder». Slår opp i
   Ordbank. Dette fungerer bra og er ikke problemet.
2. **Ledetråd-modus** – du skriver ett ord, og den slår det opp i Ordvev-indeksen
   og returnerer synonymer + kategorimedlemmer. **Dette er den svake delen:**
   - Treffer bare hvis ledetråden er ett av ~15 500 nøkkelord.
   - Returnerer bare *litterære synonymer/hyponymer* – ikke encyklopedisk kunnskap.
   - Ingen flerords-ledetråder, ingen bøyde former, ingen egennavn/steder/personer.

Det er dette gapet de kommersielle sidene fyller: de er bygd på **ekte,
innhøstede ledetråd→svar-par** fra faktiske kryssord, ikke på en ordbok.

---

## 3. Analyse av de tre nettstedene

### 3.1 gratiskryssord.no/kryssordbok
- **Type:** Ledetråd→synonym-ordbok, «flere millioner synonymer».
- **Søk:** På ledetråd-ord. URL-struktur `/kryssordbok/<ord>/` og
  `/kryssordbok/alfabetisk/<bokstaver>/`.
- **Resultat:** Synonymer gruppert i kategorier, kryssreferanser, «Dagens mest
  populære», nylig lagt til.
- **Eier/lisens:** Del av VG (Schibsted-konsernet). `robots.txt` sier eksplisitt:
  *«do not permit unlicensed use of our content for training large language
  models or other artificial intelligence technology»*, krever godkjenning fra
  VG, og forbyr *«text and data mining and all other technical means»*.
  Blokkerer `CCBot`, `GPTBot`, `anthropic-ai`.
- **API/nedlasting:** Ingen.

### 3.2 kryssord.no/kryssordbok
- **Type:** Ren mønster-matcher (ikke ledetråd→svar).
- **Søk:** `?` som jokertegn (`KRY??O?D`), `*` for variabel lengde (`BIL*`,
  `*TEGN`), og etter bokstavantall.
- **Vurdering:** Dette gjør appen vår allerede – og med et større, åpent
  datasett (Ordbank). Ingen fordel å hente herfra.
- **Lisens:** Proprietær. `robots.txt` blokkerer `GPTBot` og `Google-Extended`
  fra hele siten.
- **API/nedlasting:** Ingen.

### 3.3 kryssord.org
- **Type:** «Norges største kryssordbok». Ekte ledetråd→svar-database,
  kontinuerlig utviklet **siden 2002**, **bygget og vedlikeholdt av brukerne
  selv**.
- **Søk:** Ledetråd + mønster: `/search.php?a=<ledetråd>&b=<mønster>`.
- **Vurdering:** Datamessig den mest verdifulle (dugnadsbygd ledetråd→svar), men
  også den mest beskyttede.
- **Lisens:** Proprietær, brukergenerert. `robots.txt` blokkerer **`ClaudeBot`,
  `GPTBot`, `OAI-SearchBot`, `Barkrowler`** m.fl. med `Disallow: /`.
- **API/nedlasting:** Ingen.

### Oppsummert tabell

| Side | Data-type | API/dump | Lisens | Blokkerer AI/TDM | Brukbar? |
|---|---|---|---|---|---|
| gratiskryssord.no | ledetråd→synonym | Nei | Proprietær (VG) | Ja, eksplisitt | ❌ |
| kryssord.no | mønster-matcher | Nei | Proprietær | Ja | ❌ (og ingen fordel) |
| kryssord.org | ledetråd→svar (dugnad) | Nei | Proprietær | Ja (ClaudeBot) | ❌ |

---

## 4. Kan vi bruke dataene deres? – Nei

Konklusjonen er entydig for alle tre:

1. **Ingen tilbyr API, dump eller åpen lisens.** Eneste vei inn er skraping.
2. **`robots.txt` forbyr eksplisitt AI-/datainnhøsting** på alle tre (og
   gratiskryssord har en egen TDM-nektelse på vegne av VG).
3. **Databasevern.** Selv om enkeltfakta ikke er opphavsrettsbeskyttet, er selve
   *samlingen* vernet av det sui generis databasevernet (åndsverkloven § 24, som
   gjennomfører EU-databasedirektivet i EØS). Å kopiere en «vesentlig del» er
   ulovlig uavhengig av opphavsrett. kryssord.org (dugnad siden 2002) og VGs
   base representerer nettopp den «vesentlige investeringen» loven verner.

**Å skrape noen av disse er utelukket** – juridisk og etisk. Vi bør heller bygge
på åpne kilder, som gir minst like god dekning uten risiko.

---

## 5. Datakilder vi FAKTISK kan bruke (rangert)

Appen er offline-først med innebygde blokker, så den praktiske veien er å bygge
en **ledetråd→svar-indeks offline fra åpne dumper** og bygge den inn komprimert,
akkurat som `SCRABBLE_SYNVEV` i dag. (Alternativt/i tillegg: utgående «slå opp»-
lenker, slik appen allerede gjør.)

### Tier 1 – Størst gevinst, ren lisens

**1. Wikidata — CC0 (public domain). Den klart beste kilden.**
- **Hvorfor:** Fyller nøyaktig hullet vår – encyklopediske ledetråder som en
  ordbok aldri dekker: hovedsteder, land, byer, elver, fjell, innsjøer, hav,
  grunnstoffer, dyr/planter (art/familie), norrøn/gresk/romersk mytologi,
  kjente personer etter yrke+nasjonalitet, bilmerker, valutaer, planeter osv.
- **Norsk:** Har `nb`- og `nn`-etiketter på entitetene.
- **Lisens:** CC0 – **ingen** kreditering eller share-alike påkrevd. Ideelt for
  innebygging i en statisk fil.
- **Hvordan:** SPARQL-spørringer (query.wikidata.org) per kategori →
  generér ledetråd→svar-par (f.eks. «grunnstoff»→[HYDROGEN, HELIUM, …],
  «hovedstad»→[OSLO, PARIS, …], «elv»→[GLOMMA, RHINEN, …]). Kan kjøres offline
  mot dump og bygges inn som ny blokk.

**2. ConceptNet 5.7 — CC-BY-SA 4.0.**
- **Hvorfor:** Assosiativt semantisk nett – `RelatedTo`, `IsA`, `Synonym`,
  `PartOf`, `AtLocation`, `HasProperty`. Bra for løsere ledetråd→svar enn ren
  synonymi.
- **Norsk:** Noder under `/c/nb/` og `/c/no/`. Dekningen er mindre enn engelsk,
  men reell og nyttig.
- **Nedlasting:** Én gzippet TSV-dump med alle kanter
  (`conceptnet-assertions-5.7.0.csv.gz`), filtrér til norske noder.
- **Lisens-obs:** CC-BY-SA krever **kreditering + share-alike**. Den avledede
  indeksen (og delen av appen som distribuerer den) må deles under kompatible
  vilkår. Verdt å vurdere før innbygging; Wikidata (CC0) har ikke dette båndet.

### Tier 2 – Berik det vi allerede har

**3. Bokmålsordboka + Nynorskordboka (definisjoner) — CC-BY 4.0.**
- **Hvorfor:** Bygg en **omvendt indeks** fra definisjons-nøkkelord → oppslagsord,
  slik at ledetråder kan matche mot *definisjonstekst*, ikke bare synonymer.
- **Kilde:** Data © Språkrådet + UiB via ordbøkene.no, tilgjengelig som dump fra
  Språkbanken. Community-API: `ordbokapi` (GraphQL, offentlig endepunkt
  `https://api.ordbokapi.org/graphql`, kode AGPL-3.0) gir ord, definisjoner og
  bøyingsformer. Samme datafamilie som vi allerede bruker.

**4. Fyldigere bruk av Norsk Ordvev (vi har den allerede).**
- I dag ekstraherer vi bare `syn` + én «kategori»-relasjon. Ordvev (norsk
  wordnet) har flere semantiske relasjoner (hypernym/hyponym-kjeder, domene,
  del-av). Å ta ut flere relasjoner utvider ledetråd-dekningen **uten ny lisens
  og uten mer nedlasting** – dataene ligger allerede innbygd.

**5. Norsk Wiktionary / Wikipedia — CC-BY-SA.**
- Wiktionary har eksplisitte «Synonymer»-seksjoner; Wikipedia-kategorigrafen gir
  «X er en Y»-data. Samme share-alike-forbehold som ConceptNet.

### Tier 3 – Bedre matching (ikke ny data)

- **Lemmatisér ledetråden før oppslag.** Ordbank har fullform→lemma-mapping;
  bruk den så «elver»/«elva» treffer «elv».
- **Delstreng-/fuzzy-match** på ledetråd, og støtte for **flerords-ledetråder**.
- Kombinér ledetråd + mønster i samme søk (som kryssord.org gjør) – vi har begge
  deler, men de er separate moduser i dag.

---

## 6. Anbefalt plan

1. ~~**Wikidata-basert ledetråd→svar-indeks (CC0).**~~ ✅ Implementert (seksjon 7).
2. ~~**ConceptNet-indeks (CC-BY-SA).**~~ ✅ Implementert (seksjon 7).
3. ~~**Bokmålsordboka-definisjoner (CC-BY).**~~ ✅ Implementert som genus-uttrekk (seksjon 7).
4. **Ikke skrap** kryssord.org / gratiskryssord.no / kryssord.no.

Gjenstår som mulige forbedringer senere:
- Lemmatisering + fuzzy ledetråd-match (ren kode, ingen ny data).
- Rydde i restnøyaktighet (f.eks. HOVEDSTAD har noen land-oppføringer, BLOMST
  har noen nyttevekster fra Wikidata).

---

## 7. Implementert (kryss-nob-1.0)

Alle tre kildene er høstet fra åpne data, slått sammen til én kompakt blokk
(`window.SCRABBLE_KRYSS`, samme vokab/base36-format som `SCRABBLE_SYNVEV`) og
koblet inn i ledetråd-modusen. Alt kjører **lokalt/offline** i appen — ingen
nettverkskall ved oppslag.

**Datamengde (ledetråd → svar):**

| Kilde | Lisens | Nøkler | Par | Eksempel |
|---|---|---|---|---|
| Wikidata | CC0 | 236 | 5 913 | ELV→NILEN, DONAU · GRUNNSTOFF→GULL, JERN · HOVEDSTAD→PARIS |
| ConceptNet 5.7 | CC-BY-SA 4.0 | 18 906 | 39 252 | KONGE→DRONNING · HAV→SJØ |
| Bokmålsordboka (genus) | CC-BY 4.0 | 19 993 | 95 158 | REDSKAP→ØKS, SAG · FUGL→MÅKE, DUE · INSEKT→BIE, VEPS |

Til sammenligning hadde den gamle ledetråd-modusen kun ~15 500 nøkler (Ordvev
alene) og ingen encyklopediske egennavn. Nå: **~39 000 nøkler** + fakta.

**Slik er det bygget:**
- **Wikidata:** ~30 SPARQL-spørringer mot kryssord-relevante kategorier
  (grunnstoff, hovedstad, elv, fjell, innsjø, kommune, land, fugl, farge,
  bilmerke, valuta, mytologi, yrke m.fl.), notabilitets-sortert (sitelinks) og
  cappet. Egennavn (OSLO, GLOMMA, IBSEN …) som ordbøker aldri har.
- **ConceptNet:** dumpen (`conceptnet-assertions-5.7.0`) filtrert til norske
  `/c/no/`-kanter, relasjonene Synonym/RelatedTo/SimilarTo/IsA/Antonym, bygget
  toveis clue↔svar.
- **Bokmålsordboka:** ~62 000 artikler hentet fra `ord.uib.no`, og **genus**
  (den definerende kategorien først i forklaringen) trukket ut → «ord som ER en
  slags X». Langt mer presist enn en full omvendt definisjonsindeks.

**UI:** Ledetråd-treff vises nå i seksjonene *Synonymer · Fakta · Eksempler ·
Beslektede ord · Fra ordboka*, deduplisert etter presisjon og filtrert av
mønster/lengde. Kildekreditering står i bunnteksten på Kryssordbok-siden.

**Kostnad:** `index.html` vokser ~1,5 MB (3,4 → ~5,0 MB) for den innebygde
blokken — akseptabelt for en offline-app som allerede har Ordbank/Ordvev
innebygd.

**Lisens-obs:** ConceptNet er CC-BY-SA 4.0 (share-alike). Kildene er kreditert i
appen; ved videre distribusjon bør ConceptNet-avledet innhold deles under
kompatible vilkår. Wikidata (CC0) og Bokmålsordboka (CC-BY) har ikke share-alike.

**Verifisert:** end-to-end i Chromium (Playwright) — 9/9 søk grønne, ingen
konsollfeil; mønsterfilter bekreftet (ELV + `D....` → DONAU, ikke NILEN).

---

## 8. Iterasjon 2 (kryss-nob-1.1) — svar på «fortsatt dårlig, f.eks. Demre»

**Tilbakemelding:** Søk på **Demre** (tyrkisk by, kjent fra kryssord om
julenissens opphav) ga ingen brukbare treff, mens gratiskryssord.no viser 34
synonymer for samme ord. To reelle bugs/hull lå bak dette:

1. **`HOVEDSTAD`-nøkkelen var i praksis ødelagt.** Wikidata-innhøstingen hadde
   gruppert hovedsteder etter *hvilken statsdannelse* de var hovedstad i, ikke
   bare «hovedstad» generelt. Resultatet: 183 av 236 wd-nøkler var søppel som
   ingen noensinne ville søkt på (`HOVEDSTADIDENFØRSTEFRANSKEREPUBLIKK`,
   `HOVEDSTADIDETTYSKROMERSKERIKE` …), og den rene `HOVEDSTAD`-nøkkelen hadde
   kun 23 svar — de fleste av verdens hovedsteder manglet helt. Disse 183
   søppelnøklene er fjernet; svarene deres (20 unike byer) er slått sammen inn
   i en ny, komplett `HOVEDSTAD`-liste bygget fra `?land wdt:P36 ?hovedstad`
   (203 hovedsteder).
2. **Ingen generell «by»-kategori fantes.** Ledetråd-modus dekket kun
   hovedsteder, elver, fjell osv. — aldri vanlige (uten-hovedstad) byer og
   tettsteder. Det er nettopp denne kategorien Demre hører til. Lagt til:
   - **`BY`** — 7 720 byer/tettsteder verden over med norsk (nb) Wikidata-etikett
     (`wdt:P31` city/town).
   - **111 land-spesifikke nøkler** (`BYITYRKIA`, `BYISTORBRITANNIA`,
     `BYIDANMARK` …) for land med ≥10 treff — matcher hvordan en ekte
     kryssord-ledetråd faktisk er formulert («by i Tyrkia»).
   - **`ØY`** — 2 998 øyer (`wdt:P31` island).
3. **Søket var kun ettveis.** Selv med Demre i `BY`/`BYITYRKIA`, ville et søk
   på ordet **Demre** likevel gitt null treff — ledetråd-modus slo bare opp
   *kategori → medlemmer* (skriv «ELV», få elvenavn), aldri omvendt. Ekte
   kryssord-synonymordbøker (som gratiskryssord.no) er derimot symmetriske: du
   kan søke på et hvilket som helst ord og få relaterte ord tilbake, uansett om
   det ordet «egentlig» er en kategori eller et konkret svar. Lagt til et
   **omvendt register** (`buildRev()` i `index.html`): slår et søkeord opp som
   *svar* i alle fem tabellene (Ordvev-synonymer/-kategorier, Wikidata,
   ConceptNet, Bokmålsordboka), og viser søskenordene i kategorien(e) det
   tilhører under en ny seksjon «X finnes i samme kategori som». Søk på
   **Demre** gir nå 120 relaterte bynavn (fra `BY`/`BYITYRKIA`) i tillegg til
   ett ordboksmatch (`MORGNE`, via den norske verbformen «demre»/«å demre»).

**Datamengde etter opprydding (wd-delen):**

| Nøkkel | Kilde | Antall svar | Eksempel |
|---|---|---|---|
| `HOVEDSTAD` | Wikidata (`P36`) | 203 (var 23 + 183 søppelnøkler) | OSLO, PARIS, ANKARA, TOKYO … |
| `BY` | Wikidata (city/town) | 7 720 | DEMRE, BERGEN, PARMA … |
| `BYI<LAND>` (111 nøkler) | Wikidata (city + `P17`) | ~7 700 (fordelt) | `BYITYRKIA` → DEMRE, ANTALYA … |
| `ØY` | Wikidata (island) | 2 998 | KRETA, MADAGASKAR … |

wd-delen totalt: 236 → **166 nøkler** (søppel fjernet), **5 913 → 24 092 par**.
Filstørrelse: `index.html` vokser fra ~5,0 til **~5,2 MB**.

**Grensen som gjenstår:** Wikidata/ConceptNet/Bokmålsordboka gir oss
*taksonomi* (Demre er en by i Tyrkia), ikke *kryssord-trivia*
(Demre = julenissens fødeby/Myra). Den slags assosiative kunnskap finnes kun i
ekte, redaksjonelt kuraterte kryssord-arkiv (kryssord.org, gratiskryssord.no) —
som vi (fortsatt, se seksjon 4) ikke kan skrape lovlig. Omvendt-registeret
tetter mye av gapet for *stedsnavn/kategori-medlemskap*, men vil aldri fange
opp kulturelle/historiske snarveier en kryssordredaktør bruker som ledetekst.
Forvent fortsatt enkelte «kjendis-ledetråder» uten treff.

**Verifisert:** simulert avkoding + reelt Chromium-søk (Playwright) på Demre,
Elv, Hovedstad, By, Redskap — ingen konsollfeil, ingen regresjon på
eksisterende nøkler.

## 9. Kilder

- Norsk Ordbank (CC-BY): https://www.nb.no/sprakbanken/en/resource-catalogue/oai-nb-no-sbr-5/
- Ordbøkene / nyttige ressurser: https://ordbokene.no/nob/about/useful-links
- ordbokapi (GraphQL, AGPL-3.0): https://github.com/ordbokapi/api
- ConceptNet nedlasting: https://github.com/commonsense/conceptnet5/wiki/Downloads
- ConceptNet lisens (CC-BY-SA 4.0): https://github.com/commonsense/conceptnet5/wiki/Copying-and-sharing-ConceptNet
- Wikidata (CC0): https://www.wikidata.org/ · SPARQL: https://query.wikidata.org/
- gratiskryssord kryssordbok: https://www.gratiskryssord.no/kryssordbok/
- kryssord.org søk: https://www.kryssord.org/
