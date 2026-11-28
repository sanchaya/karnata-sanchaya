# Licensing and data sources

> ## Non-commercial use only
>
> The Karnataka Historical Atlas (ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ) is a non-profit educational and research project of
> Sanchaya, now part of Sanchi Foundation. **Everything this project has created is offered for non-commercial use only**:
> study, teaching, research, journalism and personal use, with attribution. **You may not sell it, use it in a paid
> product or service, or use it to make money without written permission.** To ask for permission, write to
> info@sanchifoundation.org.
>
> This restriction covers only what the project itself made, and the compilation as published here. It does not take away
> rights you already have in the **third-party sources** listed below. Public-domain, CC0, CC BY and ODbL material keeps its own
> terms, and some of it may be used commercially on its own; each item has its own licence and you must follow it.
>
> This document describes the project's intent and the licences of the sources it uses. It is not legal advice, and the
> terms below should be confirmed by the owner's legal counsel before relying on them in a dispute. Items we could not
> confirm are listed under [Open items](#9-open-items-for-the-owner).

The same information is on the portal under **Project & contribute > Licences & sources** (`src/data/licences.js`, shown by
`src/Licences.jsx`), where each kind of data can be filtered by area and by whether commercial use is allowed. Keep the two in step;
`test/licensing.test.js` checks it.

## 1. What you may and may not do

| You may | You may not |
|---|---|
| Read, search and share the portal and its pages | Sell the data, text, images or software, or include them in a paid or ad-funded product |
| Use the data for teaching, research, journalism and personal projects, with attribution | Remove the attribution, the record-level sources or the review status ("needs review") |
| Quote short passages and cite a record, with a link back | Present unreviewed or inferred records (marked *needs-review*) as verified fact |
| Build non-commercial tools on the open data packets in `public/data/open/`, under the same terms | Copy third-party material out of this project and claim it is covered by the project's licence |
| Suggest corrections and sources (see **Data wanted** on the portal) | Scrape the live service at scale or use it to train AI models (the site's `robots.txt` and `noai` tags ask crawlers not to) |

## 2. The project's own terms

| What | Licence | Text |
|---|---|---|
| **Software** (everything under `src/`, `server/`, `scripts/`, `test/` and the build files, except the third-party items in §3.12) | **PolyForm Noncommercial License 1.0.0** | [`LICENSES/PolyForm-Noncommercial-1.0.0.md`](LICENSES/PolyForm-Noncommercial-1.0.0.md) |
| **Original data, text, translations, Kannada glosses, clues and game content, share images, social-post drafts and documentation** (the records the project compiled and wrote, in `src/data/`, `public/data/open/`, `docs/`) | **CC BY-NC-SA 4.0** (Attribution, NonCommercial, ShareAlike) | [`LICENSES/CC-BY-NC-SA-4.0.txt`](LICENSES/CC-BY-NC-SA-4.0.txt) |
| **Names, logos and artwork** (the Sanchaya and Sanchi Foundation logos, the Berunda mascot drawing in `src/BerundaArt.jsx`, the donation QR code) | **All rights reserved.** Not licensed for reuse; for use on this portal only. (The Berunda drawing's *code* is software under PolyForm Noncommercial; the mascot as a character and name is not licensed for other uses.) | , |

- Facts (names, dates, places, relationships) are not copyrightable. The licence applies to the project's wording, selection,
  structure, translations and review notes. Where a record only restates a cited fact, follow the cited source's terms.
- **Attribution to give:** `Source: Karnataka Historical Atlas · https://karnata.sanchaya.net` and keep the record-level
  source citations. Public exports carry a canonical origin and token (`kha:karnata.sanchaya.net`, see
  `src/data/public-attribution.js`). These are attribution markers, not copy protection.
- **ShareAlike** means a derived dataset or text must carry the same CC BY-NC-SA 4.0 terms (and so stays non-commercial). It
  cannot be combined with content that requires a *different* ShareAlike licence, such as CC BY-SA (see §3).

## 3. Third-party data, by area

"Used as" says how the project uses it: **data** (copied or derived into this repository), **pointer** (a link, identifier
or citation only) or **display** (shown with credit, not stored).

### 3.1 Research records (events, rulers, places, works, people, inscriptions)
Compiled by the project and volunteers from printed editions, catalogues and journal articles, each record carrying
citations with page or item locators. The sources are **cited, not reproduced**. Record texts are the project's own and
fall under §2; each cited work keeps its copyright. Many records are still `needs-review`: they are leads, not verified claims.

**A Historical Atlas of Karnataka** (H. Shashidhar and N. Sreenivasa Murthy, Directorate of Census Operations Karnataka, Census of India
2001 data product, published 2004; `src/data/census-historical-atlas.js`) is **Government of India copyright**. The project
records only dates, names, places and figures, **in its own wording**, each with its map number. No text or map from the book
is reproduced, and the book itself says its maps show approximate extents drawn from published literature, not from surveys.

### 3.2 Epigraphy and digitised books (Epigraphia Carnatica, Epigraphia Indica, Karnataka archaeology reports, Bidar and other archive items)
- Source: items on the **Internet Archive** (archive.org) and similar libraries. Used as: **pointer**, meaning identifiers,
  titles, years and search hits. Full texts are not copied here. The rights in each item are the library's and its
  publishers'; check the item page before reusing text or images.
- Discovery feeds **BharatRajya** (`bharatrajya.com`) and the **whatisindia.com** inscription index are used as **pointers**
  only. They are not citable authorities and their content is not republished.

### 3.3 People and freedom movement
- **Wikidata** (CC0): people born in Karnataka, labels, dates, identifiers. Used as **data**. Wikidata is public domain.
- **Dictionary of Martyrs of India's Freedom Struggle** (Indian Council of Historical Research): a printed compilation.
  Used as **pointer/leads**: names and facts with page locators, not the entries' text. Copyright in the volumes remains with
  the publisher.
- **Karnataka freedom-fighter master list and bibliography:** compiled by the project from cited sources. Original
  compilation under §2; individual facts keep their sources.
- **Wikimedia Commons portraits and images:** **display**, per file (see §3.5).

### 3.4 Heritage, monuments and institutions
- **Wikidata** entities (CC0) and the **Wikipedia lists of temples and heritage sites**: used as **data** for names, coordinates
  and identifiers (facts). Wikipedia's *prose* is CC BY-SA 4.0 and is **not copied** here. If you reuse an extract from a
  Wikipedia page, attribute Wikipedia and share alike.
- **ASI, UNESCO, state tourism and museum pages:** **pointers** (links and notification references). Their images and texts
  keep their own rights.
- **Bengaluru heritage KML catalogue** (`src/data/bengaluru-kml.js`): a review-only candidate list. **Provenance of the original
  KML is not recorded in the repository** (see Open items).
- **Nakshe site records:** private research records. **Not published**, not in the public build or the open data packets.

### 3.5 Photographs and images (Wikimedia Commons)
Photos are **display** only: the page hot-links Wikimedia Commons thumbnails and prints the author, the licence and a link
to the file page. Only files under **CC0, public domain, CC BY and CC BY-SA** are accepted (`src/species-images.js`);
NonCommercial, NoDerivatives, GFDL-only, fair-use and unknown terms are refused. Each file's licence is recorded in
`src/data/species/species-images.json` and `src/data/heritage-evidence-updates.js`. Commercial reuse of such a photo is governed by
its own licence, not by this project's non-commercial terms. If you copy a photo, follow its licence and give its credit.

### 3.6 Periodicals
**Patrika Sanchaya index** (`src/data/patrika-sanchaya.generated.js`): an index of Sanchaya's own periodical. Original
compilation under §2; the periodical's articles are not reproduced.

### 3.7 Boundaries and base maps
| Data | Source and terms | Used as |
|---|---|---|
| Karnataka district outlines (`public/karnataka-districts.geojson`) | BharatMaps / National Informatics Centre, Government of India, under the **National Data Sharing and Accessibility Policy (NDSAP)**. A simplified display boundary, **not for legal use** | data |
| World country outlines for the species globes (`src/data/species/world-countries.json`) | **Natural Earth** (public domain), the India point-of-view version, simplified. India is drawn as on the official map of India | data |
| India's official boundary overlay (`public/india-official-boundary.geojson`) | Derived from Natural Earth (public domain) | data |
| River courses (`public/karnataka-rivers.geojson`) | **© OpenStreetMap contributors, Open Database Licence (ODbL)**. This file is a derived database and **stays under the ODbL** (attribution and share-alike); it is not relicensed non-commercially | data |
| State outlines for the dynasty and language maps (`public/south-asia-states.geojson`) | **Origin not recorded** (see Open items). Draws Jammu and Kashmir and Ladakh by the de facto line | data |
| Map tiles | **OpenStreetMap** (data ODbL, tiles under the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/)) and **OpenTopoMap** (CC BY-SA, style) | display |

### 3.8 Geography and nature records
- **Protected areas, tiger reserves, Ramsar sites, biosphere reserve:** facts from the Wildlife Institute of India, the National
  Tiger Conservation Authority, MoEFCC and the Ramsar Sites Information Service. Used as **data** (names, designations, areas,
  approximate positions) with **source links**. **No statutory boundaries are included**; the page links to the Karnataka Forest
  Department / Bhuvan viewer.
- **Dams, lakes, river landmarks, peaks, hill stations, rock and mine sites, caves, estuaries, coastal sites, region facts:**
  compiled by the project from general knowledge, with Wikipedia, Karnataka Tourism, India-WRIS and the Geological Survey of
  India as **pointers**. Coordinates and heights are **approximate and `needs-review`**. They are not surveyed values.

### 3.9 Species, names and migration
- **GBIF** occurrence search, Karnataka, human observations; the bird list and month profiles come from the **eBird Observation
  Dataset on GBIF (CC BY 4.0, Cornell Lab of Ornithology)**. Used as **data** (species lists, counts, month profiles,
  countries and Indian states of sightings). Other GBIF datasets carry their own licences; cite GBIF and the dataset. The
  eBird *API* has separate terms; this project uses the GBIF copy.
- **Wikidata** taxon labels (CC0): used as **data**.
- **Photos:** see §3.5.
- **Kannada names:** from GBIF vernacular names and Wikidata, plus two published lists used as **names only** with source
  links: *Vismaya Jagattu* (blog, 2013), *Early Bird* (Kutuhali column, 2025) and *Hakkipukka* (hakkipukka.com, about 250 Kannada–English bird name pairs). The pages' prose and photos are not reproduced. **Open item:** Hakkipukka states no licence and its photos are credited to individual photographers (not used); the owners were asked for permission in November 2026 and the names are **on hold, not public** (`hold: true`) until they agree to publication and a link to their portal. Record their answer here, and remove `hakkipukka` from `kn-name-sources.json` if they decline. Every
  Kannada name is **awaiting review** and may be wrong.
- **Migration origins** are where birds are *seen* in the other season, not tracked routes.
- **IUCN, Xeno-canto, eBird, GBIF, Wikidata pages:** **links only**. Their data and recordings keep their own terms.

### 3.10 Reader contributions
Corrections, sources and Kannada names submitted through the portal are reviewed before use. See §9 for the contributor terms.

### 3.11 Fonts
Era typefaces from **Fonts Sanchaya** (`src/fonts/`): Kadamba Kakusthavarman, Gangga Marasimha, Chalukya Vijayaditya,
Hoysala Regular, and print-culture faces Karnata F Kittel (Prashant Pandit, Sachin Shetty, Satish A.G.), Karnata German
Mission Press and Karnata Wesleyan Mission Press (Arun C Kallappanavar). **Their licences are not recorded in the
repository** (see Open items). Do not reuse them outside this project until confirmed. Body text uses Inter and Noto Sans
Kannada (SIL Open Font License) where installed on the reader's device; they are not bundled.

### 3.12 Software dependencies
Production dependencies and their licences (from `package.json`; transitive dependencies are in `package-lock.json`):

| Package | Licence | Note |
|---|---|---|
| react, react-dom 19 | MIT | |
| leaflet 1.9 | BSD-2-Clause | |
| **react-leaflet 5** | **Hippocratic License 2.1** | an "ethical source" licence with human-rights conditions; read it before redistributing |
| express 5, multer 2, vite 8, @vitejs/plugin-react | MIT | |
| jquery 3.7 | MIT | |
| @capacitor/core, @capacitor/android, @capacitor/ios 8 | MIT | wraps the static edition as the Android and iOS apps (see `docs/mobile-app.md`); the Android and iOS runtimes are MIT |
| **jquery.ime 0.2** (Wikimedia) | **GPL-2.0-or-later OR MIT** | used under the MIT option; the project's Kannada transliteration rule for it is MIT |
| mariadb (Node connector) | LGPL-2.1-or-later | server only, used as an unmodified library |

PolyForm Noncommercial applies to the project's own code, not to these packages, which keep their licences.

### 3.13 Visitor statistics
Anonymous counts (a hashed random browser id, no IP address or account link) are for the administrators and are not published.
See `docs/visitor-stats.md`.

### 3.14 Climate (NASA POWER)

District rainfall and temperature on the Rain and climate page (`public/data/climate/karnataka-districts.json`, made by `scripts/import-nasa-power.mjs`) come from NASA's POWER Project (Prediction Of Worldwide Energy Resources, https://power.larc.nasa.gov), monthly point data, API version v2.10.1, accessed 28 November 2026. NASA data are openly available; POWER asks that any work using them credit the project ("These data were obtained from the NASA Langley Research Center (LaRC) POWER Project funded through the NASA Earth Science/Applied Science Program"), name the service, version and date accessed, and **kindly asks** to be told about published uses and when data are passed on to others. Owner action: send POWER a short note about this use and about the derived file. The values are modelled, on a grid about 0.5 degrees wide, not rain-gauge records.

### 3.15 Sahitya Akademi awards for Kannada

The list of Kannada award winners (1955 to 2025: main award, translation, Bhasha Samman, Bala Sahitya Puraskar and Yuva Puraskar) on the Sahitya Akademi awards tab comes from a CSV supplied by the owner (`src/data/imports/sahitya-akademi-kannada.csv`, read by `scripts/import-sahitya-akademi.mjs`). Winner names, years and work titles are plain facts about public awards, recorded in our own table. The file's festival columns (whether a winner was matched by name to the speaker lists of five literature festivals) are the file author's own analysis and are shown as such. **Owner action:** record where the list was compiled from, confirm that the festival analysis may be published, and spell out the festival codes (BLF, BPF, KLF) the file uses.

## 4. How to cite

> Karnataka Historical Atlas (Sanchaya, Sanchi Foundation). *<record or page title>*. https://karnata.sanchaya.net/<page>.
> Accessed <date>. Records marked *needs review* are research leads. Cite the underlying sources listed on the record.

For a photograph: *Photo: <author>, <licence>, via Wikimedia Commons* with the link shown under the photo.

## 5. Data and licence changes

Third-party licences can change and individual items can be re-licensed or withdrawn. When you rely on an item, check its
source page. If you are a rights holder and want something corrected, credited or removed, write to
info@sanchifoundation.org with the record or page URL; we will respond and fix or remove it.

## 6. Data we still need

The project cannot complete some of its pages without official or openly licensed datasets: statutory forest boundaries,
rainfall, soil and geology maps, catchments, caves and mangroves, vetted Kannada species names, tracked migration data,
openly licensed inscription texts and photographs, and more. The full wish-list, with the licence each needs, is in
[`docs/data-wanted.md`](docs/data-wanted.md). On the portal, **Project & contribute > Data wanted** lets anyone point us to a
source. Please send only what you have the right to share, and tell us its licence.

## 7. Trademarks and names
"Sanchaya", "Sanchi Foundation", the logos and the Berunda mascot are used with the owners' permission on this portal. No
licence to use them elsewhere is granted.

## 8. Warranty
The data is provided as is, as research material, with no warranty of accuracy, completeness or fitness for any purpose.
Boundaries are for display, not for legal use.

## 9. Open items for the owner

These could not be confirmed from the repository and should be settled with counsel:

1. **Adopt or amend the project terms in §2.** PolyForm Noncommercial 1.0.0 (software) and CC BY-NC-SA 4.0 (original
   content) were chosen to match the "non-commercial" intent; change them here and in `LICENSES/` if you prefer others.
   Note CC BY-NC-SA material **cannot be merged into CC BY-SA** (for example Wikipedia text).
2. **Contributor terms.** The portal's "community terms" do not yet say under what licence contributions are given. Recommended:
   contributors license approved contributions under CC BY-NC-SA 4.0 and confirm they have the right to share what they send.
3. **Fonts Sanchaya typefaces:** confirm the licence and credit for each of the seven fonts in `src/fonts/`.
4. **`public/south-asia-states.geojson`:** record its source and licence, or replace it with an official Survey of India
   state outline (also fixes the Jammu and Kashmir and Ladakh depiction on the dynasty and language maps).
5. **Bengaluru heritage KML:** record where the KML came from and the right to use it.
6. **Government publications** such as the Census 2004 Historical Atlas of Karnataka: the project records only facts in its own
   wording; confirm this is within fair dealing and how the atlas may be cited.
7. **Dictionary of Martyrs of India's Freedom Struggle** and other print compilations: confirm the extent of use is within
   fair dealing and cite page locators only.
8. **Logos:** confirm that the Sanchaya and Sanchi Foundation logos and the donation QR may be published in the public repository.
9. **Public repository:** the repository and the GitHub Pages site are public. A non-commercial licence makes the source
   *available*, not open source in the OSI sense; say so in the README.
