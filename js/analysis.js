/* analysis.js — 용신 · 명식 상세 · 합충 그림 · 인생 그래프 · 커플 달력 */
/* ============ 19. 용신 ============ */
const ELUSE={wood:{job:'교육·출판·디자인·환경·의류',act:'숲길 산책, 식물 키우기, 아침 운동',season:'봄'},fire:{job:'미디어·IT·방송·뷰티·에너지',act:'햇볕 쬐기, 공연 관람, 땀 흘리는 운동',season:'여름'},earth:{job:'부동산·건설·농업·중개·상담',act:'등산, 텃밭, 도자기 같은 손작업',season:'환절기'},metal:{job:'금융·법률·기계·IT 하드웨어·의료',act:'정리정돈, 금속 액세서리, 규칙적인 루틴',season:'가을'},water:{job:'무역·유통·물류·연구·관광',act:'수영, 바다·호수 여행, 충분한 수면',season:'겨울'}};
function yongsin(C){
 const me=EL[C.dg],I=k=>ORD[(ORD.indexOf(me)+k)%5],GE={비겁:I(0),식상:I(1),재성:I(2),관성:I(3),인성:I(4)};
 let help=0,tot=0;
 C.P.forEach(p=>{if(p.off)return;[[p.gz[0],p.me?0:1],[p.gz[1],p.k==='월'?3:p.k==='일'?1.5:1]].forEach(([c,w])=>{if(!w)return;tot+=w;if(EL[c]===me||EL[c]===GE.인성)help+=w})});
 const pct=Math.round(help/tot*100),gc=C.gc;let yong,why;
 if(pct>=50){
  if(gc.인성>=2&&gc.인성>=gc.비겁){yong=GE.재성;why='인성(나를 돕는 기운)이 많아 신강한 사주라, 재성으로 인성을 눌러 균형을 잡는 것이 필요합니다.'}
  else if(gc.비겁>=2){yong=GE.관성;why='비겁(나와 같은 기운)이 많아 신강한 사주라, 관성으로 나를 다스려 주는 것이 필요합니다.'}
  else {yong=GE.식상;why='기운이 넘치는 사주라, 식상으로 힘을 밖으로 풀어 주는 것이 필요합니다.'}
 }else{
  if(gc.관성>=2&&gc.관성>=gc.재성&&gc.관성>=gc.식상){yong=GE.인성;why='관성이 나를 누르는 신약한 사주라, 인성으로 관성의 힘을 나에게 돌려주는 것(살인상생)이 필요합니다.'}
  else if(gc.재성>=2&&gc.재성>=gc.식상){yong=GE.비겁;why='재성이 많아 기운이 빠지는 신약한 사주라, 비겁으로 나를 받쳐 주는 것이 필요합니다.'}
  else {yong=GE.인성;why='나의 기운이 약한 사주라, 인성으로 나를 살려 주는 것이 필요합니다.'}
 }
 const mz=C.P[2].gz[1];let johu='';
 if('巳午未'.includes(mz)&&C.cnt.fire>=3&&C.cnt.water===0)johu='water';
 else if('亥子丑'.includes(mz)&&C.cnt.water>=3&&C.cnt.fire===0)johu='fire';
 if(johu&&johu!==yong){why+=` 다만 ${johu==='water'?'여름에 태어나 불이 넘치고 물이 없어':'겨울에 태어나 물이 넘치고 불이 없어'}, 온도를 맞추는 조후를 우선해 ${ELN[johu]}을 용신으로 삼습니다.`;yong=johu}
 const yi=ORD.indexOf(yong);let hee=ORD[(yi+4)%5],han=ORD[(yi+1)%5];
 // 희신 후보가 이미 넘치면(3개 이상) 용신이 낳는 오행을 희신으로 삼음
 if(C.cnt[hee]>=3)[hee,han]=[han,hee];
 return {yong,hee,gi:ORD[(yi+3)%5],gu:ORD[(yi+2)%5],han,pct,why,johu};
}
function drawYong(C){
 const Y=C.Y,lbl=[['용신',Y.yong,'가장 필요한 기운'],['희신',Y.hee,'용신을 돕는 기운'],['기신',Y.gi,'용신을 해치는 기운'],['구신',Y.gu,'기신을 돕는 기운']];
 const u=ELUSE[Y.yong];
 $('yong').innerHTML=`<div class="rc ym"><div><h3>신강·신약 · ${Y.pct>=55?'신강':Y.pct<=45?'신약':'중화'} (${Y.pct}%)</h3>
  <div class="meter"><b style="left:${Y.pct}%"></b></div><div><span>신약 (나의 힘이 약함)</span><span>신강 (나의 힘이 강함)</span></div>
  <p>월지 3배, 일지 1.5배 가중치로 나를 돕는 글자(비겁·인성)의 비율을 계산했습니다.</p></div>
  <div><h3>용신 ${ELN[Y.yong]}</h3><p>${Y.why}</p>
  <div class="ys">${lbl.map(([k,e,d])=>`<div><div class="k">${k}</div><div class="v"><span class="tag ${e}">${ELN[e]}</span></div><div class="k">${d}</div></div>`).join('')}</div></div></div>
  <div class="rd" style="margin-top:14px"><div class="rc"><h3>용신 활용법</h3><p>행운의 색 <b>${LK[Y.yong][1]}</b> · 숫자 <b>${LK[Y.yong][2]}</b> · 방향 <b>${LK[Y.yong][3]}</b> · 계절 <b>${u.season}</b></p><p>잘 맞는 분야: ${u.job}</p><p>생활 속 보완: ${u.act}</p></div>
  <div class="rc"><h3>조심할 기운</h3><p>${ELN[Y.gi]} 기운이 강해지는 해·달에는 무리한 결정을 피하는 게 좋습니다. 대운·월운 별점과 택일, 작명이 모두 이 용신을 기준으로 계산됩니다.</p></div></div>`;
}

