#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { atlasData } from '../src/data/atlas.js'

const rootDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const outputDir=path.join(rootDir,'public','data','open')
const privateFields=new Set(['reviewWorkflow','verification','resolution','promotionReview','privateNotes','moderation'])
const generatedAt=process.env.SOURCE_DATE_EPOCH?new Date(Number(process.env.SOURCE_DATE_EPOCH)*1000).toISOString():atlasData.meta.exportedAt||null

const publicRecord=value=>{
  if(Array.isArray(value))return value.map(publicRecord)
  if(!value||typeof value!=='object')return value
  return Object.fromEntries(Object.entries(value).filter(([key])=>!privateFields.has(key)).map(([key,item])=>[key,publicRecord(item)]))
}

const payloadFor=catalogue=>({
  meta:{
    title:atlasData.meta.title,
    schemaVersion:atlasData.meta.schemaVersion,
    generatedAt,
    access:catalogue.access,
    review:catalogue.review,
  },
  catalogue:{
    id:catalogue.id,
    name:catalogue.name,
    datasetKind:catalogue.datasetKind,
    description:catalogue.description,
    includedCollections:catalogue.includedCollections,
    excludedFields:catalogue.excludedFields,
  },
  collections:Object.fromEntries(catalogue.includedCollections.map(collection=>[collection,(atlasData[collection]||[]).map(publicRecord)])),
})

await mkdir(outputDir,{recursive:true})
for(const catalogue of atlasData.openDatasetCatalogue){
  const filename=path.basename(catalogue.path)
  await writeFile(path.join(outputDir,filename),`${JSON.stringify(payloadFor(catalogue),null,2)}\n`)
}
await writeFile(path.join(outputDir,'index.json'),`${JSON.stringify({schemaVersion:atlasData.meta.schemaVersion,generatedAt,datasets:atlasData.openDatasetCatalogue.map(item=>({id:item.id,name:item.name,datasetKind:item.datasetKind,path:item.path,access:item.access,review:item.review}))},null,2)}\n`)
console.log(`Generated ${atlasData.openDatasetCatalogue.length} public open dataset packet(s) in public/data/open.`)
