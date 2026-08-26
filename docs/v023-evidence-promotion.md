# Atlas v0.23 — evidence promotion sprint

Updated: 2026-08-26

This milestone converts the P1 inscription queue into seven publication packets. It does not replace fieldwork or independent review. A record remains `needs-review` until all seven evidence gates are verified and a reviewer other than the contributor records the decision.

## First implementation

- The public evidence workflow now opens with a focused seven-record promotion dashboard.
- Every card shows the same mandatory gates: item edition, authority coordinate, line transcription, independent Kannada review, dated present condition, protection/managing authority and licensed photographs.
- Each card derives its status and counts directly from the normalized candidate record; it does not maintain a second browser-only checklist.
- Researchers can narrow the permanent MariaDB task board to the outstanding requests for one packet.
- Maski and Sannati remain in `translation-review`; no software action can manufacture the required independent attestation.

## Reviewer operations added after v0.23

The `#evidence` page now includes a reviewer operations panel above the permanent task board:

- reviewer dashboard: counts awaiting review, overdue tasks, blocking tasks and completed tasks by reviewer;
- ready-for-promotion queue: ranks the seven current promotion packets by remaining blockers;
- independent reviewer field and review note on every assignment;
- saved assignment status history from MariaDB.

This panel helps coordinate work, but it does not publish records. A completed task is evidence that the workflow item was handled. Promotion still requires the historical record itself to have all gates verified, an independent reviewer decision, validation and inclusion in an approved static release.

## Source-citation gate added on 2026-08-26

Reviewers previously saw only a status, an assignee/reviewer name and a free-text review note per task — the underlying source material a contributor was relying on was never captured or shown, so there was nothing to independently check against. Every evidence task now carries its own permanent citation list:

- A task card shows every attached source as a clickable link (title, URL, page/locator, and who added it) directly beneath its required-fields list, so a reviewer can confirm the material before approving.
- An approved contributor, reviewer or administrator can add a citation from the same card; each addition is a new permanent MariaDB row and never replaces or removes a citation added earlier, so the reference trail only grows.
- The server refuses to move a task to `awaiting-review` or `complete` until it has at least one citation, alongside the existing independent-reviewer requirement.

This closes a real gap in the workflow, but it does not change the completion rule below: a citation being present is not the same as a source being verified.

## Current readiness

| Candidate | Verified gates | Open gates | Immediate action |
| --- | ---: | --- | --- |
| Sannati Ashokan edicts | 5/7 | authority coordinate; Kannada review | Record an authority/signed-survey coordinate and appoint an independent Kannada epigraphist. |
| Maski Minor Rock Edict | 4/7 | authority coordinate; Kannada review; dated whole-site condition | Obtain a signed site survey and reusable whole-site photographs, then complete independent Kannada review. |
| Hirehadagalli copper plates | 1/7 | six gates | Reconcile findspot and custody, then capture the complete item text and present museum condition. |
| Kodaganur 976 record | 1/7 | six gates | Capture EC XI no. 152 from the page image and verify the surviving stone. |
| Punisaraja 1117 record | 1/7 | six gates | Identify the exact stone and capture EC IV no. 83 text and translation. |
| Yusuf Adil Jami Mosque tablet | 1/7 | six gates | Confirm the tablet, Persian edition, authority and present condition. |
| Shahapur Fort 1555 record | 1/7 | six gates | Resolve the gateway item, present district identity and authority evidence. |

## Completion rule

An assignment marked complete means the requested material was submitted and independently reviewed in the task workflow. Promotion additionally requires source and item identity checks, an independently approved Kannada interpretation, evidence dates and licences, validation, a permanent MariaDB dataset revision and deliberate inclusion in an approved static release.

For the newer coin, genealogy, boundary, manuscript and inscription-edition maturity queues, use [`p2-p3-corpus-maturity.md`](p2-p3-corpus-maturity.md).
