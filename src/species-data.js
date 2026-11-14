// One merged view of the species data (GBIF/Wikidata import + curated name lists + reviewed names + photos),
// shared by the species page and the species quiz. Import it lazily: it is about 2 MB.
import data from './data/species/karnataka-species.json'
import nameLists from './data/species/kn-name-sources.json'
import reviewed from './data/species/kn-names-reviewed.json'
import imageData from './data/species/species-images.json'
import flywayData from './data/species/species-flyways.json'
import culture from './data/species/species-culture.json'
import { applyNameSources, applyReviewedNames } from './species-normalize.js'

export const GROUPS=data.groups
export const COUNTS=data.counts
export const SOURCES=data.sources
export const IMAGES=imageData.images
export const CULTURE=culture.notes
export const FLYWAYS=flywayData.flyways
export const SPECIES=applyReviewedNames(applyNameSources(data.species,nameLists.sources),reviewed)
