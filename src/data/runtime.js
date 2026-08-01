import { atlasData } from './atlas'

const API_BASE=import.meta.env.VITE_COMMUNITY_API_URL||''

export function replaceAtlasData(dataset){
  if(!dataset||typeof dataset!=='object'||Array.isArray(dataset))throw new Error('The live dataset response is invalid.')
  for(const key of Object.keys(atlasData))delete atlasData[key]
  Object.assign(atlasData,dataset)
}

async function addReadonlyPeopleSeed(){
  const response=await fetch(`${import.meta.env.BASE_URL}data/wikimedia-people-candidates.json`)
  if(!response.ok)throw new Error(`Static people snapshot request failed (${response.status})`)
  const corpus=await response.json()
  atlasData.peopleCandidateMeta=corpus.meta
  atlasData.peopleCandidates=corpus.records
}

async function loadStaticPublication(){
  try{
    const response=await fetch(`${import.meta.env.BASE_URL}data/published-atlas.json`,{headers:{Accept:'application/json'}})
    if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))return false
    replaceAtlasData(await response.json())
    return true
  }catch{return false}
}

export async function hydrateAtlasData(){
  if(import.meta.env.VITE_STATIC_DATASET==='true'){
    if(!await loadStaticPublication())await addReadonlyPeopleSeed()
    return {source:'static-published-snapshot',dataset:atlasData}
  }
  try{
    const response=await fetch(`${API_BASE}/api/dataset`,{credentials:'same-origin',headers:{Accept:'application/json'}})
    if(!response.ok)throw new Error(`Live dataset request failed (${response.status})`)
    const body=await response.json()
    replaceAtlasData(body.dataset)
    return {source:'mariadb',revision:Number(body.revision||0),dataset:atlasData}
  }catch(error){
    if(import.meta.env.DEV){await addReadonlyPeopleSeed();return {source:'repository-development-fallback',dataset:atlasData,error}}
    throw error
  }
}
