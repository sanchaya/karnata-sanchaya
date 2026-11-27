# Poster for students and teachers

`karnataka-atlas-poster-A3.pdf` (print, one A3 page, text stays sharp) and `karnataka-atlas-poster.png` (1123×1587, for screens and messaging) show the daily games, the three board games, the folk arts, food and old-games pages, the timeline, and what students and teachers get. The QR code is `public/karnata-qr.svg`.

- `poster.template.html` is the source; `poster.html` is the same page with the logo and QR code inlined. To change it, edit the template, rebuild `poster.html` (replace `{{LOGO}}` with `public/sanchaya-logo.png` as a data URI and `{{QR}}` with the SVG), open it at 1123 px wide and print to A3 with backgrounds on.
- The numbers are checked against the data (2,078 sources). Re-check any figure before reprinting.
- **The Kannada is a machine draft and needs a native speaker's proofreading before it is printed or posted.**
- The poster describes features that appear on the live site only after the server deploy.
