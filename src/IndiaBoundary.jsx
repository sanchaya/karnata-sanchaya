import { useEffect, useState } from 'react'
import { GeoJSON, Pane } from 'react-leaflet'

const URL=`${import.meta.env.BASE_URL}india-official-boundary.geojson`
let promise
const load=()=>promise??=fetch(URL).then(r=>r.ok?r.json():null).catch(()=>null)
const ATTRIBUTION='India’s boundary as on the official map of India (Natural Earth)'

// India's official outer boundary on a Leaflet map. OpenStreetMap tiles draw Kashmir by the de facto lines; this draws all of
// Jammu and Kashmir (with Gilgit-Baltistan and Pakistan-administered Kashmir) and Ladakh (with Aksai Chin) as on the official map
// of India, filling the claimed area with the tile map's land colour so the tile's own border lines do not show through.
// Put it inside any <MapContainer>. It sits above the tiles and below markers.
export default function IndiaBoundary(){
  const [data,setData]=useState(null)
  useEffect(()=>{let live=true;load().then(d=>live&&setData(d));return()=>{live=false}},[])
  if(!data)return null
  const claimed={...data,features:data.features.filter(f=>f.properties.kind==='claimed')},outline={...data,features:data.features.filter(f=>f.properties.kind==='outline')}
  return <Pane name="india-official" style={{zIndex:250}}>
    <GeoJSON data={claimed} interactive={false} attribution={ATTRIBUTION} style={{stroke:false,fillColor:'#f2efe9',fillOpacity:.97}}/>
    <GeoJSON data={outline} interactive={false} style={{color:'#4a4a4a',weight:1.3,opacity:.85,fill:false}}/>
  </Pane>
}
