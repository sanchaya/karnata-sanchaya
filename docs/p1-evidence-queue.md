# P1 evidence queue

Updated: 2026-07-28

This is the working order for the next human evidence pass. It is intentionally separate from the bundled data: an item appearing here is a research task, not an authority-confirmed publication. The public atlas must keep every item at `needs-review` until the required evidence is independently checked and recorded against the stable ID.

## Queue order

| Order | Stable record | District | Current gate | Immediate review action |
| --- | --- | --- | --- | --- |
| 1 | `epigraphy-candidate-sannati-ashokan-edicts` | Kalaburagi | `translation-review` | Appoint an independent Kannada epigraphist; verify the line-aligned Kannada translation and obtain an authority-issued coordinate or document the unresolved boundary coordinate. |
| 2 | `epigraphy-candidate-maski-minor-rock-edict` | Raichur | `translation-review` | Complete independent Kannada review, obtain an authority/site coordinate, and add a dated whole-site condition photograph; the existing 2023 image is only a licensed close-up. |
| 3 | `epigraphy-candidate-hirehadagalli-copper-plates` | Ballari | `evidence-capture` | Reconcile findspot and repository, capture the corpus/page witness and transcription, then verify authority, condition and a licensed photograph. |
| 3 | `epigraphy-candidate-kodaganur-976` | Davanagere | `evidence-capture` | Capture the Epigraphia Carnatica XI no. 152 reading and translation, verify coordinates and present condition, and attach authority/photograph evidence. |
| 3 | `epigraphy-candidate-punisaraja-chamarajanagar-1117` | Chamarajanagar | `evidence-capture` | Identify the monument and exact stone, capture EC IV no. 83 text/translation, then verify coordinates, authority, condition and photograph. |
| 3 | `epigraphy-candidate-yusuf-adil-jami-mosque-1517` | Vijayapura | `evidence-capture` | Verify the present tablet location and monument identity, capture the Persian edition/text/translation, and document managing authority, condition and licensed image. |
| 3 | `epigraphy-candidate-shahapur-fort-1555` | Yadgir | `evidence-capture` | Reconcile the historic Gulbarga label with present Yadgir, verify the gateway coordinate and authority, and capture current condition and a licensed photograph. |

After these seven records, continue the remaining item-located candidates in the same order as the Evidence Workflow queue. District heritage records for Kolar, Tumakuru, Chikkamagaluru, Ballari, Raichur, Dharwad, Haveri and Davanagere remain the next parallel district batch.

## Publication gate

Each candidate requires all seven fields before promotion:

1. item-level edition and exact corpus locator;
2. authority-confirmed coordinates with precision and method;
3. line-by-line transcription;
4. source-matched English translation and independently reviewed Kannada translation;
5. dated present-condition observation;
6. protection status and managing authority;
7. dated, licensed photographs with a clear depiction statement.

The reviewer must record source identity, locator, date, licence and the six translation checks (`sourceMatch`, `semanticFidelity`, `namesAndDates`, `historicalTerminology`, `lineCompleteness`, `reviewerAttestation`). A researcher cannot approve their own submission. Metadata, OCR, Wikipedia and discovery portals can point to a task but cannot close a gate by themselves.

## Workflow use

Approved research accounts can open `#evidence`, choose **P1 · current evidence pass**, assign each task, set a due date and move it through `To do → In progress → Awaiting review → Complete`. Assignments are stored in MariaDB; the unauthenticated/static view is read-only. Do not change a candidate's publication status from `needs-review` until the evidence packet and independent review are present.
