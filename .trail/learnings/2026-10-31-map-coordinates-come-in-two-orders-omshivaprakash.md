---
title: "Map coordinates come in two orders, and the big stylesheet is edited line by line"
author: Omshivaprakash
date: 2026-10-31
branch: fix/record-inspector-detail-panel
cost: { minutes: 6, tokens: 176353 }
id: l-d8d2a9c6
scope: repo
status: active
src: agent
touches:
  - src/App.jsx
  - src/RecordInspector.jsx
  - src/geography-nature.css
  - src/i18n.js
  - src/main.jsx
  - src/record-inspector.css
  - src/styles.css
  - test/release-readiness.test.js
---

## Decided
Event records expose coords as [lat,lng] for Leaflet, while place and relation GeoJSON stays [lng,lat]. Convert explicitly at the boundary instead of reusing one destructuring for both.

## Tried and ruled out
Treating event coords like place coordinates made person focus land in the Arctic (Ashoka zoomed to lat 76, lng 14).

## Watch out
styles.css is made of very long minified lines. A bad edit silently truncated the .detail-panel base rule, a map-only selector and the mobile stack rules; the BCE panel then merged with the map. After editing it, diff with --word-diff and look for deleted rules.

In the code: personStories in src/App.jsx (relatedPosition), src/styles.css (.detail-panel, .detail-panel-stack, .atlas-map-only-main).
