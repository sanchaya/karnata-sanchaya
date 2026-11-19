# Games played in Karnataka, from the earliest records to today (working list)

**On the site:** the page `#recreation` (Explore → Old games & recreation) shows these rows from `src/data/old-games.js`, with a badge for each: *source read*, *lead* or *oral tradition*. Its second and third tabs show the festival, performance and modern-leisure records already in the atlas (`culturalHeritage`). To add or upgrade a game, edit `old-games.js`: set `status: 'read'` only when the cited page or abstract has been opened, and put the book, page and what it says in `evidence`. `npm test` checks that a game marked *read* cites something read and that oral games do not claim a printed source.

Status: **draft for research, nothing here is published as an atlas record yet.** Every row is a lead. No row may become a record until it has an item-level citation (book and page, inscription number, article or catalogue entry), as in `docs/research-intake.md`. Kannada names are the common spellings and need a native proofread. "Oral" means the game is known from living practice and has no dated source found yet; do not invent a date for those.

Existing atlas records at era level (`category: 'games-sports'` in `src/data/atlas.js`): Kadamba hunting and archery, Western Ganga wrestling, Badami Chalukya equestrian display, Rashtrakuta courtly and board games, Hoysala wrestling, Vijayanagara athletic court, Mysuru Dasara equestrian and martial display, colonial Bengaluru sports, modern indigenous games. The list below is the game-by-game layer under them.

Confidence: **A** = a specific source I know of, still to be re-read and cited. **B** = widely stated, source to find. **C** = oral or popular claim only.

## 1. Board, dice and card games (court, temple and home)

"Read" means a page or abstract was opened in this pass and the fact below comes from it. "Lead" means only a search result or a secondary page names it, so it must be re-read before any record is made.

| Game | Kannada / local names | Period | Where | What is established | Source and status |
|---|---|---|---|---|---|
| Phañjikā (a cross-shaped race game) | cauka bāra and pañci appear as keywords of the study | 12th c. | Western Chalukya court (Someshvara III) | The *Mānasollāsa* describes it at 5.16 (Phañjikākrīḍā); the study translates that passage and says the text also describes chess and backgammon, ranked above phañjikā at court. Later caupaṛ and paccīsī are named as relatives | Jacob Schmidt-Madsen, "Gameplay as Foreplay at a Medieval Indian Court", *History of Science in South Asia* 10 (2022), pp. 169-234, doi:10.18732/hssa82. **Read (abstract and metadata only; full text still to read for board and rules)** |
| Chess (chaturanga lineage) | ಚದುರಂಗ | 12th c. at this court | Western Chalukya court | Named as played at court in the same abstract. The rules and the passage number are in the full article, not yet read | Same article. **Read (abstract)** |
| Backgammon-type dice game (golaka, pāsaka) | | 12th c. | Western Chalukya court | Abstract mentions backgammon. A bibliography page says the *Mānasollāsa* chapter on pāsaka-krīḍā covers a dice game with a 24-house board; not checked against the text | Schmidt-Madsen 2022 (backgammon). **Read (abstract)**; the 24-house detail is a **Lead** |
| Carved game boards at Vijayanagara | | c. 1336-1565 | Hampi (Vijayanagara) | A survey and study of board games at the city exists; a later study of engraved boards counts hundreds of boards on market streets and temple platforms; a Vittala-temple mancala board is reproduced in a blog post | Vasantha 2003, "Board games from the city of Vijayanagara (Hampi), 1336-1565: a survey and a study" (title seen in a reference list; venue and pages unknown). A research paper titled "What's Left of Games are Boards Alone..." on engraved boards at Vijayanagara (author and year unconfirmed; one search result names Rogersdotter 2015 and a count over 960). **Lead, none opened** |
| Ali Guli Mane (mancala) | ಅಳಿ ಗುಳಿ ಮಣೆ; ಚೆನ್ನೆಮಣೆ (Chenne Mane, Tulu Nadu); Akal Patta (North Karnataka); close to pallanguzhi and vamana guntalu | Undated | Across Karnataka, Tulu Nadu, North Karnataka | Two rows of seven holes, seeds or shells, sowing and capture. No dated or archaeological claim found | Wikipedia "Ali Guli Mane" (read; a thin page with one reference: Finkel 2020, *In Context: the Reade Festschrift*, p. 45, not read). **Read, weak. Needs a scholarly source** |
| Aadu-huli aata (goats and tigers) | ಆಡು-ಹುಲಿ ಆಟ; Telugu name pulijudamu | Board survey covers 1336-1565 | Vijayanagara; villages | A search result says the Vasantha survey includes a pulijudamu board | **Lead** |
| Chowka-bara | ಚೌಕಾಬಾರ | Cross-board race game; the word appears among the keywords of the 2022 study | Households | Not yet tied to a dated Karnataka source | **Lead** |
| Pagade (dice, Pachisi/Chaupar family) | ಪಗಡೆ | Literary from the 10th c. (my earlier note) | Courts and villages | Unverified in this pass. Chaupar is linked to the Mahabharata dice game and was a Mughal court favourite per a Sahapedia article, which has nothing specific on Karnataka | Mohit Srivastava, Sahapedia, "Towards a Cultural History of Indian Board Games" (read; undated). Pampa 941 CE is a **Lead** |
| Mysuru Ganjifa and the games of Krishnaraja Wodeyar III | ಗಂಜೀಫಾ | Early to mid 19th c. | Mysuru | The Sahapedia article says the king (1794-1868) was a board-game enthusiast who documented folk board game traditions, and cites V. Rangachar, *Mahārāja's Games and Puzzles* (Kelheim: Fördererkreis Schach-Geschichtsforschung, 2006). Search results name his *Sritattvanidhi* (1818), chapter Kautuka Nidhi, and a 2006 GI tag for the craft, but the official craft page and the newspaper pieces could not be opened | Sahapedia (read); Rangachar 2006 (**cited, not read**); *Sritattvanidhi*, GI tag, 13 or 18 game counts: **Lead, sources disagree** |

