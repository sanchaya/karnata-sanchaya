# Atlas v0.22 — early Karnataka and regional-polity research wave

Updated: 2026-07-30

This milestone turns eight known gaps into linked, public research records. Visibility is not verification: every new record remains `needs-review` until its item-level evidence and bilingual interpretation pass independent review.

## Delivered

- A pre-Kadamba narrative lane connecting the Brahmagiri–Chandravalli archaeological sequence with the Karnataka Ashokan-edict network.
- A first-class Alupa coastal polity, Mangaluru–Udupi geography and Belmannu copper-plate research packet.
- Keladi–Ikkeri and Chitradurga Nayaka governance phases, political events, centres and deliberately schematic study envelopes.
- Seven reign anchors: Mayurasharma, Kakusthavarma, Durvinita, Sripurusha, Tailapa II, Someshvara I and Vikramaditya VI.
- Source locators for the 33 major rulers and historical figures that previously had empty citation arrays.
- Four territorial records upgraded from unsupported prototype interpretation to source-backed, medium-confidence historical scope. Their geometries remain explicitly schematic and retain the prototype-geometry citation.
- One candidate packet for each of the 22 districts that previously had only a district scope. Packets inherit the strongest existing audit lead, coordinate precision and provenance rather than manufacturing new certainty.
- Edition/manuscript witnesses for `Kavirajamarga`, `Vikramarjuna Vijaya`, `Adipurana`, `Gadayuddha` and `Vaddaradhane`.
- A statewide heritage follow-on pass: all 31 district packets now carry explicit contextual links to relevant places, polities, people and events. These links support exploration and do not assert construction, patronage or ownership.
- Twenty-five buildings absent from the existing Mysuru inventory were imported from the city heritage discovery list. They remain `research-lead` records with unverified designation status until building-specific authority evidence is found.
- Public heritage inventory filters now expose UNESCO, national, state, local, institutional, research-lead and unknown designation levels, plus district filtering and register identifiers.

## Promotion gates still open

1. Match Brahmagiri, Chandravalli and every Karnataka Ashokan stone to report pages, plates, readings and modern authority records.
2. Resolve the Alupa packet against South Kanara/Udupi inscription volumes: ruler, regnal year, plate count, findspot, text, translation and current custody.
3. Replace Keladi and Chitradurga study envelopes with dated inscription-, revenue- and gazetteer-supported administrative phases.
4. Verify each new reign against ruler-specific inscriptions; do not treat conventional chronology as an exact accession date.
5. Replace dynasty-level ruler citations with individual inscriptions, coins, charters or specialist biographical locators where available.
6. Reconstruct the four territory polygons from dated evidence points and competing scholarly maps; `medium` confidence applies to historical scope, not surveyed boundaries.
7. Resolve each district packet with authority-confirmed coordinates, protection/custody, dated field condition and site-specific sources.
8. Record repository shelfmarks for the five literary works and complete independent Kannada/English review before changing record review status.
9. Reconcile every national/state inventory ID directly against the current ASI or Karnataka authority register; list-derived records are not automatically authority-confirmed.
10. Resolve the 25 Mysuru building leads with building-specific coordinates, history, patron/architect evidence, ownership, condition and legal designation.

## Data implementation

The additions live in `src/data/research-wave-v022.js` and are applied before relationship generation. This keeps every new polity, event, reign, inscription, governance phase, district packet and literary witness available to the public static build, the admin collection editor and MariaDB revision workflow through the same normalized dataset.
