#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

const output=new URL('../src/data/bidar-bksp.generated.js',import.meta.url)
const collection='ServantsOfKnowledge'
const review={status:'needs-review',reviewer:null,updatedAt:new Date().toISOString().slice(0,10)}
const n=(en,kn)=>({en,kn})
const normaliseArray=value=>Array.isArray(value)?value:value?[value]:[]
const slug=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const fileUrl=(identifier,name)=>`https://archive.org/download/${identifier}/${encodeURIComponent(name)}`
const kannadaDigits={'೦':'0','೧':'1','೨':'2','೩':'3','೪':'4','೫':'5','೬':'6','೭':'7','೮':'8','೯':'9'}
const asciiDigits=value=>String(value).replace(/[೦-೯]/g,digit=>kannadaDigits[digit])

const catalogue={
  'bksp.anubhavamantapac0000basa':{id:'src-bksp-anubhava-mantapa-2006',kn:'ಅನುಭವ ಮಂಟಪ — ಚಾರಿತ್ರಿಕ ಹಿನ್ನೆಲೆಗಳು'},
  'bksp.gurimuttiguruvad0000drba':{id:'src-bksp-gurubasavadevaru-2016',kn:'ಗುರು ಮುಟ್ಟಿ ಗುರುವಾದವರು ಪೂಜ್ಯಶ್ರೀ ಗುರುಬಸವದೇವರು'},
  'bksp.havasegallinapat0000drve':{id:'src-bksp-shivaswamy-cheenakeri-2021',kn:'ಹಾವಸೆಗಲ್ಲಿನ ಪಥಿಕ ಶಿವಸ್ವಾಮಿ ಚೀನಕೇರಿ'},
  'bksp.huttuhoratagarav0000panc':{id:'src-bksp-vn-patil-2020',kn:'ಹುಟ್ಟು ಹೋರಾಟಗಾರ ವಿ. ಎನ್. ಪಾಟೀಲ'},
  'bksp.janaparakalajiya0000suni':{id:'src-bksp-guramma-siddareddy-2020',kn:'ಜನಪರ ಕಾಳಜಿಯ ಗುರಮ್ಮ ಸಿದ್ದಾರೆಡ್ಡಿ'},
  'bksp.kalashrivirupaks0000mani':{id:'src-bksp-virupakshayya-gorata-2020',kn:'ಕಲಾಶ್ರೀ ವಿರೂಪಾಕ್ಷಯ್ಯ ಗೋರಟಾ'},
  'bksp.kannadapattaddev0000vija':{id:'src-bksp-channabasava-pattadevaru-2020',kn:'ಕನ್ನಡದ ಪಟ್ಟದ್ದೇವರು ಡಾ. ಚನ್ನಬಸವ ಪಟ್ಟದ್ದೇವರು'},
  'bksp.kunchakaleyasant0000ning':{id:'src-bksp-chabhi-somashetty-2020',kn:'ಕುಂಚ ಕಲೆಯ ಸಂತ ಶ್ರೀ ಚ. ಭೀ. ಸೋಮಶೆಟ್ಟಿ'},
  'bksp.lokanayakabheema0000drra':{id:'src-bksp-bheemanna-khandre-2019',kn:'ಲೋಕನಾಯಕ ಡಾ. ಭೀಮಣ್ಣ ಖಂಡ್ರೆ'},
  'bksp.shikshanachintak0000vidy':{id:'src-bksp-shikshana-chintaka-ashtoor-2021',kn:'ಶಿಕ್ಷಣ ಚಿಂತಕ ಡಾ. ಬಸವರಾಜ ಜಿ. ಪಾಟೀಲ ಅಷ್ಟೂರ'},
  'bksp.shikshanasiridrp0000drra':{id:'src-bksp-poornima-g-2019',kn:'ಶಿಕ್ಷಣ ಸಿರಿ ಡಾ. ಪೂರ್ಣಿಮಾ ಜಿ.'},
}

const signals=[
  ['bidar','ಬೀದರ','ಬೀದರ್','bidar'],['bhalki','ಭಾಲ್ಕಿ','bhalki'],['basavakalyana','ಬಸವಕಲ್ಯಾಣ','basavakalyan'],
  ['kamalnagar','ಕಮಲನಗರ','kamalnagar'],['gorata','ಗೋರಟ','gorata'],['hyderabad-liberation','ವಿಮೋಚನೆ','liberation'],
  ['kannada-education','ಕನ್ನಡ ಶಾಲೆ','ಕನ್ನಡ ಶಿಕ್ಷಣ'],['anubhava-mantapa','ಅನುಭವ ಮಂಟಪ'],['razakar','ರಜಾಕಾರ'],
]

const signalMatches=text=>{
  const lines=text.split(/\r?\n/)
  return signals.map(([id,...terms])=>{
    const indexes=[]
    lines.forEach((line,index)=>{if(terms.some(term=>line.toLocaleLowerCase().includes(term.toLocaleLowerCase())))indexes.push(index+1)})
    return indexes.length?{id,count:indexes.length,firstOcrLine:indexes[0]}:null
  }).filter(Boolean)
}