/* ============ 20. 명식 상세 (납음·12신살·공망) ============ */
const NY={'海中金':'해중금','炉中火':'노중화','大林木':'대림목','路旁土':'노방토','剑锋金':'검봉금','山头火':'산두화','涧下水':'간하수','城头土':'성두토','白蜡金':'백랍금','杨柳木':'양류목','泉中水':'천중수','屋上土':'옥상토','霹雳火':'벽력화','松柏木':'송백목','长流水':'장류수','沙中金':'사중금','山下火':'산하화','平地木':'평지목','壁上土':'벽상토','金箔金':'금박금','覆灯火':'복등화','天河水':'천하수','大驿土':'대역토','钗钏金':'차천금','桑柘木':'상자목','大溪水':'대계수','沙中土':'사중토','天上火':'천상화','石榴木':'석류목','大海水':'대해수'};
const ZHI='子丑寅卯辰巳午未申酉戌亥',S12=['겁살','재살','천살','지살','년살','월살','망신살','장성살','반안살','역마살','육해살','화개살'];
function sal12(yz,b){const ji={수:'申',화:'寅',금:'巳',목:'亥'}[TRI[yz]],g=(ZHI.indexOf(ji)+9)%12;return S12[(ZHI.indexOf(b)-g+12)%12]}
function drawMT(C){
 const e=C.e,ny=[e.getTimeNaYin(),e.getDayNaYin(),e.getMonthNaYin(),e.getYearNaYin()],kong=e.getDayXunKong(),yz=C.P[3].gz[1];
 const rows=[['천간',p=>`${p.gz[0]} ${KO[p.gz[0]]}`],['천간 십신',p=>SS[p.gs]||p.gs],['지지',p=>`${p.gz[1]} ${KO[p.gz[1]]}`],['지지 십신',p=>SS[p.zs[0]]||p.zs[0]],['지장간',p=>p.hid.map(h=>h+KO[h]).join(' ')],['12운성',p=>DS[p.ds]||p.ds],['12신살',p=>sal12(yz,p.gz[1])],['납음오행',(p,i)=>`${NY[ny[i]]||ny[i]}`],['공망',p=>!p.me&&kong.includes(p.gz[1])?'<span class="gm">공망</span>':'—']];
 $('mt').innerHTML=`<thead><tr><th></th>${C.P.map(p=>`<th>${p.t}</th>`).join('')}</tr></thead><tbody>${rows.map(([n,f])=>`<tr><td>${n}</td>${C.P.map((p,i)=>`<td>${p.off?'—':f(p,i)}</td>`).join('')}</tr>`).join('')}</tbody>`;
}

