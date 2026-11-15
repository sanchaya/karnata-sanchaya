# Newspapers and magazines (`#press`)

Source: the Patrika Sanchaya catalogue (`atlasData.periodicals`, 3,715 rows; see [data import](data-import-and-deployment.md)).

- **Press page** (`src/PressExplorer.jsx`): a map of publication places (blue circle = number of titles, magenta inner circle = titles with a woman editor), a year filter, men/women/other bars for editors and publishers, and editorships by decade. Titles with no place are counted, not mapped.
- **People page**: editors and publishers are merged into the `#people` list as person records (roles *editor* / *publisher*, inferred gender, publication place on the map, their titles in the profile). Organisations are left out. They sit in the main People tab, marked needs-review; filter by role to see only them. The Press page keeps its own searchable list (`PressPeople`).
- **Logic** (`src/periodicals.js`, test `test/periodicals.test.js`): joint names split on `/ , ; &`; one entry per distinct name.

## Gender is inferred, not recorded

The catalogue has no gender column. `inferGender` reads the Kannada name (titles such as ಶ್ರೀಮತಿ, endings such as -ಮ್ಮ and -ದೇವಿ, common male endings) and answers `woman`, `man`, `organisation` or `unknown`. Many names stay `unknown`, and wrong guesses are possible, so the page labels every figure "inferred, not reviewed". Do not quote the counts as findings. To replace the guess, add a reviewed gender column to the CSV and read it in `import-patrika.mjs`.