const publicationYear=(metadata,text)=>{
  const direct=Number(metadata.year||String(metadata.date||'').slice(0,4))
  if(Number.isFinite(direct)&&direct>1800&&direct<2100)return direct
  const head=asciiDigits(text.slice(0,12000))
  const match=head.match(/(?:ಪ್ರಥಮ|ಪಥಮ|ಪ್ರಕಟಣೆ)[^\n]{0,80}?((?:19|20)\d{2})/)
  return match?Number(match[1]):null
}

async function fetchJson(url){
  const response=await fetch(url,{headers:{'User-Agent':'karnata-sanchaya-bksp-import/0.1'},signal:AbortSignal.timeout(30000)})
  if(!response.ok)throw new Error(`${response.status} ${response.statusText}: ${url}`)
  return response.json()
}

async function previousSources(){
  if(!existsSync(output))return new Map()
  const module=await import(`${output.href}?t=${Date.now()}`)
  return new Map((module.bidarBkspSources||[]).map(source=>[source.repository?.identifier,source]))
}

const previous=await previousSources()
const params=new URLSearchParams({q:`collection:${collection} AND identifier:bksp.*`,rows:'200',page:'1',output:'json'})
for(const field of ['identifier','title','creator','date','year','publisher'])params.append('fl[]',field)
const search=await fetchJson(`https://archive.org/advancedsearch.php?${params}`)
const identifiers=[...new Set([...(search.response?.docs||[]).map(item=>item.identifier),...previous.keys()])].filter(id=>catalogue[id]).sort()
const sources=[]

for(const identifier of identifiers){
  try{
    const item=await fetchJson(`https://archive.org/metadata/${identifier}`)
    const metadata=item.metadata||{}
    const textFile=(item.files||[]).find(file=>/_djvu\.txt$/i.test(file.name))
    if(!textFile)throw new Error('No DjVuTXT derivative')
    const response=await fetch(fileUrl(identifier,textFile.name),{headers:{'User-Agent':'karnata-sanchaya-bksp-import/0.1'},signal:AbortSignal.timeout(60000)})
    if(!response.ok)throw new Error(`${response.status} fetching OCR`)
    const text=await response.text()
    const pdfFile=(item.files||[]).find(file=>file.format==='Text PDF'||/\.pdf$/i.test(file.name))
    const entry=catalogue[identifier]
    sources.push({
      id:entry.id,
      type:'digitised-local-history-volume',
      title:n(String(metadata.title||identifier).trim(),entry.kn),
      authors:normaliseArray(metadata.creator).map(String),
      publisher:String(metadata.publisher||'Bidar Kannada Sahitya Parishat'),
      year:publicationYear(metadata,text),
      url:`https://archive.org/details/${identifier}`,
      scanUrl:pdfFile?fileUrl(identifier,pdfFile.name):null,
      ocrUrl:fileUrl(identifier,textFile.name),
      repository:{platform:'Internet Archive',collectionId:collection,identifier,fullTextUrl:fileUrl(identifier,textFile.name)},
      contentReview:{status:'ocr-screened',accessedAt:review.updatedAt,textFile:textFile.name,ocrLineCount:text.split(/\r?\n/).length,signals:signalMatches(text),note:n('OCR has been screened for Bidar research discovery. Verify every claim against the printed page image and an independent source before promotion.','ಬೀದರ್ ಸಂಶೋಧನಾ ಅನ್ವೇಷಣೆಗಾಗಿ OCR ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಉತ್ತೇಜನಕ್ಕೂ ಮೊದಲು ಪ್ರತಿಯೊಂದು ಹೇಳಿಕೆಯನ್ನು ಮುದ್ರಿತ ಪುಟಚಿತ್ರ ಮತ್ತು ಸ್ವತಂತ್ರ ಆಕರದೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.')},
      scope:n('Bidar District Kannada Sahitya Parishat publication preserved as a local-history discovery source.','ಸ್ಥಳೀಯ ಇತಿಹಾಸದ ಅನ್ವೇಷಣಾ ಆಕರವಾಗಿ ಉಳಿಸಲಾದ ಬೀದರ್ ಜಿಲ್ಲಾ ಕನ್ನಡ ಸಾಹಿತ್ಯ ಪರಿಷತ್ತಿನ ಪ್ರಕಟಣೆ.'),
      review:{...review},
    })
  }catch(error){
    const fallback=previous.get(identifier)
    if(fallback){sources.push(fallback);console.warn(`Carried over ${identifier}: ${error.message}`)}
    else console.warn(`Skipped ${identifier}: ${error.message}`)
  }
}

const generated=`// Generated by scripts/import-bidar-bksp.mjs from ServantsOfKnowledge metadata and OCR derivatives.\n// OCR signals are discovery aids only; curated claims require page-image and independent-source review.\nexport const bidarBkspSources = ${JSON.stringify(sources,null,2)}\n`
await writeFile(output,generated)
console.log(`Generated ${sources.length} BKSP source records in ${output.pathname}`)