Findings that change the plan:
- The best documented item is the Western Chalukya phañjikā study. Its full text is open access (CC BY-SA 4.0), so the board and rules can be cited properly in the next pass.
- Vijayanagara boards are the best physical evidence for old street and temple games across Karnataka. The two studies need to be found and read.
- Several sites (the Handicrafts portal, Deccan Herald, Wisdomlib) were not reachable from this machine, so those rows stay leads.

## 2. Village and children's games (mostly oral)

| Game | Kannada | Notes | Conf. |
|---|---|---|---|
| Chinni-daandu (gilli-danda) | ಚಿನ್ನಿದಾಂಡು | Stick and small peg | C |
| Lagori (seven stones) | ಲಗೋರಿ | Ball and stacked stones | C |
| Goli (marbles) | ಗೋಲಿ | | C |
| Bugari (spinning top) | ಬುಗುರಿ | | C |
| Kunte-bille (hopscotch) | ಕುಂಟೆಬಿಲ್ಲೆ | | C |
| Kannamuchale (hide and seek) | ಕಣ್ಣಾಮುಚ್ಚಾಲೆ | | C |
| Gajjuga seed game | ಗಜ್ಜುಗ | Played with gajjuga (nicker-nut) seeds | C |
| Kolata (stick play) | ಕೋಲಾಟ | A dance and a game; keep under performance too | C |

For this group the task is to find a collector's source (a folklore volume, a Kannada university game survey, a children's-games dictionary) that gives each game with its rules and region, then cite that.

## 3. Strength, combat and rural sports

| Game | Kannada | Period | Where | Lead / source to find | Conf. |
|---|---|---|---|---|---|
| Wrestling (kusti, malla-yuddha) and the garadi-mane gymnasium | ಕುಸ್ತಿ, ಗರಡಿ ಮನೆ | Medieval to now | Vijayanagara, Mysuru (Dasara bouts) | Domingo Paes' account of Vijayanagara (c. 1520) describes wrestlers at the festival; Wodeyar court patronage records | A |
| Stone lifting (gundu-kallu) | ಗುಂಡುಕಲ್ಲು | Oral; lifting stones stand in villages and temples | North Karnataka and Malnad | Local heritage surveys; photographs by place | C |
| Kambala (buffalo race in the paddy fields) | ಕಂಬಳ | Tradition claims about 800 years; unverified | Dakshina Kannada, Udupi | Needs a dated source. State law on animal sport (2017 amendment) to be checked | B |
| Hori habba (bull-run festival) | ಹೋರಿ ಹಬ್ಬ | Oral | Haveri, Shivamogga districts | News and district gazetteers | C |
| Bullock-cart race | ಎತ್ತಿನ ಗಾಡಿ ಓಟ | Oral | Across the state | District gazetteers; fair records | C |
| Cock-fighting (kori-katta) | ಕೋಳಿ ಕಾಳಗ / ಕೋರಿ ಕಟ್ಟ | Oral; now restricted by law | Coastal Karnataka | List as heritage history only; note the legal status | C |
| Archery and hunting | ಬಿಲ್ಲುವಿದ್ಯೆ, ಬೇಟೆ | Early (Kadamba and later) | Banavasi and royal courts | Existing atlas record; its citations to re-check | B |

