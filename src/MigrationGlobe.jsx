import { useEffect, useMemo, useRef, useState } from 'react'
import world from './data/species/world-110m.json'
import { decodeCountries, greatCircle, KARNATAKA, project } from './globe'

const COUNTRIES=decodeCountries(world)
const BY_ID=new Map(COUNTRIES.map(c=>[c.id,c]))
export const countryName=id=>BY_ID.get(id)?.name||''
export const countryCentroid=id=>BY_ID.get(id)?.centroid
const INDIA=356

// Orthographic globe: land, India, and arcs from the countries where birds are seen in the other season to Karnataka.
// Drag or use the arrow keys to turn it. Props:
//   routes          [{id: country id, weight}] arcs to draw
//   labels          {countryId: string | string[]} text drawn beside a country's dot (several strings = several lines)
//   selected        a country id to ring
//   onPickCountry   called with a country id when a dot is clicked or tapped
//   focus           [lon, lat] to turn the globe to whenever it changes
//   karnatakaLabel  text beside Karnataka
// Sightings only, not tracked routes.
export default function MigrationGlobe({routes,locale,label,labels={},selected=0,onPickCountry,focus,karnatakaLabel,maxSize=560}){
  const kn=locale==='kn',canvas=useRef(null),box=useRef(null)
  const [center,setCenter]=useState([75,32]),[size,setSize]=useState(320),drag=useRef(null),placed=useRef([])
  const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches
  const items=useMemo(()=>routes.map(r=>({...r,country:BY_ID.get(r.id)})).filter(r=>r.country),[routes])
  const maxWeight=Math.max(1,...items.map(r=>r.weight||1))
  useEffect(()=>{const el=box.current;if(!el||typeof ResizeObserver==='undefined')return;const ro=new ResizeObserver(([e])=>setSize(Math.max(220,Math.min(maxSize,Math.round(e.contentRect.width)))));ro.observe(el);return()=>ro.disconnect()},[maxSize])
  useEffect(()=>{if(focus&&Number.isFinite(focus[0])&&Number.isFinite(focus[1]))setCenter([focus[0],Math.max(-70,Math.min(70,focus[1]))])},[focus?.[0],focus?.[1]])
  useEffect(()=>{
    const el=canvas.current;if(!el)return
    const dpr=Math.min(2,window.devicePixelRatio||1);el.width=size*dpr;el.height=size*dpr
    const ctx=el.getContext('2d');let frame=0,raf=0
    const R=size*.46,cx=size/2,cy=size/2
    const toXY=p=>{let {x,y,visible}=p;if(!visible){const n=Math.hypot(x,y)||1;x/=n;y/=n}return [cx+x*R,cy-y*R,visible]}
    const font=`600 ${size<420?11:12.5}px "Noto Sans Kannada","Kannada Sangam MN",system-ui,sans-serif`
    const drawLabel=(text,x,y,fill,rects)=>{
      const lines=(Array.isArray(text)?text:[text]).filter(Boolean);if(!lines.length)return
      ctx.font=font;const lh=size<420?14:16,w=Math.max(...lines.map(l=>ctx.measureText(l).width))+10,h=lines.length*lh+6
      for(let attempt=0;attempt<4;attempt++){
        let bx=x+9,by=y-h-2-attempt*(h+2)
        if(bx+w>size-2)bx=x-9-w;if(bx<2)bx=2;if(by<2)by=y+9+attempt*(h+2)
        if(rects.some(r=>bx<r[0]+r[2]&&bx+w>r[0]&&by<r[1]+r[3]&&by+h>r[1]))continue
        rects.push([bx,by,w,h]);ctx.fillStyle=fill;ctx.globalAlpha=.9;ctx.beginPath();ctx.roundRect?ctx.roundRect(bx,by,w,h,6):ctx.rect(bx,by,w,h);ctx.fill();ctx.globalAlpha=1
        ctx.fillStyle='#10303b';ctx.textBaseline='top';lines.forEach((l,i)=>ctx.fillText(l,bx+5,by+4+i*lh));return
      }
    }
    const draw=()=>{
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,size,size)
      const sea=ctx.createRadialGradient(cx-R*.3,cy-R*.3,R*.1,cx,cy,R);sea.addColorStop(0,'#d7eef5');sea.addColorStop(1,'#8cc4d6')
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=sea;ctx.fill()
      for(const c of COUNTRIES){
        ctx.beginPath()
        for(const polygon of c.polygons)for(const ring of polygon){ring.forEach((pt,i)=>{const [x,y]=toXY(project(pt,center));i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath()}
        ctx.fillStyle=c.id===INDIA?'#e9b44c':c.id===selected?'#cfe8d6':'#f3efe2';ctx.fill('evenodd');ctx.strokeStyle='#b9b4a2';ctx.lineWidth=.4;ctx.stroke()
      }
      const dots=[]
      for(const r of items){
        const path=greatCircle(r.country.centroid,KARNATAKA,48),w=1+3*(r.weight||1)/maxWeight,on=!selected||r.id===selected
        ctx.beginPath();let pen=false
        for(const pt of path){const p=project(pt,center);if(!p.visible){pen=false;continue}const [x,y]=toXY(p);pen?ctx.lineTo(x,y):ctx.moveTo(x,y);pen=true}
        ctx.strokeStyle=on?'#167f9bcc':'#167f9b44';ctx.lineWidth=on?w:Math.max(1,w/2);ctx.setLineDash([6,5]);ctx.lineDashOffset=reduce?0:-frame/3;ctx.stroke();ctx.setLineDash([])
        const o=project(r.country.centroid,center);if(o.visible){const [x,y]=toXY(o);ctx.beginPath();ctx.arc(x,y,2.5+w,0,Math.PI*2);ctx.fillStyle=r.id===selected?'#c0392b':'#0b4f66';ctx.fill();if(r.id===selected){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke()}dots.push({id:r.id,x,y,weight:r.weight||1})}
      }
      placed.current=dots
      const rects=[]
      const k=project(KARNATAKA,center);let kxy=null
      if(k.visible){const [x,y]=toXY(k);kxy=[x,y];ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='#c0392b';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke()}
      // labels: the selected country first, then heavier countries, skipping any that would overlap
      for(const d of [...dots].sort((a,b)=>(b.id===selected)-(a.id===selected)||b.weight-a.weight))if(labels[d.id])drawLabel(labels[d.id],d.x,d.y,d.id===selected?'#fff3c4':'#ffffff',rects)
      if(kxy&&karnatakaLabel)drawLabel(karnatakaLabel,kxy[0],kxy[1],'#ffd9d4',rects)
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.strokeStyle='#5a8ea0';ctx.lineWidth=1;ctx.stroke()
    }
    const loop=()=>{frame++;draw();raf=requestAnimationFrame(loop)}
    if(reduce||items.length===0)draw();else loop()
    return()=>cancelAnimationFrame(raf)
  },[items,center,size,maxWeight,reduce,labels,selected,karnatakaLabel])
  const down=e=>{drag.current={x:e.clientX,y:e.clientY,c:center,moved:false};e.currentTarget.setPointerCapture?.(e.pointerId)}
  const move=e=>{const d=drag.current;if(!d)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>4)d.moved=true;if(d.moved)setCenter([d.c[0]-(e.clientX-d.x)*.4,Math.max(-80,Math.min(80,d.c[1]+(e.clientY-d.y)*.4))])}
  const up=e=>{
    const d=drag.current;drag.current=null
    if(!d||d.moved||!onPickCountry)return
    const rect=e.currentTarget.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top
    const hit=placed.current.map(p=>({...p,d:Math.hypot(p.x-x,p.y-y)})).filter(p=>p.d<=16).sort((a,b)=>a.d-b.d)[0]
    if(hit)onPickCountry(hit.id===selected?0:hit.id)
  }
  const key=e=>{const step=e.shiftKey?30:10;const m={ArrowLeft:[step,0],ArrowRight:[-step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[e.key];if(m){e.preventDefault();setCenter(c=>[c[0]+m[0],Math.max(-80,Math.min(80,c[1]+m[1]))])}}
  return <div className="species-globe" ref={box}>
    <canvas ref={canvas} style={{width:size,height:size}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>{drag.current=null}} onKeyDown={key} tabIndex={0} role="img" aria-label={label||(kn?'ವಲಸೆ ಭೂಗೋಳ':'Migration globe')}/>
    <div className="species-globe-tools"><button type="button" onClick={()=>setCenter([75,32])}>{kn?'ಏಷ್ಯಾ':'Asia'}</button><button type="button" onClick={()=>setCenter([KARNATAKA[0],KARNATAKA[1]])}>{kn?'ಕರ್ನಾಟಕ':'Karnataka'}</button><button type="button" onClick={()=>setCenter([20,40])}>{kn?'ಯುರೋಪ್':'Europe'}</button><button type="button" onClick={()=>setCenter([-100,40])}>{kn?'ಅಮೆರಿಕ':'Americas'}</button></div>
  </div>
}
