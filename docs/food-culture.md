# Food culture of Karnataka (working list and page)

**On the site:** the page `#food` (Explore → Food culture) shows the rows of `src/data/food-culture.js`, each with a badge (*source read*, *lead*, *oral*), in six tabs: Old recipes, Daily food, Festival and ritual, Forest and community, Map and To read next. It reuses the Recreation page's rows, filters and district map. To add or upgrade an entry, edit the data file: set `status: 'read'` only when the cited page was opened, and put the book, page and what it says in `evidence`. `npm test` checks that a *read* entry cites something read and that no entry mentions OCR to readers.

## What the Internet Archive search found

Searched the ServantsOfKnowledge collection with Kannada, English and transliterated food terms. Most hits (about 250) are food-technology journals from the Central Food Technology Research Institute, Mysuru, which are not food culture. Food-culture sources:

| Item | What it is | Status |
|---|---|---|
| `shdgnga.treatment-of-secular-arts-and-sciences-in-somesvaras-manasollasa` | M. N. Joshi, 1984: the cookery chapter of Someshvara III's *Manasollasa* (pp. 355-359) | **Read**: rice rule, dosaka, iddarika, polika, purika, mandaka, payasa, gharika, vatika, Chalukya food habits |
| `kuh.351.kri.049244` | Gangamatha folklore, Mandya (2010) | **Read**: ragi mudde, rotti, rice, fish and meat; mudde contests |
| `kuh.593.kri.049484` | Soraturu village, Gadag (2024) | **Read**: millets and their decline; festival foods |
| `kuh.469.gee.049361` | Food diversity and security of forest tribal communities (2011) | **Part read**: contents, summary and gathered-food pages |
| `kvh.mylaranajatre0000sshi` | Mylara fair booklet (1994) | **Read** (opening pages): food offerings and barter market |
| `kuh.mphil.548.130184` | Bairapura (2007) | **Read** (p. 73): Ugadi sweet |
| `ruchiarebhasigar0000unse` | Arebhashe community cookbook (2017) | **Opening recipes read**; ritual meals. Rest not read |
| `ishtann0000pazn`, `ujjonatilerandap0000anit` | Konkani cookbooks (1998, 2019) | Lead, not read |
| `sochara.dietnutritionsta0000unse`, `nammaahara1150000srik`, `sochara.somecommonindian0000pasr`, `marakini.adugemaneyaausha0000drmb` | Diet and nutrition survey (1989), *Namma Ahara* (1956), common Indian recipes (1982), kitchen medicine (2010) | Leads, not read |

Looked at and left out: *Karnatakada Mudde Kambararu* (a study of a folk-healer community, not food), *Mudde Gantu* (short stories), and the Udupi vegetable-market theses (market economics, not food culture).

## Vijayanagara-era food (Koli 2019)

Vittal Koli's Hampi doctoral thesis *ವಿಜಯನಗರ ಕಾಲದ ಆಹಾರಪದ್ಧತಿ* (archive.org `kuh.967.kol.141171`, 2019) has chapters on crops, customs, vegetarian and meat dishes, drinks and betel, community and festival food, and cooks and kitchens. Read so far: the sweets passage of chapter 4, giving two entries, **holige and the five bhakshyas** (pp. 81, 84–86) and **mandige** (pp. 101–102). Still to read: crops (ch. 2), meal customs (ch. 3), savoury dishes and meat, drinks (ch. 5), community and festival food (ch. 6), cooks and kitchen tools (ch. 7). The thesis also quotes the Supashastra, which is still not in the collection. Other Kannada University items found for later: the Soliga traditional food study (`kuh.618.uma.049508`), the Tulunadu freshwater-fish study (`kuh.mphil.1387.gir.138162`) and the riddles book *Ogatugalu mattu kathegalu* (`kuh.ag.1355.014466`), plus children's literature theses for rhymes.

## Gaps and next steps

- The Kannada cookery text *Sūpaśāstra* (Mangarasa, 1508) is not in the collection; find a source elsewhere.
- Read the remaining food sections of the folk studies already held (Bidar taluk, Yalandur, the garadi study's wrestler's diet, the Karavali essays) and the rest of the Arebhashe cookbook.
- Village and festival food is largely oral: use the oral-testimony source type of the contribution form (`docs/research-intake.md`) to collect it, with the teller's consent and age.
- Kannada text on the page is machine-written and needs a native proofread.
