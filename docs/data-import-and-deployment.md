# Data import and deployment runbook

This project has two deliberately separate layers:

- The repository is the reproducible **seed**. CSV imports and generated seed
  files are prepared here, reviewed, committed and pushed.
- MariaDB is the live **source of truth**. The live server receives repository
  seeds through migrations and `db:sync-dataset`; browser storage is never a
  data store.

## 1. Check that the checkout is the expected release

Run these commands from the repository root:

```sh
pwd
git status --short
git log -1 --oneline
npm run
```

The Patrika intake is present only in a commit containing both
`scripts/import-patrika.mjs` and the `import:patrika` package script. If npm
reports `Missing script: "import:patrika"`, the checkout is stale; update the
clone to the branch/commit that contains those files before doing anything
else:

```sh
git fetch origin
git checkout main
git merge --ff-only origin/main
npm ci
```

Do not copy `node_modules` between machines. Use the Node version required by
the current `package.json`/lockfile and run `npm ci` as the application user.

## 2. Add or refresh a CSV dataset

For a new CSV-backed collection:

1. Put the source CSV under `src/data/imports/` and preserve its original
   filename. Record who supplied it, the URL or catalogue context, date
   received and licence/permission in the relevant source record and docs.
2. Use a dedicated importer in `scripts/` that parses quoted CSV safely,
   creates stable IDs, preserves the original row number, attaches a
   row-level citation and emits a committed generated module under
   `src/data/`.
3. Register the collection in `src/data/validate.js`, `server/dataset-store.js`
   and the Admin collection labels if it is a new collection.
4. Add the generated module to `src/data/atlas.js`; only add map anchors when
   coordinates are authoritative. Approximate publication/place anchors must
   remain visibly `needs-review`.
5. Run validation, tests and a production build, then inspect the public page
   and Admin before committing both the importer and its input/generated data.

### Patrika Sanchaya (current CSV workflow)

The supplied `Patrika Sanchaya - Kannada.csv` is already stored at
`src/data/imports/Patrika Sanchaya - Kannada.csv`. To replace it with a newer
version, overwrite that file deliberately, then run:

```sh
npm run import:patrika
npm run validate:data
node --test
npm run build
```

The importer generates `src/data/patrika-sanchaya.generated.js` and currently
produces 3,715 `periodicals` records plus grouped publication-place map
anchors. Do not hand-edit the generated file. If the CSV is not at the
default path, pass it explicitly:

```sh
node scripts/import-patrika.mjs /absolute/path/to/catalogue.csv
```

After review, commit the input, importer, generated seed and documentation in
one change. The live server does **not** need to rerun this importer when the
generated seed is already committed.

## 3. Other repository import/refresh scripts

These are intentionally source-specific and are not all run on every deploy:

| Script | Use | Run when |
| --- | --- | --- |
| `npm run import:patrika` | Patrika Sanchaya newspapers/magazines CSV | The catalogue CSV changes |
| `node scripts/import-wikimedia-people.mjs` | Refresh Wikimedia people candidates | A reviewed source export is supplied |
| `node scripts/import-freedom-fighters.mjs` | Refresh freedom-fighter CSVs | Master/source CSVs change; pass both CSV paths when needed |
| `npm run audit:freedom-fighters` | Measure freedom-fighter coverage across all 31 current districts | After imports, curated additions, reviews, or a MariaDB/static release update |
| `python3 scripts/import-bengaluru-kml.py` | Rebuild Bengaluru inscription candidates | The KML changes |
| `python3 scripts/import-wikipedia-heritage.py` | Refresh heritage discovery leads | A deliberate research refresh is approved |
| `node scripts/discover-pending-heritage-pages.mjs` | Discover possible Wikipedia pages for pending heritage leads | Discovery only; never treat output as verified |
| `node scripts/discover-heritage-metadata.mjs` | Refresh heritage metadata discovery output | Discovery only; review before applying changes |
| `node scripts/fetch-heritage-entities.mjs` | Fetch Wikidata metadata for mapped heritage candidates | Research refresh only; review before import |
| `node scripts/geocode-pending-heritage.mjs` | Geocode pending heritage candidates | Only with a documented geocoder/source and review plan |
| `node scripts/geocode-unmapped-heritage.mjs` | Find coordinates for unmapped heritage leads | Discovery only; coordinates require authority confirmation |
| `node scripts/fetch-district-boundaries.mjs` | Refresh district boundary research data | Only after checking source, licence and geometry quality |

Some historical importers use local source paths or optional network inputs.
They are research tooling, not deployment prerequisites. Inspect `--help` or
the first lines of a script before running it on a new machine. Never run an
importer against production MariaDB directly; commit and validate the seed
first.

For Internet Archive name research, follow
[`internet-archive-freedom-fighter-research.md`](internet-archive-freedom-fighter-research.md).
Add a discovered book as a `sources` record in Admin, then attach the printed
page locator to a person and its district association. `_djvu.txt` and HOCR
matches locate candidate pages only; they must not be imported directly as
verified people. The reviewed Admin save is permanent in MariaDB and reaches
the public static atlas through the normal approved export/release workflow.

## 4. Validate and persist the repository seed in MariaDB

With `.env` configured for the target database:

```sh
npm run validate:data
npm run db:migrate
npm run db:sync-dataset
```

`db:migrate` creates/updates schema tables. `db:sync-dataset` validates the
repository seed, merges missing stable IDs without deleting live records and
creates an immutable dataset revision. It is safe to rerun; it should not be
used as a substitute for reviewing a changed record.

For a fresh installation, create the database/user first, copy
`.env.example` to `.env`, then run the same three commands. If MariaDB reports
`ECONNREFUSED`, start/check MariaDB and the host/port. If it reports
`ER_ACCESS_DENIED_ERROR`, correct the database username/password/permissions;
rerunning the command cannot fix credentials.

## 5. Deploy an already committed release

From the server clone, the guarded updater performs the complete sequence:

```sh
sudo ./scripts/update-live.sh
```

It fast-forwards the selected branch, runs `npm ci`, `npm run check` (data
validation, tests and build), then `npm run db:migrate`,
`npm run db:sync-dataset`, restarts systemd and checks `/api/health`. It does
**not** run source import scripts, replace `.env`, change Nginx/TLS, or publish
the static GitHub Pages snapshot. Therefore the normal order is:

```text
local CSV/import → validate/test/build → commit and push
→ server update-live.sh → MariaDB migration + seed sync
→ (optional) reviewed static publication
```

If the update script refuses a dirty clone, preserve the server `.env` and
backups, then inspect `git status`. Only `.env.backup.*` files are ignored by
the updater; do not discard an unknown change without checking it.

## 6. Publish the static GitHub Pages edition

The static site is a deliberate, read-only release. After an administrator has
reviewed the latest MariaDB revision:

```sh
npm run publish:static
```

Then commit/push the generated publication through the normal GitHub Pages
workflow. MariaDB edits and reviewer work remain on the live server until the
next approved static publication.

## 7. Verify after any change

Minimum checks:

```sh
npm run validate:data
node --test
npm run build
git diff --check
```

For a live deployment also check:

```sh
curl --fail http://127.0.0.1:8787/api/health
sudo systemctl status karnataka-atlas --no-pager -l
```

Use Admin to confirm the collection count, source/citation links and review
state. For periodicals, the full rows are in `#admin` → **Periodicals /
ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಮಾಸಿಕೆಗಳು**; the public map intentionally shows grouped,
needs-review publication-place anchors rather than asserting exact offices.