/* ============ 21. 합충 선 그림 ============ */
let RELS=[];
function drawRelSvg(){
 const svg=$('relsvg'),W=$('board').clientWidth;if(!W)return;
 const list=RELS.filter(r=>r.pi!=null);
 if(!list.length){svg.setAttribute('height',0);svg.innerHTML='';return}
 const cx=i=>W*(i+.5)/4,lv=[];
 list.sort((a,b)=>Math.abs(a.pi-a.pj)-Math.abs(b.pi-b.pj));
 list.forEach(r=>{const lo=Math.min(r.pi,r.pj),hi=Math.max(r.pi,r.pj);let l=0;while(lv.some(x=>x.l===l&&!(x.hi<=lo||x.lo>=hi)))l++;lv.push({lo,hi,l});r.l=l});
 const H=18+(Math.max(...list.map(r=>r.l))+1)*30;svg.setAttribute('height',H);svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 svg.innerHTML=list.map(r=>{const x1=cx(r.pi),x2=cx(r.pj),y=16+r.l*30,c=r.g?'var(--wood)':'var(--fire)',mid=(x1+x2)/2,lab=r.n,tw=lab.length*13+12;
  return `<path d="M${x1} 2V${y}H${x2}V2" fill="none" stroke="${c}" stroke-width="2" ${r.kind==='s'?'stroke-dasharray="5 4"':''} stroke-linejoin="round"/><rect x="${mid-tw/2}" y="${y-10}" width="${tw}" height="20" rx="10" fill="var(--bg)" stroke="${c}"/><text x="${mid}" y="${y+4.5}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">${lab}</text>`}).join('');
}
const relRO=new ResizeObserver(drawRelSvg);relRO.observe($('board'));

/* ============ 22. 인생 운세 그래프 ============ */
let LIFE=null;
function lifeData(C){
 const by=C.inSolar.getYear(),dys=C.e.getYun(C.sex).getDaYun(10).slice(1),pts=[];
 const dr=dys.map(d=>({d,raw:luckRaw(C,d.getGanZhi()).raw}));
 for(let a=0;a<90;a++){const y=by+a,g=Solar.fromYmd(y,7,1).getLunar().getYearInGanZhi(),s=luckRaw(C,g).raw;
  const d=dr.find(x=>y>=x.d.getStartYear()&&y<=x.d.getEndYear());pts.push({a,y,g,s,dv:d?d.raw:null,dg:d?d.d.getGanZhi():''})}
 return pts}