## 4. Team and field sport, colonial era to now

| Game | Period | Where | Lead / source to find | Conf. |
|---|---|---|---|---|
| Cricket | From the colonial clubs; state association 20th c. | Bengaluru, Mysuru | Association history; named players such as B. S. Chandrasekhar, G. R. Viswanath, Anil Kumble, Rahul Dravid | A |
| Hockey and the Kodava Hockey Festival | Festival from 1997 | Kodagu | Festival organisers' records and press | B |
| Badminton | 20th c. | Bengaluru | Prakash Padukone, All England champion 1980 | A |
| Billiards and snooker | 20th c. | Bengaluru | Michael Ferreira, world amateur billiards 1964 | B |
| Kabaddi and kho-kho | Traditional; league era from 2014 | State-wide; Bengaluru Bulls in the Pro Kabaddi League | League records | B |
| Chess | Modern clubs and champions | Bengaluru | State chess association records | C |

## 5. Regions and villages (to be collected)

Karnataka's games differ by region and are often known only by village name, so every record carries a place, not just a game. Regions to cover, each to be filled by collectors and by published surveys:

| Region | Games already named in the sources | To collect |
|---|---|---|
| Tulu Nadu (Dakshina Kannada, Udupi) | Chenne Mane (mancala); kambala and kori-katta in section 3 | Children's games, board games on verandahs, local rules |
| North Karnataka (Kalyana and Kittur Karnataka) | Akal Patta (mancala); hori habba nearby | Games of the market towns and of the Deccan plateau villages |
| Hampi and Anegundi | Carved boards at Vijayanagara; families playing mancala at Anegundi (a 2022 blog observation) | Boards still in use; carved boards by temple and street |
| Old Mysuru region and Mysuru city | Ganjifa; wrestling | Palace and village games, garadi-mane traditions |
| Malnad (Shivamogga, Chikkamagaluru, Uttara Kannada) | | Forest and field games; hori habba in Shivamogga |
| Kodagu | Hockey (section 4) | Kodava games and festivals |
| Bengaluru and Bayaluseeme | Colonial sports (section 4) | Street and school games, new games |
| Coastal and island communities, Siddi, tribal and nomadic groups | | Games and their names, with the community's own account |

Villages: the atlas links a record to a canonical place, so each village needs a place record (name in Kannada and English, district, taluk, coordinates). Start from places that already exist in the data, then add new ones with a source.

### Field-collection template (one row per game and village)

