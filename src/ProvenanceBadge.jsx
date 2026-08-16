import { provenanceTierLabel } from './data/source-provenance'

export default function ProvenanceBadge({tier,locale,short=false}){
  const value=provenanceTierLabel(tier,locale,short)
  return <span className={`provenance-badge provenance-${tier||'reference'}`} title={value}>{value}</span>
}