function drawLife(){
 const svg=$('lifesvg');if(!LIFE||!svg.clientWidth)return;
 const W=svg.clientWidth,H=svg.clientHeight,narrow=W<520,m={l:narrow?36:48,r:12,t:14,b:28},iw=W-m.l-m.r,ih=H-m.t-m.b;
 const vals=LIFE.flatMap(p=>[p.s,p.dv]).filter(v=>v!=null),lo=Math.min(...vals)-.2,hi=Math.max(...vals)+.2;
 const X=a=>m.l+iw*a/89,Yp=v=>m.t+ih*(1-(v-lo)/(hi-lo));
 const now=new Date().getFullYear()-LIFE[0].y;
 let dpath='';LIFE.forEach((p,i)=>{if(p.dv==null)return;const x=X(p.a),y=Yp(p.dv);dpath+=(dpath&&LIFE[i-1]&&LIFE[i-1].dv!=null?`H${x}V${y}`:`M${x} ${y}`)});
 const spath=LIFE.map((p,i)=>`${i?'L':'M'}${X(p.a).toFixed(1)} ${Yp(p.s).toFixed(1)}`).join('');
 const ticks=(narrow?[0,20,40,60,80]:[0,10,20,30,40,50,60,70,80]);
 svg.innerHTML=`<line x1="${m.l}" x2="${W-m.r}" y1="${Yp((lo+hi)/2)}" y2="${Yp((lo+hi)/2)}" stroke="var(--line)"/>
  ${ticks.map(t=>`<text x="${X(t)}" y="${H-8}" text-anchor="middle" font-size="12" fill="var(--sub)">${t}세</text>`).join('')}
  <text x="${m.l-6}" y="${m.t+10}" text-anchor="end" font-size="12" fill="var(--sub)">좋음</text><text x="${m.l-6}" y="${m.t+ih}" text-anchor="end" font-size="12" fill="var(--sub)">주의</text>
  ${now>=0&&now<90?`<line x1="${X(now)}" x2="${X(now)}" y1="${m.t}" y2="${m.t+ih}" stroke="var(--ink)" stroke-dasharray="3 3"/><text x="${X(now)+4}" y="${m.t+10}" font-size="12" fill="var(--ink)">현재 ${now}세</text>`:''}
  <path d="${spath}" fill="none" stroke="var(--c2)" stroke-width="1.5" opacity=".75"/>
  <path d="${dpath}" fill="none" stroke="var(--c1)" stroke-width="2.5" stroke-linejoin="round"/>
  <line id="lx" y1="${m.t}" y2="${m.t+ih}" stroke="var(--sub)" visibility="hidden"/><circle id="lc1" r="4.5" fill="var(--c1)" stroke="var(--bg)" stroke-width="2" visibility="hidden"/><circle id="lc2" r="4" fill="var(--c2)" stroke="var(--bg)" stroke-width="2" visibility="hidden"/>
  <rect x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent" id="lhit"/>`;
 const tip=$('lifetip'),hit=$('lhit');
 const show=ev=>{const r=svg.getBoundingClientRect(),cx=(ev.touches?ev.touches[0].clientX:ev.clientX)-r.left,a=Math.max(0,Math.min(89,Math.round((cx-m.l)/iw*89))),p=LIFE[a];
  for(const [id,v] of [['lc1',p.dv],['lc2',p.s]]){const c=$(id);if(v==null){c.setAttribute('visibility','hidden');continue}c.setAttribute('cx',X(a));c.setAttribute('cy',Yp(v));c.setAttribute('visibility','visible')}
  const lx=$('lx');lx.setAttribute('x1',X(a));lx.setAttribute('x2',X(a));lx.setAttribute('visibility','visible');
  tip.hidden=false;tip.innerHTML=`<b>${a}세 · ${p.y}년</b><br>대운 ${p.dg||'시작 전'} · 세운 ${p.g}`;
  const tx=X(a)+12,tw=tip.offsetWidth;tip.style.left=(tx+tw>W?X(a)-tw-12:tx)+'px';tip.style.top=(m.t+4)+'px'};
 const hide=()=>{tip.hidden=true;['lx','lc1','lc2'].forEach(id=>$(id).setAttribute('visibility','hidden'))};
 hit.addEventListener('click',ev=>{const r=svg.getBoundingClientRect(),a=Math.max(0,Math.min(89,Math.round((ev.clientX-r.left-m.l)/iw*89)));openYear(LIFE[a].y)});
 hit.addEventListener('mousemove',show);hit.addEventListener('touchstart',show,{passive:true});hit.addEventListener('touchmove',show,{passive:true});hit.addEventListener('mouseleave',hide);
}
const lifeRO=new ResizeObserver(drawLife);lifeRO.observe($('lifesvg'));
function lifeGraph(C){
 LIFE=lifeData(C);drawLife();
 const dec=[];for(let i=0;i<9;i++){const seg=LIFE.slice(i*10,i*10+10);dec.push({i,v:seg.reduce((a,p)=>a+p.s+(p.dv??p.s),0)/seg.length})}
 const best=[...dec].sort((a,b)=>b.v-a.v)[0],worst=[...dec].sort((a,b)=>a.v-b.v)[0];
 const peaks=[...LIFE].filter(p=>p.a>=15&&p.a<80).sort((a,b)=>b.s-a.s).slice(0,3).sort((a,b)=>a.a-b.a);
 $('lifenote').textContent=`가장 힘이 실리는 시기는 ${best.i*10}대, 쉬어 가며 다질 시기는 ${worst.i*10}대입니다. 해마다 운이 특히 강한 해: ${peaks.map(p=>`${p.y}년(${p.a}세)`).join(', ')}. 그래프에 마우스를 올리거나 손가락으로 짚으면 그해의 간지가 보입니다.`;
}

