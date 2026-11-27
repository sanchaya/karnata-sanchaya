// Rules for two traditional board games, played against the computer. Pure functions so they can be tested.
// The rules are the commonly played versions; no Karnataka-specific rulebook has been read yet (see docs/aata-paata.md).

// ---- Aadu-Huli (goats and tigers): 5x5 points, 4 tigers, 20 goats. Diagonals run only from points where x+y is even.
export const GRID=5
export const neighbours=(x,y)=>{
  const out=[[1,0],[-1,0],[0,1],[0,-1]]
  if((x+y)%2===0)out.push([1,1],[1,-1],[-1,1],[-1,-1])
  return out.map(([dx,dy])=>[x+dx,y+dy]).filter(([a,b])=>a>=0&&b>=0&&a<GRID&&b<GRID)
}
export const newHuli=()=>{
  const board=Array(GRID*GRID).fill('')
  ;[0,4,20,24].forEach(i=>{board[i]='T'})
  return {board,toPlace:20,captured:0,turn:'G'}
}
const at=(s,x,y)=>s.board[y*GRID+x]
// Tiger moves: a step to a free neighbour or a jump over an adjacent goat along a line.
export const tigerMoves=s=>{
  const moves=[]
  s.board.forEach((cell,i)=>{
    if(cell!=='T')return
    const x=i%GRID,y=Math.floor(i/GRID)
    neighbours(x,y).forEach(([nx,ny])=>{
      if(!at(s,nx,ny))moves.push({from:i,to:ny*GRID+nx})
      else if(at(s,nx,ny)==='G'){const jx=nx+(nx-x),jy=ny+(ny-y);if(jx>=0&&jy>=0&&jx<GRID&&jy<GRID&&!at(s,jx,jy)&&neighbours(nx,ny).some(([a,b])=>a===jx&&b===jy))moves.push({from:i,to:jy*GRID+jx,jump:ny*GRID+nx})}
    })
  })
  return moves
}
export const goatMoves=s=>{
  if(s.toPlace>0)return s.board.map((c,i)=>c?null:{place:i}).filter(Boolean)
  const moves=[]
  s.board.forEach((cell,i)=>{if(cell==='G')neighbours(i%GRID,Math.floor(i/GRID)).forEach(([nx,ny])=>{if(!at(s,nx,ny))moves.push({from:i,to:ny*GRID+nx})})})
  return moves
}
export const applyHuli=(s,move)=>{
  const board=[...s.board];let {toPlace,captured}=s
  if(move.place!=null){board[move.place]='G';toPlace--}
  else{board[move.to]=board[move.from];board[move.from]='';if(move.jump!=null){board[move.jump]='';captured++}}
  return {board,toPlace,captured,turn:s.turn==='G'?'T':'G'}
}
export const huliWinner=s=>{
  if(s.captured>=5)return 'T'
  if(s.turn==='T'&&!tigerMoves(s).length)return 'G'
  if(s.turn==='G'&&!goatMoves(s).length)return 'T'
  return null
}
// Computer tigers: capture when possible, otherwise the step that keeps most tiger moves open.
export const tigerReply=(s,random=Math.random)=>{
  const moves=tigerMoves(s)
  if(!moves.length)return null
  const jumps=moves.filter(m=>m.jump!=null)
  if(jumps.length)return jumps[Math.floor(random()*jumps.length)]
  let best=[],top=-1
  moves.forEach(m=>{const score=tigerMoves(applyHuli(s,m)).length;if(score>top){top=score;best=[m]}else if(score===top)best.push(m)})
  return best[Math.floor(random()*best.length)]
}

