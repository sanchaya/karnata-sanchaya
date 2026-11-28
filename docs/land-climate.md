# Land and climate: rain, temperature, and the crop data to come (`#climate`)

## What is built

The **Rain and climate** page (Nature menu; `src/ClimatePage.jsx`, data `public/data/climate/karnataka-districts.json`, script `scripts/import-nasa-power.mjs`, tests `test/climate.test.js`) shows, for each of the 31 districts, yearly and seasonal rainfall and mean maximum and minimum temperature for 1981 to 2024. Pick a year and a district: a district map coloured by how far that year's rain (yearly or one season) was above or below normal, season cards, temperature against normal, and a bar chart of all years. Normal is the 1991–2020 average; the classes (excess, normal, deficient, large deficient) use the India Meteorological Department's percentage limits. "Karnataka" is the plain average of the districts.

Refresh with `node scripts/import-nasa-power.mjs` (about a minute; set `POWER_END_YEAR` for the last full year). It needs the network and is not part of `npm run build` or the tests.

## What the numbers are, and are not

- **Source:** NASA POWER monthly point data, API v2.10.1, at the centre of each district (area-weighted centroid of the largest polygon). It is a **modelled** product on a grid about 0.5° (50 km) wide, **not** rain-gauge or IMD station records. Sanity checks: coast about 3,600 mm a year, Ghats districts 2,200–3,000, Bengaluru about 860, Ballari about 600, Bidar about 870.
- **Known weakness:** a coarse cell can pull a district near the Western Ghats toward the wet side (Mysuru reads about 1,750 mm, far above the city's own figure). The page says so. Do not use these values for local or farming decisions; use IMD and KSNDMC records for that.
- **Licence:** open, but NASA POWER asks for the credit line shown on the page (service, version, date accessed) and kindly asks to be told of uses and of redistribution. See `LICENSING.md` 3.14. **Owner action:** send the POWER team a short note about this use.

## Sources checked for the next step (28 November 2026)

Tested from the development Mac with plain HTTPS (no certificate bypass):

| Source | Reachable from here | Use |
|---|---|---|
| NASA POWER API | yes | in use |
| UPAg (upag.gov.in), IMD Pune (imdpune.gov.in), DES Karnataka (des.karnataka.gov.in), karnataka.data.gov.in, Agriculture Census (agcensus.da.gov.in) | home pages answer | need the specific tables and their licence terms read before importing |
| DA&FW data.desagri.gov.in and aps.dac.gov.in, ICRISAT data.icrisat.org/dld, KSNDMC (ksndmc.org), opendata.karnataka.gov.in | no answer | the owner can download the files in a browser and drop them in `src/data/imports/` |
| data.gov.in API | needs an API key | only the owner can create one |

The IMD gridded files (1901 on, NetCDF, 0.25° rain) are the proper next climate layer: they are observation-based and finer than NASA POWER. IMD asks for a data request and its terms limit redistribution, so confirm the terms before publishing derived values.

## Planned crop join (not built)

When the crop files arrive, import them as district-year-season records with a source and review status, keyed so they join to the climate series:

- **Keys:** `state_code` and `district_code` (LGD), `crop_year` (July–June), `season` (Kharif, Rabi, Summer, Whole year). Karnataka's district ids and `lgdCode` already exist in `public/karnataka-districts.geojson`.
- **Crop fields:** `crop`, `crop_category`, `area_ha`, `production_tonnes` (cotton in bales of 170 kg), `yield_kg_ha`, `irrigated_area_ha` and source of irrigation.
- **Climate fields per crop season:** seasonal rainfall and departure (already computed), rainy days (2.5 mm or more), longest dry spell, mean Tmax and Tmin, heat-stress days, growing degree days. The last four need daily data, so they wait for the IMD grids.
- **District changes:** Karnataka has gained districts since 1997 (Vijayanagara in 2021, Chikkaballapur, Ramanagara and others earlier). Older figures must be mapped to today's districts and marked approximate where a district split; ICRISAT's database has apportioned and unapportioned versions for exactly this.
- **Agro-climatic zones:** the ten Karnataka zones are a useful grouping, once a district-to-zone table with a source is in hand.
- Every file gets a row on the Licences page before anything derived from it is published.

## What the owner needs to do

1. Download DA&FW district-wise APY (crop area, production, yield) for Karnataka, and the ICRISAT district-level database if its terms allow reuse, and put them in `src/data/imports/`.
2. Send NASA POWER the courtesy note.
3. Decide whether to request IMD gridded data for research and what the licence allows.
