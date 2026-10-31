---
title: "Desktop navigation shows the picked activity's features, not dropdowns"
author: Omshivaprakash
date: 2026-10-31
branch: fix/record-inspector-detail-panel
cost: { minutes: 2, tokens: 42204 }
id: l-3d443b27
scope: repo
status: active
src: agent
touches:
  - src/App.jsx
---

## Decided
Desktop keeps the activity menus (Explore, Research, Districts, Project, Contribute) as a switch in the header corner. A left-aligned bar below shows the picked activity's features with one-line hints, so the app's coverage stays visible. Switching activity only swaps the bar items; opening a page selects its activity. Mobile keeps the grouped menu.

## Tried and ruled out
Two-level dropdown groups hid what the product covers, which is why they were replaced.

## Watch out
Many page styles assume header 94px plus nav 48px (the 142px offset), so keep the activity bar at 48px tall. The old portal nav still exists in the DOM for mobile and is hidden on desktop.

In the code: activities, ACTIVITY_OF and NAV_HINTS in src/App.jsx; src/nav-activity.css.
