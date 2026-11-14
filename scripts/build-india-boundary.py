#!/usr/bin/env python3
"""Builds public/india-official-boundary.geojson: the official outer boundary of India for the Leaflet maps.

OpenStreetMap tiles draw Kashmir by the de facto lines. India's official map includes all of Jammu and Kashmir (with
Gilgit-Baltistan and Pakistan-administered Kashmir) and Ladakh (with Aksai Chin). This file has two features:
  kind "claimed"  the area India's official map includes that the standard Natural Earth boundary does not
                  (the app fills it with the land colour so the tile map's own border lines do not show through)
  kind "outline"  India's official outer boundary as lines
Both come from Natural Earth (public domain): the India point-of-view boundaries minus the standard ones.
Needs shapely (pip install shapely). Usage:
  python3 scripts/build-india-boundary.py ne_10m_admin_0_countries_ind.geojson ne_10m_admin_0_countries.geojson
"""
import json, sys
from shapely.geometry import shape, mapping, MultiLineString
from shapely.ops import unary_union

pov_file, std_file = sys.argv[1], sys.argv[2]
def india(path):
    data = json.load(open(path, encoding='utf8'))
    for f in data['features']:
        p = f['properties']
        if (p.get('ISO_A3_EH') or p.get('ADM0_A3')) == 'IND' or p.get('ADM0_A3') == 'IND':
            return shape(f['geometry']).buffer(0)
    raise SystemExit('India not found in ' + path)

pov, std = india(pov_file), india(std_file)
claimed = pov.difference(std.buffer(0.004))                  # a hair of tolerance so the two sources' coastlines do not leave slivers
claimed = unary_union([g for g in (claimed.geoms if hasattr(claimed, 'geoms') else [claimed]) if g.area > 0.05])   # drop slivers, keep Kashmir-sized pieces
claimed = claimed.simplify(0.01)
polys = pov.geoms if hasattr(pov, 'geoms') else [pov]
outline = MultiLineString([list(p.exterior.coords) for p in polys if p.area > 0.0005]).simplify(0.01)

def rounded(geom):
    m = json.loads(json.dumps(mapping(geom)))
    def r(c): return [round(c[0], 3), round(c[1], 3)] if isinstance(c[0], (int, float)) else [r(x) for x in c]
    m['coordinates'] = r(m['coordinates']); return m

out = {'type': 'FeatureCollection',
       'attribution': 'Natural Earth (public domain), India point of view',
       'features': [{'type': 'Feature', 'properties': {'kind': 'claimed'}, 'geometry': rounded(claimed)},
                    {'type': 'Feature', 'properties': {'kind': 'outline'}, 'geometry': rounded(outline)}]}
json.dump(out, open('public/india-official-boundary.geojson', 'w'), separators=(',', ':'))
b = claimed.bounds
print('claimed area bbox', [round(x, 1) for x in b], 'pieces', len(claimed.geoms) if hasattr(claimed, 'geoms') else 1, 'area deg2', round(claimed.area, 1))
