export function parseCsv(text){
  const rows=[];let row=[],cell='',quoted=false
  for(let index=0;index<text.length;index+=1){const char=text[index],next=text[index+1];if(char==='"'&&quoted&&next==='"'){cell+='"';index+=1}else if(char==='"')quoted=!quoted;else if(char===','&&!quoted){row.push(cell.trim());cell=''}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&next==='\n')index+=1;row.push(cell.trim());if(row.some(Boolean))rows.push(row);row=[];cell=''}else cell+=char}row.push(cell.trim());if(row.some(Boolean))rows.push(row);if(rows.length<2)return[];const headers=rows[0].map((value,index)=>value||`column_${index+1}`);return rows.slice(1).filter(values=>values.some(Boolean)).map(values=>Object.fromEntries(headers.map((header,index)=>[header,values[index]||''])))
}

export function parseKml(text){
  const xml=new DOMParser().parseFromString(text,'application/xml');if(xml.querySelector('parsererror'))return[]
  return [...xml.querySelectorAll('Placemark')].map((placemark,index)=>{const coordinates=placemark.querySelector('Point coordinates')?.textContent?.trim().split(',').map(Number);return {name:placemark.querySelector('name')?.textContent?.trim()||`Placemark ${index+1}`,description:placemark.querySelector('description')?.textContent?.trim()||'',longitude:Number.isFinite(coordinates?.[0])?coordinates[0]:'',latitude:Number.isFinite(coordinates?.[1])?coordinates[1]:''}})
}