`village` · `taluk` · `district` · `game name in the village` (Kannada and Latin script) · `other names` · `how it is played` (short, in the collector's own words) · `who plays` (age group, community only if the group wants it named) · `season or festival` · `materials` · `how long it has been played here, as told` · `informant age` · `informant consent given (yes/no), a parent or guardian's consent if under 18, and whether they may be named` · `collector` · `date` · `photo licence` · `published sources that mention it`.

## Sources found on archive.org (ServantsOfKnowledge), November 2026

Found with the Internet Archive search API (`collection:ServantsOfKnowledge`, Kannada and English title queries). All items below are open (not restricted) and have OCR text, so they can be read and cited by page. Most are Kannada University, Hampi theses and books: copyright rests with the authors and the university, so they stay source pointers. Only facts, names and page numbers go into records, in our own words. The OCR of Kannada script is imperfect; check every name against the page image. Item link: `https://archive.org/details/<identifier>`.

**Folk and traditional games, by place**

| Identifier | Title | Author, year | What it covers |
|---|---|---|---|
| `kuh.mphil.248.vad.129884` and `kuh.mphil.293.vad.129930` | ಬೀದರ ಜಿಲ್ಲೆಯ ಜನಪದ ಆಟಗಳು (Folk games of Bidar district) | Mahadevi Arjun Vadagaonve, 2009 and 2006 | Two M.Phil. versions on Bidar. Compare them |
| `kuh.752.nir.132328` | ಚಿತ್ರದುರ್ಗ ಜಿಲ್ಲೆಯ ಜನಪದ ಕ್ರೀಡೆಗಳು (Folk sports of Chitradurga district) | Niranjanamurthy T., 2017 | 710 pages; the largest district study found |
| `kuh.mphil.108.gan.129749` | ಬಳ್ಳಾರಿ ಜಿಲ್ಲೆ ಬೇಡರ ಸಮುದಾಯದ ಕ್ರೀಡೆಗಳು (Games of the Beda community, Ballari) | Gangadhar T., 2004 | A community, not a district |
| `kuh.135.mal.049030` | ಹೊಸಪೇಟೆ ತಾಲೂಕಿನ ಗರಡಿ ಸಂಪ್ರದಾಯ (Garadi tradition, Hosapete taluk) | Mallikarjun U., 2004 | Gymnasium and wrestling culture near Hampi |

**Games and recreation in the past**

| Identifier | Title | Author, year | What it covers |
|---|---|---|---|
| `kuh.703.man.132040` | ವಿಜಯನಗರ ಕಾಲದ ಕ್ರೀಡೆ ಮತ್ತು ವಿನೋದಾವಳಿ (Sport and recreation of the Vijayanagara period) | P. B. Manjanna, 2016 | 622 pages; probably cites the Hampi boards and travellers |
| `crmn.kannadakavigaluk0000drks` | Kannada Kavigalu Kanda Kreedegalu (Sports seen by Kannada poets) | Dr K. Srikantayya, 1989 | Sports and games in Kannada literature; dates for literary mentions |
| `kuh.72.vir.043129` | ಮಧ್ಯಕಾಲೀನ ಕನ್ನಡ ಕಾವ್ಯಗಳಲ್ಲಿ ಬೇಟೆ ಮತ್ತು ಬೇಡರ ಸಂದರ್ಭಗಳು (Hunting and the Beda in medieval Kannada kavyas) | 2000 | Hunting as recreation in literature |
| `damh.ganjifa0000mlsh` | Ganjifa | M. L. Shivashankara, Dept of Archaeology and Museums, 1996 | 60 pages; the Mysuru Ganjifa lead to verify |
| `jnanagangothrivo0000nira_c4q9` | ಜ್ಞಾನ ಗಂಗೋತ್ರಿ ಸಂಪುಟ ೬: ಕ್ರೀಡೆ, ಮನೋಲ್ಲಾಸ (Children's encyclopedia, vol. 6) | Niranjana, 1973 | Sports and recreation as a Kannada reference |

**Village and local folklore studies (the village layer)**
`kuh.593.kri.049484` Soraturu village (2024) · `kuh.mphil.548.130184` Bairapura (2007) · `kuh.mphil.614.pad.130250` Yalandur (2009) · `kuh.850.soo.136964` Bidar taluk (2018) · `kuh.351.kri.049244` Gangamatha folklore, Mandya (2010). Each may list local games and customs.

**Folk art (performance, craft, festival)**
`kla.janapadachitraka0000drsc` ಜನಪದ ಕಲೆ (S. C. Patil, 1995) · `kuh.152.nag.049047` music of folk theatre arts · `kuh.62.ban.049721` Karnataka folk sculpture (2002) · `kuh.283.lak.049176` folk sculpture of South Karnataka (2009) · `kuh.913.mud.138316` Sannata texts (2018) · `kuh.214.049108` and `kuh.mphil.39.vis.052051` Yakshagana make-up and costume · `tribal.killekyathanomad0000sgmo` The Killekyatha nomadic folk artists of northern Mysore (S. G. Morab, 1977) · `kuh.mphil.297.ran.129934` the plays of Gondaliga Devendrappa (2007) · `karavalijanapada0000drpu` ಕರಾವಳಿ ಜಾನಪದ (Purushottama Bilimale, 1990) · `kvh.mylaranajatre0000sshi` the Mylara fair (1994) · `kvh.chowdammanajatre0000ggir` the Chowdamma fair (1994) · the journal ಜನಪದ ವಿಚಾರ (several issues).

Not relevant, despite matching "play" or "games": the many `apu.anuvadasampada.*` items are Azim Premji University articles on play-based learning.

Next step: read the district studies first (Bidar, Chitradurga, Ballari-Beda). Pull the game names, local names and places with page numbers into `src/data/old-games.js` as sourced entries. Do the same with the Vijayanagara study for the carved boards.

## What was read from the books (November 2026)

Read in this pass, from the Internet Archive OCR text. Only facts, names and locators were taken, in our own words; the books stay pointers.

| Book | What was read | Where it went |
|---|---|---|
| Shivashankara, *Ganjifa* (1996) | The whole main text (60 pages) | `ganjifa` entry and four facts |
| Niranjanamurthy, Chitradurga folk sports (2017) | The numbered catalogue of 131 games in five groups, and the contents. The descriptions and the 35-question survey are **not** read | catalogue JSON, the catalogue panel, many attestations |
| Vadagaonve, Bidar folk games (2006, 2009) | Contents and headings of both versions (46 names in both) | same |
| Gangadhar T., Beda games, Ballari (2004) | Contents and headings (35 names) | `bedaNames` |
| Manjanna, Vijayanagara sport and recreation (2016) | Contents and introduction, plus keyword passages: board games and Devaraya II (p. 16), pagade and Pampa (p. 37), ball game (pp. 40, 47-48), wrestling and women at Mahanavami (p. 16), animal contests (p. 105), kites (p. 116), hunting festival (pp. 187-188), reliefs (p. 10), chariot festivals (pp. 145-146). Most of the 622 pages are **not** read page by page | attestations, the chendaata, kite and hunting-festival entries, five facts |
| Mallikarjun U., garadi of Hosapete taluk (2004) | Contents, the word-origin passage and the garadi names (pp. 23, 55). Chapters 3 to 11 are **not** read | `wrestling` note |
| Madannavar, Soraturu village, Gadag (2024); Padma, Yalandur (2009); Sure, Bidar taluk (2018); Krishnegowda, Gangamatha, Mandya (2010) | Contents and the opening of each game section, for local terms | four facts; the district map |
| Hunting and the Beda in medieval poetry (2000) | Contents, abstract and three passages | `hunting-poetry` entry |
| Ranganatha, Gondaliga Devendrappa's plays (2007) | Contents and cover | `sannata-devendrappa` entry |
| Hiremath, Mylara fair; Girija, Chowdamma fair (1994) | Opening of the first, cover of the second | fairs entries |
| Srikantayya, *Kannada Kavigalu Kanda Kreedegalu* (1989) | A few pages (the OCR is poor; re-OCR from the PDF would help) | `animal-contests` lead |
| Chitradurga study, board-game descriptions (alugulimani, huli-mane, chowka-bara, pagade) | Rules, names and materials read for these four | notes on the four entries |
| Garadi study, field chapter on garadis | Arena, soil, Hanuman niche and the Ramdas report | two facts |
| Morab, *The Killekyatha* (Anthropological Survey of India, 1977) | The opening chapters on the name, the togalu gombe aata, the gazetteer counts and the study village | one fact; Bagalkote map point. Copyright restricts copying; facts only |
| Bilimale, *Karavali Janapada* (1990) | The essay on kambula (pp. 40-44) and its word-origin discussion | `kambala` entry and fact. The other essays (Siddhavesha, Uragalu, Jogigalu, Myalaru) are not read |
| S. C. Patil, *Janapada Chitrakale* (1995) | The togalu gombe section | one fact |
| Children's encyclopedia vol. 6 (1973), Bairapura study, about 20 folk-art titles (Yakshagana costume, Sannata texts, folk sculpture, the Killekyatha artists and others) | Not read | Next pass |

`scripts/extract-folk-game-catalogues.py` regenerates the catalogue JSON and JS module from the OCR text. Item numbers are the studies' own numbers; four Chitradurga outdoor numbers (39, 44, 49, 59) are missing where the OCR dropped them, and a few names carry OCR slips. Check names against the page images before quoting them.

**Map.** The recreation page has a district map. A shaded district means a study, fair or collection is on record there; it does not mean the game was played only there. Village-level points need the village studies read first.

## How to turn this into the atlas

1. Use section 1 first. For each row, read the source and record its title, page or abstract locator, and the fact it supports, in our own words. Schmidt-Madsen 2022 is open access and should be read in full first.
2. Create one `culture` record per game, category `games-sports`, with bilingual names, a date range only where a source gives one, the place, tradition tags, and `review.status: needs-review`. Link it to the era-level record above it.
3. Oral and village games have no URL source, so the contribution form has an **Oral testimony** source type (see `docs/research-intake.md`): village, date collected, collector, the informant's age and consent. Collected rows go through it and are reviewed like any other contribution.
4. Run `npm run validate:data`, `npm test` and `npm run build` as for any data change.
5. Add public text for an "Old games of Karnataka" page once enough rows are cited.

Photos need a clear licence before use; nothing is copied from the books, only facts and pointers.
