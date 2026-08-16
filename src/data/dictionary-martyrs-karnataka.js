import inventory from './dictionary-martyrs-karnataka.json' with { type:'json' }

const slug=value=>String(value||'candidate').normalize('NFKD').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'candidate'
const sourceId=inventory.meta.sourceId

export const dictionaryMartyrCandidateMeta={
  ...inventory.meta,
  candidateCount:inventory.records.length,
}

export const dictionaryMartyrCandidates=inventory.records.map(record=>({
  id:`martyr-candidate-v5-p${record.printedPageFrom}-${slug(record.name)}-l${record.sourceLine}`,
  name:{en:record.name,kn:''},
  aliases:{en:[],kn:[]},
  roles:['freedom-fighter'],
  candidateKind:'dictionary-martyr',
  relationship:record.relationship,
  districtText:record.districtText,
  sourceEntry:{
    printedPageFrom:record.printedPageFrom,
    printedPageTo:record.printedPageTo,
    sourceLine:record.sourceLine,
    archivalReference:record.archivalReference,
  },
  ...(record.historicalConnection?{historicalConnection:{...record.historicalConnection,placeLeads:record.districtText}}:{}),
  date:record.historicalConnection?.years?.length?{
    from:record.historicalConnection.years[0],
    to:record.historicalConnection.years.at(-1),
    era:'CE',
    precision:record.historicalConnection.years.length===1?'year':'range',
  }:{from:null,to:null,era:'CE',precision:'unknown'},
  ...(record.historicalConnection?.years?.length?{dateInterpretation:'historical-connection-window-not-life-dates'}:{}),
  citations:[{
    sourceId,
    locator:`Entry “${record.name}”; printed p. ${record.printedPageFrom}${record.printedPageTo!==record.printedPageFrom?`–${record.printedPageTo}`:''}${record.archivalReference?`; archival reference: ${record.archivalReference}`:''}`,
  }],
  discovery:{
    method:'rule-based-volume-5-ocr-extraction',
    scope:'Karnataka-linked dictionary entry; verify the page image, identity, Karnataka relationship and archival reference before promotion.',
    retrievedAt:inventory.meta.extractedAt,
    publicationReady:false,
  },
  reviewWorkflow:{
    target:'curated-person-record',
    status:'candidate-intake',
    evidence:{
      identity:{status:'unresolved'},
      karnatakaConnection:{status:record.relationship==='karnataka-origin-or-residence'?'located':'provisional'},
      bilingualName:{status:'unresolved'},
      district:{status:record.districtText.length?'provisional':'unresolved'},
      lifeDates:{status:'unresolved'},
      roles:{status:'provisional'},
      contributions:{status:'unresolved'},
      authorityCitations:{status:'located'},
    },
  },
  review:{status:'needs-review',reviewer:null,updatedAt:inventory.meta.extractedAt},
}))
