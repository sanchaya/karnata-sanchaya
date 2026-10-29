#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { atlasData } from '../src/data/atlas.js'
import { calculateDatasetDepth } from '../src/data/dataset-depth.js'
import { PUBLIC_DATA_ATTRIBUTION, publicRecordAttribution } from '../src/data/public-attribution.js'

const rootDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const outputDir=path.join(rootDir,'public','data','open')
const privateFields=new Set(['reviewWorkflow','verification','resolution','promotionReview','privateNotes','moderation'])
const generatedAt=process.env.SOURCE_DATE_EPOCH?new Date(Number(process.env.SOURCE_DATE_EPOCH)*1000).toISOString():atlasData.meta.exportedAt||null
const datasetDepth=calculateDatasetDepth(atlasData)

const publicRecord=value=>{
  if(Array.isArray(value))return value.map(publicRecord)
  if(!value||typeof value!=='object')return value
  return Object.fromEntries(Object.entries(value).filter(([key])=>!privateFields.has(key)).map(([key,item])=>[key,publicRecord(item)]))
}
const attributedRecord=(record,collection,index)=>{const value=publicRecord(record);return value&&typeof value==='object'&&!Array.isArray(value)?{...value,_attribution:publicRecordAttribution(value,`${collection}:${index}`)}:value}

const payloadFor=catalogue=>{
  const payload={
  meta:{
    title:atlasData.meta.title,
    schemaVersion:atlasData.meta.schemaVersion,
    generatedAt,
    access:catalogue.access,
    review:catalogue.review,
    datasetDepth,
    attribution:PUBLIC_DATA_ATTRIBUTION,
  },
  catalogue:{
    id:catalogue.id,
    name:catalogue.name,
    datasetKind:catalogue.datasetKind,
    description:catalogue.description,
    includedCollections:catalogue.includedCollections,
    excludedFields:catalogue.excludedFields,
  },
  collections:Object.fromEntries(catalogue.includedCollections.map(collection=>[collection,(atlasData[collection]||[]).map((record,index)=>attributedRecord(record,collection,index))])),
  }
  payload.meta.attribution={...PUBLIC_DATA_ATTRIBUTION,payloadSha256:createHash('sha256').update(JSON.stringify(payload)).digest('hex')}
  return payload
}

await mkdir(outputDir,{recursive:true})
for(const catalogue of atlasData.openDatasetCatalogue){
  const filename=path.basename(catalogue.path)
  await writeFile(path.join(outputDir,filename),`${JSON.stringify(payloadFor(catalogue),null,2)}\n`)
}
await writeFile(path.join(outputDir,'index.json'),`${JSON.stringify({schemaVersion:atlasData.meta.schemaVersion,generatedAt,attribution:PUBLIC_DATA_ATTRIBUTION,datasets:atlasData.openDatasetCatalogue.map(item=>({id:item.id,name:item.name,datasetKind:item.datasetKind,path:item.path,access:item.access,review:item.review}))},null,2)}\n`)
console.log(`Generated ${atlasData.openDatasetCatalogue.length} public open dataset packet(s) in public/data/open.`)
