#!/usr/bin/env python3
"""Build the attributed, needs-review heritage inventory from Wikipedia list pages."""
import hashlib, json, math, re
from io import StringIO
from pathlib import Path
import pandas as pd
import requests

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/data/wikipedia-heritage-inventory.json'
HEADERS = {'User-Agent': 'KarnatakaHistoricalAtlas/0.19 research@sanchaya.net'}
BASE = 'https://en.wikipedia.org/wiki/'

pages = [
  ('chola-bengaluru','List_of_Chola_temples_in_Bengaluru','Chola temple'),
  ('vijayanagara-karnataka','List_of_Vijayanagara_era_temples_in_Karnataka','Temple'),
  ('hoysala','List_of_Hoysala_temples','Temple'),
  ('western-chalukya','Western_Chalukya_temples','Temple'),
  ('mysore-buildings','List_of_religious_buildings_and_structures_of_the_Kingdom_of_Mysore','Heritage'),
  ('state-i','List_of_State_Protected_Monuments_in_Karnataka','State protected monument'),
  ('state-ii','List_of_State_Protected_Monuments_in_Karnataka_Part_II','State protected monument'),
  ('national-bangalore','List_of_Monuments_of_National_Importance_in_Bangalore_circle','National monument'),
  ('national-belgaum','List_of_Monuments_of_National_Importance_in_Belgaum_district','National monument'),
  ('national-bidar','List_of_Monuments_of_National_Importance_in_Bidar_district','National monument'),
  ('national-bagalkot-bijapur','List_of_Monuments_of_National_Importance_in_Bagalkot_and_Bijapur_district,_Karnataka','National monument'),
  ('national-dharwad','List_of_Monuments_of_National_Importance_in_Dharwad_district','National monument'),
  ('national-gulbarga','List_of_Monuments_of_National_Importance_in_Gulbarga_district','National monument'),
  ('national-north-kanara','List_of_Monuments_of_National_Importance_in_North_Kanara_district','National monument'),
  ('national-raichur','List_of_Monuments_of_National_Importance_in_Raichur_district','National monument'),
]

def clean(value):
  if value is None or (isinstance(value,float) and math.isnan(value)): return ''
  return re.sub(r'\s+',' ',str(value)).strip()

def slug(value):
  base=(re.sub(r'[^a-z0-9]+','-',value.lower()).strip('-')[:54].rstrip('-') or 'record')
  return f"{base}-{hashlib.sha1(value.encode()).hexdigest()[:8]}"

def pick(row, *needles):
  for col in row.index:
    label=' '.join(map(str,col)) if isinstance(col,tuple) else str(col)
    if any(n.lower() in label.lower() for n in needles): return clean(row[col])
  return ''

def category_for(value):
  text=value.lower()
  if any(x in text for x in ['temple','devasthana','mandir','basadi','jinalaya']): return 'temple'
  if any(x in text for x in ['fort','kote','durga']): return 'fort'
  if any(x in text for x in ['mosque','masjid','dargah','tomb']): return 'islamic-heritage'
  if any(x in text for x in ['church','chapel','cathedral']): return 'church'
  if any(x in text for x in ['palace','mahal','residency','hall']): return 'palace-civic-architecture'
  if any(x in text for x in ['cave','rock','dolmen','mound','inscription']): return 'archaeological-landscape'
  return 'monument'

def date_from(value):
  years=[int(x) for x in re.findall(r'(?<!\d)(1[0-9]{3}|[3-9][0-9]{2})(?!\d)',value)]
  if years: return {'from':min(years),'to':max(years),'era':'CE','precision':'range' if len(set(years))>1 else 'circa'}
  century=re.search(r'(\d{1,2})(?:st|nd|rd|th) century',value,re.I)
  if century:
    c=int(century.group(1)); return {'from':(c-1)*100,'to':c*100-1,'era':'CE','precision':'century'}
  return None

def coordinates_from(value):
  nums=[]
  for part in re.findall(r'-?\d+(?:\.\d+)?',value):
    try: nums.append(float(part))
    except ValueError: pass
  if len(nums)>=2 and 8<=nums[0]<=20 and 70<=nums[1]<=82: return {'latitude':nums[0],'longitude':nums[1],'precision':'source-listed'}
  return None

records=[]
for source_key,page,default_kind in pages:
  url=BASE+page
  response=requests.get(url,headers=HEADERS,timeout=45); response.raise_for_status()
  try: tables=pd.read_html(StringIO(response.text))
  except ValueError: tables=[]
  for table_index,table in enumerate(tables):
    if len(table)<3: continue
    columns=' '.join(map(str,table.columns)).lower()
    if not any(token in columns for token in ['description','name','monument','temple','structure']): continue
    for row_index,row in table.iterrows():
      title=pick(row,'description','name of the structure','common name','name')
      if not title or title.lower() in ['nan','description','name']: continue
      location=pick(row,'location','locality','address')
      district=pick(row,'district') or ('Bengaluru Urban' if source_key=='chola-bengaluru' else '')
      period=pick(row,'timeline','period','year')
      registry=pick(row,'sl. no','sl.no','identifier','no.')
      coord_text=pick(row,'coordinates')
      key=f'{source_key}|{registry}|{title}|{location}|{district}'
      records.append({
        'id':f'heritage-inventory-{slug(key)}','name':{'en':title,'kn':title},'translationStatus':'pending',
        'recordKind':'inventory-lead','category':category_for(title+' '+default_kind),'district':{'en':district or 'District pending','kn':district or 'ಜಿಲ್ಲೆ ಪರಿಶೀಲನೆ ಬಾಕಿ'},
        'locationLabel':location,'date':date_from(period),'periodLabel':period,'coordinates':coordinates_from(coord_text),
        'registryId':registry,'protectionLevel':'state' if source_key.startswith('state-') else 'national' if source_key.startswith('national-') else 'research-lead',
        'sourceId':f'src-wikipedia-heritage-{source_key}','sourceUrl':url,'sourceTable':table_index+1,'sourceRow':row_index+1,
        'description':{'en':'Wikipedia list entry imported as a discovery record; authority, attribution, location and condition require item-level verification.','kn':'ವಿಕಿಪೀಡಿಯ ಪಟ್ಟಿಯಿಂದ ಅನ್ವೇಷಣಾ ದಾಖಲೆಯಾಗಿ ಆಮದು ಮಾಡಲಾಗಿದೆ; ಪ್ರಾಧಿಕಾರ, ಕಾಲ–ವಂಶ ಸಂಬಂಧ, ಸ್ಥಳ ಮತ್ತು ಸ್ಥಿತಿಗೆ ವಸ್ತುಮಟ್ಟದ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'},
        'citations':[{'sourceId':f'src-wikipedia-heritage-{source_key}','locator':f'Table {table_index+1}, row {row_index+1}; discovery lead only'}],
        'review':{'status':'needs-review','reviewer':None,'updatedAt':'2026-07-30'}
      })

# Exact duplicate rows occur where Wikipedia splits/transcludes registers.
unique={record['id']:record for record in records}
OUT.write_text(json.dumps(list(unique.values()),ensure_ascii=False,indent=2)+'\n')
print(f'Wrote {len(unique)} attributed research records to {OUT}')
