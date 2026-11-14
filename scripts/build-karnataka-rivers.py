#!/usr/bin/env python3
"""Builds public/karnataka-rivers.geojson: the courses of Karnataka's main rivers, from OpenStreetMap.

Data: © OpenStreetMap contributors, licensed under the Open Database Licence (ODbL, https://www.openstreetmap.org/copyright).
The output is a derived database and stays under the ODbL; the map shows the attribution. Segments of one river are merged by
name, clipped to Karnataka plus a 0.25 degree margin (so a river is seen entering and leaving), and simplified.

  curl -A "<your agent>" --data-urlencode data@scripts/data/karnataka-rivers.overpass \\
       https://overpass-api.de/api/interpreter -o overpass.json
  python3 scripts/build-karnataka-rivers.py overpass.json        # needs shapely
"""
import json, sys
from shapely.geometry import shape, LineString, MultiLineString, mapping
from shapely.ops import unary_union, linemerge

src = sys.argv[1] if len(sys.argv) > 1 else 'overpass.json'
# canonical English name -> (Kannada draft, basin)
RIVERS = {
  'Kaveri': ('ಕಾವೇರಿ', 'kaveri'), 'Hemavathi': ('ಹೇಮಾವತಿ', 'kaveri'), 'Kabini': ('ಕಬಿನಿ', 'kaveri'), 'Shimsha': ('ಶಿಂಷಾ', 'kaveri'),
  'Lakshmanatirtha': ('ಲಕ್ಷ್ಮಣತೀರ್ಥ', 'kaveri'), 'Nugu': ('ನುಗು', 'kaveri'), 'Harangi': ('ಹಾರಂಗಿ', 'kaveri'), 'Yagachi': ('ಯಗಚಿ', 'kaveri'),
  'Krishna': ('ಕೃಷ್ಣಾ', 'krishna'), 'Bhima': ('ಭೀಮಾ', 'krishna'), 'Tungabhadra': ('ತುಂಗಭದ್ರಾ', 'krishna'), 'Tunga': ('ತುಂಗಾ', 'krishna'),
  'Bhadra': ('ಭದ್ರಾ', 'krishna'), 'Malaprabha': ('ಮಲಪ್ರಭಾ', 'krishna'), 'Ghataprabha': ('ಘಟಪ್ರಭಾ', 'krishna'), 'Hiranyakeshi': ('ಹಿರಣ್ಯಕೇಶಿ', 'krishna'),
  'Vedaganga': ('ವೇದಗಂಗಾ', 'krishna'), 'Kagina': ('ಕಾಗಿಣಾ', 'krishna'), 'Mullamari': ('ಮುಲ್ಲಾಮಾರಿ', 'krishna'), 'Bennihalla': ('ಬೆಣ್ಣೆಹಳ್ಳ', 'krishna'), 'Hagari': ('ಹಗರಿ (ವೇದಾವತಿ)', 'krishna'),
  'Manjira': ('ಮಂಜೀರಾ', 'godavari'),
  'Pennar': ('ಪೆನ್ನಾರ್ (ಉತ್ತರ ಪಿನಾಕಿನಿ)', 'pennar-palar'), 'Palar': ('ಪಾಲಾರ್', 'pennar-palar'),
  'Kali': ('ಕಾಳಿ', 'west'), 'Aghanashini': ('ಅಘನಾಶಿನಿ', 'west'), 'Sharavathi': ('ಶರಾವತಿ', 'west'), 'Netravati': ('ನೇತ್ರಾವತಿ', 'west'),
  'Gurupura': ('ಗುರುಪುರ (ಫಲ್ಗುಣಿ)', 'west'), 'Varahi': ('ವರಾಹಿ', 'west'), 'Shambhavi': ('ಶಾಂಭವಿ', 'west'), 'Swarna': ('ಸ್ವರ್ಣಾ', 'west'),
  'Sita': ('ಸೀತಾ', 'west'), 'Chakra': ('ಚಕ್ರಾ', 'west'), 'Payaswini': ('ಪಯಸ್ವಿನಿ', 'west'), 'Kumaradhara': ('ಕುಮಾರಧಾರಾ', 'west'),
  'Yettinahole': ('ಎತ್ತಿನಹೊಳೆ', 'west'),
}
ALIAS = {'cauvery': 'Kaveri', 'kaveri river': 'Kaveri', 'hemavati': 'Hemavathi', 'hemavati river': 'Hemavathi', 'penna': 'Pennar', 'penna river': 'Pennar',
         'sharavati': 'Sharavathi', 'hiranyakeshi river': 'Hiranyakeshi', 'aghanashini river': 'Aghanashini', 'bhima river': 'Bhima', 'phalguni': 'Gurupura',
         'shambavi': 'Shambhavi', 'nethravathi': 'Netravati', 'tungabhadra river': 'Tungabhadra', 'krishna river': 'Krishna', 'kali river': 'Kali', 'cauvery river': 'Kaveri',
         'vedavathi': 'Hagari'}
def canon(tags):
    for key in ('name:en', 'name'):
        n = (tags.get(key) or '').strip()
        if not n: continue
        low = n.lower()
        if low in ALIAS: return ALIAS[low]
        for k in RIVERS:
            if low == k.lower(): return k
    return None

data = json.load(open(src, encoding='utf8'))
karnataka = unary_union([shape(f['geometry']).buffer(0) for f in json.load(open('public/karnataka-districts.geojson', encoding='utf8'))['features']]).buffer(0.25)
lines = {}
for el in data['elements']:
    name = canon(el.get('tags', {}))
    if name and el.get('geometry'):
        lines.setdefault(name, []).append(LineString([(p['lon'], p['lat']) for p in el['geometry']]))
features = []
for name, parts in sorted(lines.items()):
    joined = unary_union(parts)
    merged = linemerge(joined) if joined.geom_type == 'MultiLineString' else joined
    clipped = merged.intersection(karnataka)
    if clipped.is_empty or clipped.length < 0.15: continue          # under about 15 km inside Karnataka
    simple = clipped.simplify(0.004)
    geoms = [g for g in (simple.geoms if hasattr(simple, 'geoms') else [simple]) if g.geom_type == 'LineString' and g.length > 0.02]
    if not geoms: continue
    coords = [[[round(x, 3), round(y, 3)] for x, y in g.coords] for g in geoms]
    features.append({'type': 'Feature', 'properties': {'name': name, 'kn': RIVERS[name][0], 'basin': RIVERS[name][1]}, 'geometry': {'type': 'MultiLineString', 'coordinates': coords}})
out = {'type': 'FeatureCollection', 'attribution': '© OpenStreetMap contributors, ODbL', 'features': features}
json.dump(out, open('public/karnataka-rivers.geojson', 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print(len(features), 'rivers:', ', '.join(f['properties']['name'] for f in features))
