# Atlas v0.25 — People, Culture and Public Life

Atlas v0.25 introduces a review-first registry for poets, writers, visual artists, theatre practitioners, actors, directors, screenwriters and ministers. It deliberately separates Wikimedia discovery candidates from the curated `people` collection.

## Corpus

The reproducible Wikidata query in `scripts/import-wikimedia-people.mjs` selects humans with one of eight target occupations and a recorded birthplace whose `P131` administrative hierarchy reaches present-day Karnataka (`Q1185`). The snapshot retrieved on 2026-08-01 contains 905 unique people:

| Discovery role | Candidates |
| --- | ---: |
| Actor | 522 |
| Writer/author | 239 |
| Film director | 168 |
| Screenwriter | 105 |
| Poet | 104 |
| Artist | 14 |
| Theatre director | 3 |
| Minister | 2 |

Counts overlap because a person may have several roles. The low minister and theatre totals are a Wikidata modelling limitation, not evidence of historical scarcity. Ministers must later be expanded through position-held and legislature records; theatre must use academy, repertory and archival sources.

## Evidence policy

Every imported record is `needs-review` and `publicationReady: false`. Birth in present-day Karnataka does not by itself prove a Kannada contribution, and Wikidata/Wikipedia are discovery and identity-matching sources rather than final biographical authority.

Promotion into `people` requires independent review of identity, Karnataka/Kannada connection, bilingual name, life dates, roles, contributions and credits, authority citations, and image licence. Conflicting date claims are retained in `discovery.dateClaimConflict` instead of being rendered as a false life range.

## Public workflow

Open `#people` and choose **Wikimedia review candidates**. Search works across Kannada and English names, aliases, roles, birthplace and Wikidata ID. The directory loads 60 records at a time. To avoid an unreadable pile of settlement-centre markers, the map shows a candidate's provisional birthplace only after that candidate is selected.

Selecting **Add cited evidence for this person** opens the authenticated community contribution form with the stable candidate ID and record type prefilled. Contributors must supply a citation; submitted proposals enter the independent reviewer queue and karma workflow.

## Admin and MariaDB handoff

The 905-record import snapshot is retained at `server/seeds/wikimedia-people-candidates.json` as a reproducible installation seed. `npm run db:sync-dataset` merges missing stable IDs on the server and creates a permanent MariaDB revision without overwriting existing live records. Public pages, the People Explorer and Admin then read the same latest MariaDB revision.

Migration `006_dataset_system_revisions.sql` allows deployment-managed seed revisions to have no human editor while preserving the audit identity on every later Admin revision. Existing contribution, review, karma and audit tables handle candidate proposals.

## Refreshing the discovery snapshot

```bash
node scripts/import-wikimedia-people.mjs
npm run validate:data
node --test test/page-data-contract.test.js
npm run db:sync-dataset
```

Treat a changed count as a research diff. Review additions, removals and identity changes before committing a refreshed snapshot.
