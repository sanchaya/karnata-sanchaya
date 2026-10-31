---
title: "Desktop navigation: header activity switch opens that activity's first page, a bar lists its pages"
author: Omshivaprakash
date: 2026-10-31
branch: main
cost: { minutes: 1, tokens: 1692 }
id: l-03f07e42
scope: repo
status: active
replaces: l-3d443b27
src: agent
touches:
  - src/App.jsx
  - src/nav-activity.css
---

## Decided
Desktop keeps the activity menus (Explore, Research, India research, District Atlas, Project, Contribute) as a switch in the header corner. Clicking one opens its first page, because the user did not want to click the first bar item as a second step. The centred bar below lists that activity's pages with one-line hints so the product's coverage stays visible. Opening any page selects its activity; clicking the activity you are already in changes nothing, otherwise you would be thrown back to the first page while on a later one. Mobile keeps the grouped menu.

## Tried and ruled out
Two-level dropdown groups hid what the product covers. An earlier version only swapped the bar items on click, which the user rejected because it needed a second click.

## Watch out
Many page styles assume header 94px plus nav 48px (the 142px offset), so keep the activity bar 48px tall. The old portal nav is still in the DOM for mobile and hidden on desktop. Never add a blanket min-height to buttons: in flex-column lists it lets the rows shrink, and the people list rows then overlap.

In the code: activities, ACTIVITY_OF and NAV_HINTS in src/App.jsx; src/nav-activity.css.
