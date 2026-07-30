const n=(en,kn)=>({en,kn})

// These are contextual research links, not assertions that every named ruler
// built the selected monument. Monument-specific patronage remains review-gated.
const byDistrict={
  'audit-bagalkote':{placeIds:['place-pattadakal'],polityIds:['polity-badami-chalukya'],peopleIds:['person-vikramaditya-ii','person-lokamahadevi'],eventIds:['event-vikramaditya-takes-kanchi']},
  'audit-belagavi':{polityIds:['polity-kalyani-chalukya','polity-vijayanagara','external-polity-adil-shahi','external-polity-maratha-confederacy']},
  'audit-bengaluru-rural':{polityIds:['polity-vijayanagara','polity-mysore'],peopleIds:['person-tipu-sultan']},
  'audit-bengaluru-urban':{placeIds:['place-bengaluru'],polityIds:['polity-vijayanagara','polity-mysore'],peopleIds:['person-hyder-ali','person-tipu-sultan']},
  'audit-bidar':{polityIds:['external-polity-bahmani','external-polity-adil-shahi'],eventIds:['event-bahmani-foundation']},
  'audit-chamarajanagar':{polityIds:['polity-western-ganga','polity-mysore']},
  'audit-chikkaballapur':{polityIds:['polity-vijayanagara','polity-mysore'],peopleIds:['person-tipu-sultan']},
  'audit-chikkamagaluru':{polityIds:['polity-kadamba','polity-hoysala','polity-mysore']},
  'audit-chitradurga':{placeIds:['place-chitradurga-fort'],polityIds:['external-polity-chitradurga-nayaka','polity-mysore'],eventIds:['event-chitradurga-nayaka-governance']},
  'audit-dakshina-kannada':{placeIds:['place-mangaluru'],polityIds:['polity-alupa','external-polity-keladi-nayaka','polity-vijayanagara'],eventIds:['event-alupa-coastal-polity-attested','event-keladi-nayaka-governance']},
  'audit-davanagere':{polityIds:['polity-kalyani-chalukya','polity-vijayanagara','external-polity-chitradurga-nayaka']},
  'audit-dharwad':{polityIds:['polity-kalyani-chalukya','external-polity-maratha-confederacy','polity-mysore'],eventIds:['event-siege-dharwad-research-lead']},
  'audit-gadag':{placeIds:['place-lakkundi-kashivishveshvara','place-lakkundi-brahma-jinalaya'],polityIds:['polity-kalyani-chalukya'],peopleIds:['person-vikramaditya-vi']},
  'audit-hassan':{placeIds:['place-belur','place-halebidu'],polityIds:['polity-hoysala','polity-mysore'],peopleIds:['person-vishnuvardhana','person-ballala-ii'],eventIds:['event-hoysala-belur-halebidu-centres']},
  'audit-haveri':{polityIds:['polity-rashtrakuta','polity-kalyani-chalukya','polity-hoysala']},
  'audit-kalaburagi':{placeIds:['place-kalaburagi-jama-masjid'],polityIds:['polity-rashtrakuta','external-polity-bahmani'],eventIds:['event-bahmani-foundation']},
  'audit-kodagu':{polityIds:['polity-mysore']},
  'audit-kolar':{polityIds:['polity-western-ganga','external-polity-chola','polity-mysore'],eventIds:['event-chola-gangavadi']},
  'audit-koppal':{placeIds:['place-hampi'],polityIds:['polity-vijayanagara'],peopleIds:['person-harihara-i','person-bukka-i'],eventIds:['event-vijayanagara-foundation']},
  'audit-mandya':{placeIds:['place-srirangapatna','place-srirangapatna-fort'],polityIds:['polity-western-ganga','polity-mysore'],peopleIds:['person-hyder-ali','person-tipu-sultan'],eventIds:['event-first-anglo-mysore-war','event-second-anglo-mysore-war','event-srirangapatna-1799']},
  'audit-mysuru':{placeIds:['place-mysuru','place-mysuru-palace'],polityIds:['polity-mysore'],peopleIds:['person-krishnaraja-iii','person-jayachamarajendra'],eventIds:['event-mysore-capital-restored-1799','event-mysore-accession']},
  'audit-raichur':{polityIds:['polity-vijayanagara','external-polity-bahmani','external-polity-adil-shahi'],peopleIds:['person-krishnadevaraya'],eventIds:['event-raichur-1520']},
  'audit-ramanagara':{polityIds:['polity-western-ganga','polity-vijayanagara','polity-mysore']},
  'audit-shivamogga':{placeIds:['place-keladi','place-ikkeri'],polityIds:['polity-kadamba','external-polity-keladi-nayaka'],eventIds:['event-keladi-nayaka-governance']},
  'audit-tumakuru':{polityIds:['polity-western-ganga','polity-hoysala','polity-mysore']},
  'audit-udupi':{placeIds:['place-udupi'],polityIds:['polity-alupa','external-polity-keladi-nayaka'],eventIds:['event-alupa-coastal-polity-attested']},
  'audit-uttara-kannada':{placeIds:['place-banavasi'],polityIds:['polity-kadamba','polity-vijayanagara','external-polity-keladi-nayaka'],peopleIds:['person-mayurasharma'],eventIds:['event-kadamba-power-emerges']},
  'audit-vijayanagara':{placeIds:['place-hampi'],polityIds:['polity-vijayanagara'],peopleIds:['person-harihara-i','person-bukka-i','person-krishnadevaraya'],eventIds:['event-vijayanagara-foundation','event-talikota']},
  'audit-vijayapura':{placeIds:['place-gol-gumbaz','place-ibrahim-rauza'],polityIds:['external-polity-adil-shahi','external-polity-mughal-empire']},
  'audit-yadgir':{polityIds:['polity-rashtrakuta','polity-kalyani-chalukya','external-polity-bahmani']},
  'audit-ballari':{polityIds:['polity-vijayanagara'],eventIds:['event-vijayanagara-foundation']}
}

export function applyDistrictHeritageConnections(records){
  records.forEach(record=>{
    const links=byDistrict[record.districtId]||{}
    record.placeIds=[...new Set([...(record.placeIds||[]),...(links.placeIds||[])])]
    record.polityIds=[...new Set([...(record.polityIds||[]),...(links.polityIds||[])])]
    record.peopleIds=[...new Set([...(record.peopleIds||[]),...(links.peopleIds||[])])]
    record.eventIds=[...new Set([...(record.eventIds||[]),...(links.eventIds||[])])]
    record.connectionNote=n('These links identify the district’s wider historical context. They do not assign construction or patronage to a person without monument-specific evidence.','ಈ ಕೊಂಡಿಗಳು ಜಿಲ್ಲೆಯ ವಿಶಾಲ ಐತಿಹಾಸಿಕ ಸಂದರ್ಭವನ್ನು ಗುರುತಿಸುತ್ತವೆ. ಸ್ಮಾರಕ-ನಿರ್ದಿಷ್ಟ ಸಾಕ್ಷ್ಯವಿಲ್ಲದೆ ಯಾವುದೇ ವ್ಯಕ್ತಿಗೆ ನಿರ್ಮಾಣ ಅಥವಾ ಆಶ್ರಯವನ್ನು ನಿಗದಿಪಡಿಸುವುದಿಲ್ಲ.')
  })
}
