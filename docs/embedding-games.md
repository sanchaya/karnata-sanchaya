# Embedding the games on other portals

Any Aata-Paata game can be shown inside another site with an iframe. Open the games page, pick a game, and use **Embed this game on your site** under it: it gives a ready iframe and a copy button. Free for non-commercial use; the credit link under the game must stay.

```html
<iframe src="https://karnata.sanchaya.net/?embed=1&lang=en&game=word#aata-paata"
  title="Karnataka Historical Atlas · Aata-Paata" width="100%" height="720"
  style="border:0;max-width:960px" loading="lazy" allow="clipboard-write"></iframe>
```

| Parameter | Values | Effect |
|---|---|---|
| `embed=1` | required | Shows only the game: a slim Sanchaya header (logo, title, subtitle, **Contact us** link to the atlas contact page) instead of the site menu, plus a "more games" link under the game. The frame is marked `noindex`. |
| `game` | `word`, `year`, `crossword`, `where`, `who`, `script`, `bird`, `worksheet` | Pins one game and hides the game tabs. Leave it out to let players switch between games. |
| `lang` | `kn`, `en` | Language of the frame (default: the visitor's saved choice, else Kannada). |
| `puzzle` | `YYYY-MM-DD` | Opens that day's puzzle from the archive. |

Use a height of about 720 px (taller for the crossword and worksheet). Progress stays in the player's browser for the embedding site's own frame; nothing is sent to us.

## Which host to embed from

- **Live site (karnata.sanchaya.net):** the server answers `/?embed=1` with `frame-ancestors *` and no `X-Frame-Options`; every other page is still unframeable (`DENY` / `frame-ancestors 'none'`). To limit which portals may frame it, set `EMBED_ANCESTORS` in the server environment to a space-separated list, for example `EMBED_ANCESTORS="https://school.example https://*.example.org"`.
- **Static edition (try-karnata.sanchaya.net, GitHub Pages):** sends no framing restriction, so it works with no change.
- Cloudflare must not add its own `X-Frame-Options` to `/?embed=1`; if a portal reports "refused to connect", check Cloudflare response header rules first.

## Files

`src/App.jsx` (the `embed` switch and `lang`), `src/AataPaata.jsx` (compact layout, credit link, `EmbedBuilder`), `src/aata-paata-layout.css`, and the header rule in `server/app.js`.
