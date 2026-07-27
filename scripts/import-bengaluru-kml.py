#!/usr/bin/env python3
"""Create a compact, review-only JS candidate catalogue from a Bengaluru KML export."""

import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {'k': 'http://www.opengis.net/kml/2.2'}


def clean(value):
    return re.sub(r'\s+', ' ', (value or '').strip()).strip()


def status_for(style):
    if '1556-FF5252' in style:
        return 'destroyed'
    if '1592-558B2F' in style or '1592-7CB342' in style:
        return 'intact'
    if '1594-' in style:
        return 'unresolved'
    return 'unresolved'


def main():
    if len(sys.argv) != 3:
        raise SystemExit('Usage: import-bengaluru-kml.py INPUT.kml OUTPUT.js')
    input_path, output_path = map(Path, sys.argv[1:])
    root = ET.parse(input_path).getroot()
    rows = {}
    for folder in root.findall('.//k:Folder', NS):
        folder_name = clean(folder.findtext('k:name', default='', namespaces=NS)) or 'Unfiled KML folder'
        for placemark in folder.findall('./k:Placemark', NS):
            if placemark.find('./k:Point', NS) is None:
                continue
            name = clean(placemark.findtext('k:name', default='', namespaces=NS)) or folder_name
            raw_coordinates = clean(placemark.findtext('.//k:coordinates', default='', namespaces=NS)).split(',')
            if len(raw_coordinates) < 2:
                continue
            try:
                longitude = round(float(raw_coordinates[0]), 7)
                latitude = round(float(raw_coordinates[1]), 7)
            except ValueError:
                continue
            style = clean(placemark.findtext('k:styleUrl', default='', namespaces=NS))
            kml_status = status_for(style)
            dedupe_key = (name, longitude, latitude, kml_status)
            if dedupe_key in rows:
                continue
            digest = hashlib.sha1('|'.join(map(str, dedupe_key)).encode('utf-8')).hexdigest()[:12]
            rows[dedupe_key] = {
                'id': f'bengaluru-kml-{digest}',
                'name': {'en': name, 'kn': ''},
                'place': {'en': name, 'kn': ''},
                'date': {'from': None, 'to': None, 'era': 'CE', 'precision': 'unknown'},
                'languages': [],
                'scripts': [],
                'coordinates': {'latitude': latitude, 'longitude': longitude, 'precision': 'approximate'},
                'evidenceKind': 'candidate',
                'districtAuditId': 'audit-bengaluru-region',
                'district': {'en': 'Historic Bengaluru region', 'kn': 'ಐತಿಹಾಸಿಕ ಬೆಂಗಳೂರು ಪ್ರದೇಶ'},
                'kmlFolder': folder_name,
                'kmlStatus': kml_status,
                'readiness': 'corpus-located',
                'citations': [{
                    'sourceId': 'src-kml-bengaluru-inscription-stones',
                    'locator': f'KML folder: {folder_name}; point {latitude:.7f}, {longitude:.7f}',
                }],
                'researchNote': {
                    'en': 'Source-derived KML candidate. Confirm identity, exact site, inscription text, date, authority and present condition before promotion.',
                    'kn': 'ಆಕರದಿಂದ ಪಡೆದ KML ಅಭ್ಯರ್ಥಿ. ಪ್ರಕಟಿಸುವ ಮೊದಲು ಗುರುತು, ನಿಖರ ತಾಣ, ಶಾಸನ ಪಾಠ, ದಿನಾಂಕ, ಪ್ರಾಧಿಕಾರ ಮತ್ತು ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯನ್ನು ದೃಢೀಕರಿಸಬೇಕು.',
                },
                'review': {'status': 'needs-review', 'reviewer': None, 'updatedAt': '2026-07-27'},
            }

    records = sorted(rows.values(), key=lambda item: (item['kmlFolder'], item['name']['en'], item['id']))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        '/* Generated from the supplied Bengaluru KML. These are review-only candidates. */\n'
        f'export const bengaluruKmlCandidates = {json.dumps(records, ensure_ascii=False, indent=2)}\n',
        encoding='utf-8',
    )
    print(f'Generated {len(records)} deduplicated Bengaluru KML candidates from {input_path}')


if __name__ == '__main__':
    main()