// ---- Ali Guli Mane: two rows of seven pits, four seeds each. Pits 0-6 are the player's, 7-13 the computer's.
export const newMane=()=>({pits:Array(14).fill(4),store:[0,0],turn:0})
const rowOf=turn=>turn===0?[0,1,2,3,4,5,6]:[7,8,9,10,11,12,13]
export const maneMoves=s=>rowOf(s.turn).filter(i=>s.pits[i]>0)
// Sow one seed per pit; if the next pit holds seeds, lift them and keep sowing; if it is empty, capture the pit after it.
export const applyMane=(s,pit)=>{
  const pits=[...s.pits],store=[...s.store]
  let hand=pits[pit],i=pit;pits[pit]=0
  for(let guard=0;guard<500;guard++){
    while(hand>0){i=(i+1)%14;pits[i]++;hand--}
    const next=(i+1)%14
    if(pits[next]>0){hand=pits[next];pits[next]=0;i=next;continue}
    const target=(next+1)%14
    store[s.turn]+=pits[target];pits[target]=0
    break
  }
  const turn=1-s.turn
  const after={pits,store,turn}
  // A player with an empty row at the start of their turn ends the game; the other side keeps its own seeds.
  if(!maneMoves(after).length){
    rowOf(0).forEach(k=>{store[0]+=pits[k];pits[k]=0});rowOf(1).forEach(k=>{store[1]+=pits[k];pits[k]=0})
    return {pits,store,turn,over:true}
  }
  return after
}
export const maneWinner=s=>s.over?(s.store[0]>s.store[1]?0:s.store[1]>s.store[0]?1:'tie'):null
export const maneReply=(s,random=Math.random)=>{
  const moves=maneMoves(s)
  if(!moves.length)return null
  let best=[],top=-Infinity
  moves.forEach(m=>{const after=applyMane(s,m),score=after.store[1]-after.store[0];if(score>top){top=score;best=[m]}else if(score===top)best.push(m)})
  return best[Math.floor(random()*best.length)]
}

// ---- Chowka-bara: 5x5 board, four pawns each, four cowrie shells. Two players; you start at the bottom, the computer at the top.
// Each pawn runs 16 squares round the outer ring (path 0-15), 8 round the inner ring (16-23) and ends in the centre (24).
// Commonly played simplification: no "first capture needed" rule to enter the inner ring; an exact throw is needed to reach the centre.
const OUTER=[[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[2,0],[3,0],[4,0],[4,1]]
const INNER=[[3,1],[3,2],[3,3],[2,3],[1,3],[1,2],[1,1],[2,1],[2,2]]
export const CHOWKA_PATH=[...OUTER,...INNER]
export const CHOWKA_END=24
export const cellOf=(player,pos)=>{const [r,c]=CHOWKA_PATH[pos];return player===0?[r,c]:[4-r,4-c]}
export const chowkaSafe=([r,c])=>(r%2===0&&c%2===0)||(r===2&&c===2)
export const newChowka=()=>({pawns:[[0,0,0,0],[0,0,0,0]],turn:0})
// four shells: the number of mouths up is the throw; none up counts 8. 4 and 8 give another throw.
export const throwShells=(random=Math.random)=>{let up=0;for(let i=0;i<4;i++)if(random()<.5)up++;return up===0?8:up}
export const chowkaMoves=(s,roll)=>{
  const seen=new Set()
  return s.pawns[s.turn].map((pos,i)=>({i,pos})).filter(({pos})=>pos+roll<=CHOWKA_END&&!seen.has(pos)&&seen.add(pos))
}
export const applyChowka=(s,pos,roll)=>{
  const me=s.turn,other=1-me,pawns=[[...s.pawns[0]],[...s.pawns[1]]]
  const from=pawns[me].indexOf(pos),to=pos+roll
  pawns[me][from]=to
  let captured=0
  const cell=cellOf(me,to)
  if(to!==CHOWKA_END&&!chowkaSafe(cell)){
    pawns[other]=pawns[other].map(p=>{const c=cellOf(other,p);if(p!==CHOWKA_END&&c[0]===cell[0]&&c[1]===cell[1]){captured++;return 0}return p})
  }
  const extra=roll===4||roll===8||captured>0||to===CHOWKA_END
  return {pawns,turn:extra?me:other,captured,finished:to===CHOWKA_END}
}
export const chowkaWinner=s=>s.pawns[0].every(p=>p===CHOWKA_END)?0:s.pawns[1].every(p=>p===CHOWKA_END)?1:null
export const chowkaReply=(s,roll,random=Math.random)=>{
  const moves=chowkaMoves(s,roll)
  if(!moves.length)return null
  let best=[],top=-Infinity
  moves.forEach(({pos})=>{
    const after=applyChowka(s,pos,roll)
    const score=(after.finished?50:0)+after.captured*30+(chowkaSafe(cellOf(s.turn,pos+roll))?4:0)+(pos+roll)/10-(pos===0?0:0)
    if(score>top){top=score;best=[pos]}else if(score===top)best.push(pos)
  })
  return best[Math.floor(random()*best.length)]
}
