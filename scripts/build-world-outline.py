#!/usr/bin/env python3
"""Builds src/data/species/world-countries.json for the migration globe from Natural Earth's 10 m country boundaries drawn
from India's point of view (ne_10m_admin_0_countries_ind: India shown with all of Jammu and Kashmir, including
Gilgit-Baltistan, and Ladakh, including Aksai Chin, as on the official map of India; Pakistan and China are drawn to match).
Natural Earth is in the public domain. The file is simplified for a small globe: coordinates rounded to 2 decimals, lines
thinned with Douglas-Peucker (finer around India and its neighbours), tiny islands dropped.

  curl -L -o ne_10m_admin_0_countries_ind.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries_ind.geojson
  python3 scripts/build-world-outline.py ne_10m_admin_0_countries_ind.geojson
"""
import json, math, sys

src = sys.argv[1] if len(sys.argv) > 1 else 'ne_10m_admin_0_countries_ind.geojson'
out = 'src/data/species/world-countries.json'
NEAR = {'IND', 'PAK', 'CHN', 'NPL', 'BTN', 'BGD', 'MMR', 'LKA', 'AFG', 'MDV'}

def rdp(points, eps):
    if len(points) < 3: return points
    keep = [False] * len(points); keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = points[a], points[b]
        dx, dy = x2 - x1, y2 - y1; norm = math.hypot(dx, dy)
        far, idx = 0, None
        for i in range(a + 1, b):
            x, y = points[i]
            d = math.hypot(x - x1, y - y1) if norm == 0 else abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm
            if d > far: far, idx = d, i
        if idx is not None and far > eps:
            keep[idx] = True; stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(points, keep) if k]

def bbox_area(ring):
    xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
    return (max(xs) - min(xs)) * (max(ys) - min(ys))

data = json.load(open(src, encoding='utf8'))
countries = []
for i, f in enumerate(data['features']):
    p = f['properties']; iso3 = p.get('ISO_A3_EH') or p.get('ADM0_A3')
    try: num = int(p.get('ISO_N3_EH'))
    except (TypeError, ValueError): num = -1
    if num <= 0: num = -(i + 1)               # no ISO number (e.g. disputed or unrecognised): never matches a flyway country
    g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    near = iso3 in NEAR
    eps = 0.03 if near else 0.1
    biggest = max(polys, key=lambda poly: bbox_area(poly[0]))
    kept = []
    for poly in polys:
        if poly is not biggest and bbox_area(poly[0]) < (0.004 if iso3 == 'IND' else 0.35): continue
        rings = []
        for k, ring in enumerate(poly):
            simple = rdp([(round(x, 2), round(y, 2)) for x, y in ring], eps)
            if len(simple) >= 4 and (k == 0 or bbox_area(simple) > eps * eps * 4):
                rings.append([c for pt in simple for c in pt])
        if rings: kept.append(rings)
    countries.append({'id': num, 'name': p['NAME'], 'polygons': kept})
json.dump({'source': 'Natural Earth 10m admin 0 countries, India point of view (public domain)', 'countries': countries}, open(out, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print(len(countries), 'countries ->', out)
