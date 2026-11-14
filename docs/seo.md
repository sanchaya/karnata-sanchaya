# Search engine optimisation and indexing

## What was wrong (audit, November 2026)

- **One indexable URL.** The portal is a single-page app that switches pages with `/#species`. Search engines ignore the part
  after `#`, so only the home page could be indexed, never `/species`, `/geography` or any single species.
- **No sitemap on the live site** (`karnata.sanchaya.net/sitemap.xml` was a 404). Only the GitHub Pages mirror had one, built
  for the mirror's own address.
- **Duplicate site.** The Pages mirror (`try-karnata.sanchaya.net`) declared itself canonical, so it competed with the main
  site for the same content.
- **Soft 404s.** The live server answered *every* unknown path with the app and status 200, which search engines read as
  "this site has endless thin pages".
- **Weak link previews.** `og:image` was a relative URL to a small square logo, and the Twitter card was `summary`.
- Cloudflare's managed `robots.txt` blocks, besides AI-training crawlers, **Baiduspider and PetalBot** (Baidu and Huawei search).
  Google, Bing, Yandex, DuckDuckGo (uses Bing), Yahoo, Ecosia and Brave are allowed (`Allow: /`, `Content-Signal: search=yes`).

## What the build does now

`npm run build` runs `scripts/prerender-pages.mjs` after `vite build`. It turns the app's `index.html` into:

| Pages | Count | Content |
|---|---|---|
| Home `/` | 1 | absolute canonical, Open Graph and JSON-LD URLs |
| Section landing pages `/species/`, `/geography/`, `/migration/`, `/aata-paata/` ... | 32 | the app's own bilingual title and description (`src/seo-pages.js`), `WebPage` and `BreadcrumbList` JSON-LD, a plain-HTML summary with links to every section |
| Species pages `/species/<scientific-name>/` | 2,556 | Kannada and English names, family, seasonality, photo with licence and credit, `Taxon` JSON-LD, link into the app |

Pages needing an account (`profile`, `reviews`, `operations`, `evidence`, `research-tasks`) are not generated. Each page has
one `<link rel="canonical">` on the main site, `og:` and `twitter:` tags, and `dist/sitemap.xml` lists them all (2,590 URLs;
the limit is 50,000).

A human who opens `/species/pavo-cristatus/` loads the same app: `public/route-boot.js` runs first and moves the address to
`/?species=<id>#species`, which opens the species view. Crawlers get the static HTML immediately and the rendered app too.
The static text is equivalent to what the app shows, so this is not cloaking.

- **Mirror build** (`VITE_STATIC_DATASET=true`, GitHub Pages): pages get canonicals pointing at the main site and no sitemap, so
  the two sites no longer compete. Set `CANONICAL_SITE_URL` to change the canonical host (default `https://karnata.sanchaya.net/`).
- **Server** (`server/app.js`): serves the prerendered folders (`/species/`), and returns a real **404** for any other unknown
  path (the app shell is still sent so a mistyped link lands in the app).
- **Preview image:** `public/og-image.png` (1200x630), Twitter `summary_large_image`. Species pages use the species photo.
- **robots.txt** (`scripts/generate-seo.mjs`): welcomes search crawlers, keeps the AI-training crawler blocks (a project
  decision) and points to the sitemap. Cloudflare's managed block is added on top of it at the edge.

Adding a new page: add its entry to `src/seo-pages.js` (also used for `document.title`) and it appears in the prerender and
the sitemap on the next build.

## What you need to do (needs your accounts)

1. **Deploy** the new build to both sites, then purge Cloudflare for `/`, `/index.html`, `/sw.js`, `/sitemap.xml`, `/robots.txt`.
   Check `https://karnata.sanchaya.net/sitemap.xml` and `.../species/pavo-cristatus/` load.
2. **Google Search Console** (google.com/search-console): add the property `karnata.sanchaya.net` (a **Domain** property
   verified by a DNS TXT record in Cloudflare is the most robust; or set `GOOGLE_SITE_VERIFICATION` at build time and
   redeploy), then *Sitemaps* > add `sitemap.xml`. Use *URL inspection > Request indexing* for the home page and a few section
   pages. Google no longer accepts sitemap "pings", and does not use IndexNow, so this step is manual. Expect days to weeks for
   thousands of species pages to appear.
3. **Bing Webmaster Tools** (bing.com/webmasters): *Import from Google Search Console* (one click), or verify with
   `BING_SITE_VERIFICATION`, then submit the sitemap. Bing also feeds **DuckDuckGo, Yahoo and Ecosia**.
4. **IndexNow** (Bing, Yandex, Naver, Seznam, Yep): the key file `public/d882287ffd3909c420c939eaef856b36.txt` is part of the
   site. After deploying, run `node scripts/indexnow.mjs` (a dry run that prints what it would send), then
   `node scripts/indexnow.mjs --yes` to submit every URL. This contacts an outside service, so it is not run automatically.
5. **Yandex Webmaster** and **Naver Search Advisor** (optional, set `YANDEX_SITE_VERIFICATION` / `NAVER_SITE_VERIFICATION`),
   and Brave's *Submit a site* form if you want Brave Search.
6. **Baidu and Huawei Petal** are blocked by Cloudflare's managed `robots.txt` (Cloudflare dashboard > Security > Bots >
   *Block AI bots / managed robots.txt*). If you want those engines, allow them there; Baidu also needs a Baidu Webmaster
   account, and its crawler is slow outside China.
7. Re-submit after big content changes (new species, new pages) by redeploying and running the IndexNow command again.

Verification tokens are read at build time from `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`,
`YANDEX_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION` and written as `<meta>` tags on every page.

## Known limits and next steps

- **Bundle size.** The home page's JavaScript is about 10 MB (1.1 MB gzipped) because the whole dataset ships in the main
  chunk. Googlebot can render it but slowly; this hurts Core Web Vitals and mobile rankings. The biggest SEO win after this
  work is splitting the dataset out of the main bundle (load collections per page) and checking PageSpeed Insights.
- **Kannada text** on the new landing-page descriptions is a draft and needs a native proofread; species Kannada names are
  labelled "awaiting review" on the pages. Wrong names that get indexed spread, so review names before pushing them hard.
- **Language.** Pages are bilingual in one URL (Kannada first). Separate `/en/` and `/kn/` URLs with `hreflang` would let
  English searches show English titles; not done.
- **Other content** (inscriptions, people, monuments) is still only in the app's data, not in static pages. The same
  prerender approach can add `/inscriptions/<id>/` or `/people/<id>/` pages when their text is reviewed enough to publish.
- **Content signals / `noai`:** the `noai, noimageai` robots meta and the AI-crawler blocks stay, as decided. They do not
  affect Google or Bing search ranking.
- **Measure:** watch *Pages* and *Sitemaps* in Search Console, and the visitor statistics (`docs/visitor-stats.md`) for
  landing-page visits (`view` = species, migration ...).