/* ============ 23. 커플 운세 달력 ============ */
let GA=null,GB=null,GCM=null,GNAMES=['',''];
function drawCoupleCal(){
 if(!GA||!GB)return;if(!GCM){const n=new Date();GCM=new Date(n.getFullYear(),n.getMonth(),1)}
 const y=GCM.getFullYear(),m=GCM.getMonth()+1,days=new Date(y,m,0).getDate(),first=new Date(y,m-1,1).getDay(),t=new Date();
 const ra=[],rb=[];
 for(let d=1;d<=days;d++){const gz=Solar.fromYmd(y,m,d).getLunar().getDayInGanZhi();ra.push({d,gz,...luckRaw(GA,gz)});rb.push({d,gz,...luckRaw(GB,gz)})}
 norm(ra);norm(rb);
 const both=[];
 $('gctitle').textContent=`${y}년 ${m}월`;
 $('gcal').innerHTML=[...WK].map(w=>`<div class="w">${w}</div>`).join('')+'<div class="e"></div>'.repeat(first)+ra.map((a,i)=>{const b=rb[i],lv=Math.min(a.sc,b.sc),cl=a.r.some(x=>x.n==='충')||b.r.some(x=>x.n==='충'),hb=a.sc>=4&&b.sc>=4&&!cl;if(hb)both.push(a.d);
  return `<div class="d l${lv}${t.getFullYear()===y&&t.getMonth()+1===m&&t.getDate()===a.d?' tdy':''}" role="button" tabindex="0" data-day="${y}-${m}-${a.d}">${cl?'<i class="x"></i>':''}<span class="n">${a.d}</span><span class="g">${a.gz}</span><span class="ab">${a.sc}·${b.sc}</span>${hb?'<span class="hb">♥</span>':''}</div>`}).join('');
 $('gcnote').textContent=`${both.length?`이번 달 두 사람 모두 좋은 날(♥): ${both.join(', ')}일.`:'이번 달은 두 사람 모두 좋은 날이 겹치지 않습니다.'} 칸 안의 숫자는 ${GNAMES[0]}·${GNAMES[1]}의 별점(2~5)이고, 붉은 점은 한 사람이라도 일지와 충돌하는 날입니다.`;
}
$('gcprev').addEventListener('click',()=>{GCM=new Date(GCM.getFullYear(),GCM.getMonth()-1,1);drawCoupleCal()});
$('gcnext').addEventListener('click',()=>{GCM=new Date(GCM.getFullYear(),GCM.getMonth()+1,1);drawCoupleCal()});

