// Pure helpers for the migration globe: decode the Natural Earth topology, project it orthographically, and make arcs.
const RAD=Math.PI/180
export const KARNATAKA=[76.0,15.0] // [lon, lat]

export function decodeCountries(topo){
  const {scale,translate}=topo.transform
  const arcs=topo.arcs.map(arc=>{let x=0,y=0;return arc.map(([dx,dy])=>{x+=dx;y+=dy;return [x*scale[0]+translate[0],y*scale[1]+translate[1]]})})
  const ring=indexes=>indexes.flatMap((i,k)=>{const a=i<0?[...arcs[~i]].reverse():arcs[i];return k?a.slice(1):a})
  return topo.objects.countries.geometries.map(g=>{
    const polygons=(g.type==='Polygon'?[g.arcs]:g.type==='MultiPolygon'?g.arcs:[]).map(polygon=>polygon.map(ring))
    const outer=polygons.map(p=>p[0]).sort((a,b)=>b.length-a.length)[0]||[]
    return {id:Number(g.id),name:g.properties?.name||'',polygons,centroid:centroidOf(outer)}
  })
}
// Mean latitude, circular mean longitude (so Russia and Fiji, which cross 180 degrees, stay sensible).
export function centroidOf(points){
  if(!points.length)return [0,0]
  let sx=0,sy=0,lat=0
  for(const [lon,la] of points){sx+=Math.cos(lon*RAD);sy+=Math.sin(lon*RAD);lat+=la}
  return [Math.atan2(sy,sx)/RAD,lat/points.length]
}
// Orthographic projection centred on [lon0, lat0]. x right, y up, unit sphere; `visible` is the near side.
export function project([lon,lat],[lon0,lat0]){
  const l=(lon-lon0)*RAD,p=lat*RAD,p0=lat0*RAD
  return {x:Math.cos(p)*Math.sin(l),y:Math.cos(p0)*Math.sin(p)-Math.sin(p0)*Math.cos(p)*Math.cos(l),visible:Math.sin(p0)*Math.sin(p)+Math.cos(p0)*Math.cos(p)*Math.cos(l)>=0}
}
// Great-circle path between two [lon, lat] points, `steps` + 1 points.
export function greatCircle(a,b,steps=40){
  const v=([lon,lat])=>[Math.cos(lat*RAD)*Math.cos(lon*RAD),Math.cos(lat*RAD)*Math.sin(lon*RAD),Math.sin(lat*RAD)]
  const [A,B]=[v(a),v(b)],dot=Math.min(1,Math.max(-1,A[0]*B[0]+A[1]*B[1]+A[2]*B[2])),omega=Math.acos(dot)
  if(omega<1e-6)return [a,b]
  return Array.from({length:steps+1},(_,i)=>{
    const t=i/steps,s1=Math.sin((1-t)*omega)/Math.sin(omega),s2=Math.sin(t*omega)/Math.sin(omega)
    const x=s1*A[0]+s2*B[0],y=s1*A[1]+s2*B[1],z=s1*A[2]+s2*B[2]
    return [Math.atan2(y,x)/RAD,Math.atan2(z,Math.hypot(x,y))/RAD]
  })
}
// Routes for the globe from a species list: how many listed species have each country in their other-season range.
export function aggregateRoutes(speciesList,flyways){
  const counts=new Map()
  for(const s of speciesList)for(const c of flyways[s.gbifKey]?.countries||[])counts.set(c.id,(counts.get(c.id)||0)+1)
  return [...counts].map(([id,weight])=>({id,weight})).sort((a,b)=>b.weight-a.weight)
}
