import { useEffect, useState } from 'react'

export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date())
const readProgress=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
export const useProgress=(key,fallback)=>{const [value,setValue]=useState(()=>readProgress(key,fallback));useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{/* game remains usable */}},[key,value]);return[value,setValue]}
