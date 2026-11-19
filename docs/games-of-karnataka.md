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

## How to turn this into the atlas

1. Use section 1 first. For each row, read the source and record its title, page or abstract locator, and the fact it supports, in our own words. Schmidt-Madsen 2022 is open access and should be read in full first.
2. Create one `culture` record per game, category `games-sports`, with bilingual names, a date range only where a source gives one, the place, tradition tags, and `review.status: needs-review`. Link it to the era-level record above it.
3. Oral and village games have no URL source, so the contribution form has an **Oral testimony** source type (see `docs/research-intake.md`): village, date collected, collector, the informant's age and consent. Collected rows go through it and are reviewed like any other contribution.
4. Run `npm run validate:data`, `npm test` and `npm run build` as for any data change.
5. Add public text for an "Old games of Karnataka" page once enough rows are cited.

Photos need a clear licence before use; nothing is copied from the books, only facts and pointers.
