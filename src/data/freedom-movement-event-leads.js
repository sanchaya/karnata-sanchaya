import { dictionaryMartyrCandidates } from './dictionary-martyrs-karnataka.js'

// These are map/timeline projections of OCR-derived research inputs, not
// promoted historical events. The complete candidate record remains the
// canonical review packet and is linked through candidateIds.
const placeAnchors={
  Mangalore:{name:{en:'Mangaluru',kn:'ಮಂಗಳೂರು'},coordinates:[74.856,12.914]},
  Bellary:{name:{en:'Ballari',kn:'ಬಳ್ಳಾರಿ'},coordinates:[76.921,15.139]},
  Bagalkot:{name:{en:'Bagalkote',kn:'ಬಾಗಲಕೋಟೆ'},coordinates:[75.696,16.169]},
  Belgaum:{name:{en:'Belagavi',kn:'ಬೆಳಗಾವಿ'},coordinates:[74.498,15.850]},
  Mysore:{name:{en:'Mysuru',kn:'ಮೈಸೂರು'},coordinates:[76.655,12.305]},
  Shimoga:{name:{en:'Shivamogga',kn:'ಶಿವಮೊಗ್ಗ'},coordinates:[75.568,13.930]},
  Gadag:{name:{en:'Gadag',kn:'ಗದಗ'},coordinates:[75.625,15.432]},
}

const actionLabels={
  'imprisonment-or-detention':{en:'imprisonment or detention',kn:'ಸೆರೆವಾಸ ಅಥವಾ ಬಂಧನ'},
  'arrest-or-capture':{en:'arrest or capture',kn:'ಬಂಧನ ಅಥವಾ ವಶಪಡಿಸಿಕೆ'},
  'death-or-martyrdom':{en:'death or martyrdom',kn:'ಮರಣ ಅಥವಾ ಹುತಾತ್ಮತೆ'},
  'movement-or-resistance':{en:'movement or resistance',kn:'ಚಳವಳಿ ಅಥವಾ ಪ್ರತಿರೋಧ'},
}

export const freedomMovementEventLeads=dictionaryMartyrCandidates
  .filter(candidate=>candidate.relationship==='karnataka-event-connection'&&candidate.historicalConnection?.years?.length)
  .map(candidate=>{
    const sourcePlace=candidate.historicalConnection.placeLeads.find(value=>placeAnchors[value])
    const anchor=placeAnchors[sourcePlace]
    const actions=candidate.historicalConnection.actions||[]
    const actionEn=actions.map(value=>actionLabels[value]?.en||value).join(', ')
    const actionKn=actions.map(value=>actionLabels[value]?.kn||value).join(', ')
    return {
      id:`event-${candidate.id.replace(/^martyr-candidate-/,'martyr-lead-')}`,
      name:{en:`Freedom-movement evidence lead: ${candidate.name.en}`,kn:`ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಸಾಕ್ಷ್ಯ ಸುಳಿವು: ${candidate.name.kn||candidate.name.en}`},
      type:'campaign',
      date:{...candidate.date},
      location:{type:'Point',coordinates:anchor.coordinates,precision:'district-centre'},
      summary:{
        en:`The Dictionary of Martyrs OCR associates this candidate with ${anchor.name.en} and a date window covering ${candidate.historicalConnection.years.join(', ')}. Extracted action clues include ${actionEn}. The printed page, identity, locality and event sequence remain under human review.`,
        kn:`ಹುತಾತ್ಮರ ನಿಘಂಟಿನ OCR ಈ ಅಭ್ಯರ್ಥಿಯನ್ನು ${anchor.name.kn} ಮತ್ತು ${candidate.historicalConnection.years.join(', ')} ದಿನಾಂಕ ಸುಳಿವುಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ. ಹೊರತೆಗೆದ ಕ್ರಿಯಾಸುಳಿವುಗಳು: ${actionKn}. ಮುದ್ರಿತ ಪುಟ, ಗುರುತು, ಸ್ಥಳ ಮತ್ತು ಘಟನೆಗಳ ಕ್ರಮ ಇನ್ನೂ ಮಾನವ ಪರಿಶೀಲನೆಯಲ್ಲಿವೆ.`,
      },
      participants:[{polityId:'external-polity-british-india',role:'colonial-period-context',outcome:'research-evidence-under-review'}],
      peopleIds:[],
      candidateIds:[candidate.id],
      timelineRelevance:'karnataka-context',
      researchOnly:true,
      researchInput:{
        sourceCollection:'martyrCandidates',
        relationship:candidate.relationship,
        placeLeads:[...candidate.historicalConnection.placeLeads],
        years:[...candidate.historicalConnection.years],
        actions:[...actions],
        archivalReference:candidate.sourceEntry.archivalReference,
        printedPageFrom:candidate.sourceEntry.printedPageFrom,
        printedPageTo:candidate.sourceEntry.printedPageTo,
      },
      citations:candidate.citations.map(citation=>({...citation})),
      review:{status:'needs-review',reviewer:null,updatedAt:candidate.review.updatedAt},
    }
  })
