# Newspapers and magazines (`#press`)

Source: the Patrika Sanchaya catalogue (`atlasData.periodicals`, 3,715 rows; see [data import](data-import-and-deployment.md)).

- **Press page** (`src/PressExplorer.jsx`): a map of publication places (blue circle = number of titles, magenta inner circle = titles with a woman editor), a year filter, men/women/other bars for editors and publishers, and editorships by decade. Titles with no place are counted, not mapped.
- **People page**: editors and publishers are merged into the `#people` list as person records (roles *editor* / *publisher*, inferred gender, publication place on the map, their titles in the profile). Organisations are left out. They sit in the main People tab, marked needs-review; filter by role to see only them. The Press page keeps its own searchable list (`PressPeople`).
- **Logic** (`src/periodicals.js`, test `test/periodicals.test.js`): joint names split on `/ , ; &`; one entry per distinct name.

## Gender is inferred, not recorded

The catalogue has no gender column. `inferGender` reads the Kannada name (titles such as ಶ್ರೀಮತಿ, endings such as -ಮ್ಮ and -ದೇವಿ, common male endings) and answers `woman`, `man`, `organisation` or `unknown`. Many names stay `unknown`, and wrong guesses are possible, so the page labels every figure "inferred, not reviewed". Do not quote the counts as findings. To replace the guess, add a reviewed gender column to the CSV and read it in `import-patrika.mjs`.

## History of printing and presses

A timeline at the bottom of the Press page (`src/PrintingHistory.jsx`, data in `src/data/printing-history.js`, test `test/printing-history.test.js`) tells how Kannada printing began: Carey's grammar (1817), the Wesleyan press in Bengaluru (1821–28), early dictionaries, the Basel Mission Press at Balmatta, Mangaluru (1841), *Mangaluru Samachara* (1843) and *Karnataka Samachara* (Bellary, 1844), the classics printed at Mangaluru, letterpress and locally cast type (1853 on), the Basel press's reputation, presses across Mysore, Kittel's dictionary (1894) and The Bangalore Press (1916). A closing list reads the earliest titles of the Patrika Sanchaya catalogue (up to 1893) straight from the data; it begins with the same 1843 newspaper, which is a useful cross-check.

- **Source status:** each row is `read` (a page was opened and the note comes from it) or `lead`. The sources read are English Wikipedia articles (Basel Mission Press, Mangaluru Samachara, Hermann Mögling, The Bangalore Press, Kingdom of Mysore) and a Daijiworld feature that cites B. S. Kesavan, *History of Printing and Publishing in India*, vol. II. **All are second-hand.** Read Kesavan and a Kannada printing history before treating any date as settled.
- **Disagreements are shown, not hidden** ("Where sources differ"): Calcutta or Serampore for Carey's grammar; 1841 or 1842 for the press reaching Mangaluru; Wikipedia's own July 1841 for the first newspaper against 1843 elsewhere (1 July 1843 is used because three sources and the catalogue agree); 1842 or 1866 for Bengaluru's press (left as an open `lead` entry).
- **Still to find:** the date of the Bellary Mission Press; the Mysore Government Press and the Mysuru palace press; Dharwad, Belagavi and Hubballi presses; the first Kannada type designs and who cut them; Kittel's dictionary printer; the move from lithography to letterpress to offset; presses of the twentieth century. The Internet Archive holds many Kannada books whose title pages name their press, which could be mined for a press-by-year list.
- Kannada text is a draft and needs a native proofread.
