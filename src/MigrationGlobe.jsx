import { useEffect, useMemo, useRef, useState } from 'react'
import world from './data/species/world-110m.json'
import { decodeCountries, greatCircle, KARNATAKA, project } from './globe'

const COUNTRIES=decodeCountries(world)
const BY_ID=new Map(COUNTRIES.map(c=>[c.id,c]))
export const countryName=id=>BY_ID.get(id)?.name||''
const INDIA=356

// Orthographic globe: land, India, and arcs from the countries where a bird (or the listed birds) are seen in the other
// season to Karnataka. Drag to turn it. Sightings only, not tracked routes.
export default function MigrationGlobe({routes,locale,label}){
  const kn=locale==='kn',canvas=useRef(null),box=useRef(null)
  const [center,setCenter]=useState([75,32]),[size,setSize]=useState(320),drag=useRef(null)
  const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches
  const items=useMemo(()=>routes.map(r=>({...r,country:BY_ID.get(r.id)})).filter(r=>r.country),[routes])
  const maxWeight=Math.max(1,...items.map(r=>r.weight||1))
  useEffect(()=>{const el=box.current;if(!el||typeof ResizeObserver==='undefined')return;const ro=new ResizeObserver(([e])=>setSize(Math.max(220,Math.min(560,Math.round(e.contentRect.width)))));ro.observe(el);return()=>ro.disconnect()},[])
  useEffect(()=>{
    const el=canvas.current;if(!el)return
    const dpr=Math.min(2,window.devicePixelRatio||1);el.width=size*dpr;el.height=size*dpr
    const ctx=el.getContext('2d');let frame=0,raf=0
    const R=size*.46,cx=size/2,cy=size/2
    const toXY=p=>{let {x,y,visible}=p;if(!visible){const n=Math.hypot(x,y)||1;x/=n;y/=n}return [cx+x*R,cy-y*R,visible]}
    const draw=()=>{
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,size,size)
      const sea=ctx.createRadialGradient(cx-R*.3,cy-R*.3,R*.1,cx,cy,R);sea.addColorStop(0,'#d7eef5');sea.addColorStop(1,'#8cc4d6')
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=sea;ctx.fill()
      for(const c of COUNTRIES){
        ctx.beginPath()
        for(const polygon of c.polygons)for(const ring of polygon){ring.forEach((pt,i)=>{const [x,y]=toXY(project(pt,center));i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath()}
        ctx.fillStyle=c.id===INDIA?'#e9b44c':'#f3efe2';ctx.fill('evenodd');ctx.strokeStyle='#b9b4a2';ctx.lineWidth=.4;ctx.stroke()
      }
      for(const r of items){
        const path=greatCircle(r.country.centroid,KARNATAKA,48),w=1+3*(r.weight||1)/maxWeight
        ctx.beginPath();let pen=false
        for(const pt of path){const p=project(pt,center);if(!p.visible){pen=false;continue}const [x,y]=toXY(p);pen?ctx.lineTo(x,y):ctx.moveTo(x,y);pen=true}
        ctx.strokeStyle='#167f9bcc';ctx.lineWidth=w;ctx.setLineDash([6,5]);ctx.lineDashOffset=reduce?0:-frame/3;ctx.stroke();ctx.setLineDash([])
        const o=project(r.country.centroid,center);if(o.visible){const [x,y]=toXY(o);ctx.beginPath();ctx.arc(x,y,2+w,0,Math.PI*2);ctx.fillStyle='#0b4f66';ctx.fill()}
      }
      const k=project(KARNATAKA,center);if(k.visible){const [x,y]=toXY(k);ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='#c0392b';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke()}
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.strokeStyle='#5a8ea0';ctx.lineWidth=1;ctx.stroke()
    }
    const loop=()=>{frame++;draw();raf=requestAnimationFrame(loop)}
    if(reduce||items.length===0)draw();else loop()
    return()=>cancelAnimationFrame(raf)
  },[items,center,size,maxWeight,reduce])
  const down=e=>{drag.current={x:e.clientX,y:e.clientY,c:center};e.currentTarget.setPointerCapture?.(e.pointerId)}
  const move=e=>{const d=drag.current;if(!d)return;setCenter([d.c[0]-(e.clientX-d.x)*.4,Math.max(-80,Math.min(80,d.c[1]+(e.clientY-d.y)*.4))])}
  const key=e=>{const step=e.shiftKey?30:10;const m={ArrowLeft:[step,0],ArrowRight:[-step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[e.key];if(m){e.preventDefault();setCenter(c=>[c[0]+m[0],Math.max(-80,Math.min(80,c[1]+m[1]))])}}
  return <div className="species-globe" ref={box}>
    <canvas ref={canvas} style={{width:size,height:size}} onPointerDown={down} onPointerMove={move} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} onKeyDown={key} tabIndex={0} role="img" aria-label={label||(kn?'ವಲಸೆ ಭೂಗೋಳ':'Migration globe')}/>
    <div className="species-globe-tools"><button type="button" onClick={()=>setCenter([75,32])}>{kn?'ಏಷ್ಯಾ':'Asia'}</button><button type="button" onClick={()=>setCenter([KARNATAKA[0],KARNATAKA[1]])}>{kn?'ಕರ್ನಾಟಕ':'Karnataka'}</button><button type="button" onClick={()=>setCenter([20,40])}>{kn?'ಯುರೋಪ್':'Europe'}</button><button type="button" onClick={()=>setCenter([-100,40])}>{kn?'ಅಮೆರಿಕ':'Americas'}</button></div>
  </div>
}
