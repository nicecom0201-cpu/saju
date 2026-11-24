/* tools.js — 공통 도우미 · 내 이름 풀이 · 운세 달력 · 택일 · 신년운세 · 복사 */
/* ============ 13. 공통 도우미 ============ */
const spElG=C=>C.sex?ORD[(ORD.indexOf(EL[C.dg])+2)%5]:ORD[(ORD.indexOf(EL[C.dg])+3)%5];
const WK='일월화수목금토';
const fmtD=d=>`${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} (${WK[d.getDay()]})`;
const SJ={申:'寅卯辰',子:'寅卯辰',辰:'寅卯辰',寅:'申酉戌',午:'申酉戌',戌:'申酉戌',巳:'亥子丑',酉:'亥子丑',丑:'亥子丑',亥:'巳午未',卯:'巳午未',未:'巳午未'};

/* ============ 14. 내 이름 풀이 ============ */
const SLOT={1:['a1','a1h'],2:['a2','a2h']};
// 입력칸에서 첫 번째 완성된 한글 글자만 꺼냄 (조합 중인 자음·모음은 무시)
function sylOf(k){const m=$(SLOT[k][0]).value.match(/[가-힣]/);return m?m[0]:''}
function hjOpts(k){const syl=sylOf(k),sel=$(SLOT[k][1]);if(sel.dataset.syl===syl&&sel.options.length)return;sel.dataset.syl=syl;
 // 1) 직접 고른 작명용 한자(획수·오행 검증) 2) 대법원 인명용 한자 중 자주 쓰는 글자 3) 나머지 인명용 한자
 const cur=syl?HJ.map((h,i)=>[h,i]).filter(([h])=>h[1]===syl||h[2]===syl):[],have=new Set(cur.map(([h])=>h[0]));
 const db=(typeof HJDB!=='undefined'&&HJDB[syl]||[]).map((d,j)=>[d,j]).filter(([d])=>!have.has(d[0]));
 const lab=(c,m,st,e)=>`${c} · ${esc(m||'')} ${syl} (${st}획${e?' · '+ELK[e]:''})`;
 const o1=cur.map(([h,i])=>`<option value="h:${i}">${lab(h[0],h[3],h[4],h[5])}</option>`).concat(db.filter(([d])=>d[4]).map(([d,j])=>`<option value="d:${j}">${lab(d[0],d[3],d[1],d[2])}</option>`));
 const o2=db.filter(([d])=>!d[4]).map(([d,j])=>`<option value="d:${j}">${lab(d[0],d[3],d[1],d[2])}</option>`);
 const tail=`<option value="m">${o1.length+o2.length?'목록에 없음 · 직접 입력':(syl?`'${syl}' 인명용 한자 없음 · 직접 입력`:'글자를 먼저 입력하세요')}</option>`;
 sel.innerHTML=(o1.length?`<optgroup label="자주 쓰는 한자 (${o1.length})">${o1.join('')}</optgroup>`:'')+(o2.length?`<optgroup label="그 밖의 인명용 한자 (${o2.length})">${o2.join('')}</optgroup>`:'')+tail;
 manualUI()}
function manualUI(){const need=[1,2].filter(k=>$(SLOT[k][1]).value==='m'&&sylOf(k));
 const keep={};need.forEach(k=>{['c','s','e'].forEach(f=>{const el=$('m'+k+f);if(el)keep['m'+k+f]=el.value})});
 $('amanual').hidden=!need.length;
 $('amanual').innerHTML=need.map(k=>`<label>${esc(sylOf(k))} 한자<input id="m${k}c" maxlength="1" placeholder="예: 俊"></label>
  <label>원획 수<input id="m${k}s" type="number" min="1" max="40" inputmode="numeric" placeholder="예: 9"></label>
  <label>자원오행<select id="m${k}e"><option value="">모름</option>${ORD.map(o=>`<option value="${o}">${ELN[o]}</option>`).join('')}</select></label>`).join('')
  +(need.length?'<p class="note" style="grid-column:1/-1;margin:0">목록에 없는 한자는 직접 입력할 수 있어요. 원획과 자원오행은 작명용 옥편이나 대법원 인명용 한자 검색에서 확인할 수 있어요.</p>':'');
 Object.entries(keep).forEach(([id,v])=>{if($(id))$(id).value=v})}
function slotChar(k){const syl=sylOf(k),v=$(SLOT[k][1]).value;
 if(!syl)return null;
 if(v.startsWith('h:')){const h=HJ[+v.slice(2)];return {c:h[0],r:syl,s:h[4],e:h[5],m:h[3]}}
 if(v.startsWith('d:')){const d=HJDB[syl][+v.slice(2)];return {c:d[0],r:syl,s:d[1],e:d[2],m:d[3]}}
 const s=Number(($('m'+k+'s')||{}).value),c=(($('m'+k+'c')||{}).value||'').trim();
 if(!s)return {err:`'${syl}'의 원획 수를 입력해 주세요.`};
 return {c:c||'?',r:syl,s,e:$('m'+k+'e').value,m:''}}
const GYEOK=[['원격','초년운 (~20세)','성격의 바탕과 어린 시절의 기초'],['형격','청년운 (20~40세)','사회 진출과 대인 관계, 이름의 중심 기운'],['이격','중년운 (40~60세)','가정과 재물, 사회적 기반'],['정격','말년운·총운','평생의 큰 흐름과 마무리']];
function nameAnalyze(){
 if(!CUR){$('ares').innerHTML='<p class="err">먼저 사주 탭에서 사주를 계산해 주세요.</p>';return}
 const sur=SUR[+$('as').value],c1=slotChar(1),c2=slotChar(2);
 if(!c1){$('ares').innerHTML='<p class="err">이름 첫 글자를 입력해 주세요.</p>';return}
 const chars=[c1,c2].filter(Boolean),bad=chars.find(c=>c.err);if(bad){$('ares').innerHTML=`<p class="err">${esc(bad.err)}</p>`;return}
 const s1=c1.s,s2=c2?c2.s:0;
 const nums=c2?[r81(s1+s2),r81(sur[2]+s1),r81(sur[2]+s2),r81(sur[2]+s1+s2)]:[r81(s1),r81(sur[2]+s1),r81(sur[2]),r81(sur[2]+s1)];
 let score=0;const notes=[];
 nums.forEach(n=>{if(GIL.has(n))score+=10});
 const par=[sur[2],...chars.map(c=>c.s)].map(n=>n%2),bal=!par.every(x=>x===par[0]);score+=bal?10:3;
 const reads=[sur[0],...chars.map(c=>c.r)],sel=reads.map(sndEl),flows=[];
 for(let i=0;i<sel.length-1;i++){const f=sel[i]&&sel[i+1]?flow(sel[i],sel[i+1]):'ok';flows.push(f);score+=({gen:10,same:6,ok:6,clash:0})[f]*(2/(sel.length-1))}
 const cnt=CUR.cnt,none=ORD.filter(k=>!cnt[k]),minv=Math.min(...ORD.map(k=>cnt[k]));
 const need=[CUR.yong],excess=[CUR.gi];
 chars.forEach(c=>{score+=(need.includes(c.e)?15:c.e===CUR.hee?12:excess.includes(c.e)?0:8)*(2/chars.length)});
 score=Math.round(score);
 const grade=score>=85?'매우 좋은 이름':score>=70?'좋은 이름':score>=55?'무난한 이름':'보완을 고려해 볼 만한 이름';
 const nm=sur[0]+chars.map(c=>c.r).join(''),hz=sur[1]+chars.map(c=>c.c).join('');
 const P4=[nums.filter(n=>GIL.has(n)).length*10,bal?10:3,Math.round(flows.reduce((a,f)=>a+({gen:10,same:6,ok:6,clash:0})[f]*(2/flows.length),0)),Math.round(chars.reduce((a,c)=>a+(need.includes(c.e)?15:c.e===CUR.hee?12:excess.includes(c.e)?0:8)*(2/chars.length),0))];
 LASTNAME={hz,nm,score,grade,nums,parts:P4,els:chars.map(c=>c.e)};
 const R=2*Math.PI*52;
 const elT=chars.map(c=>`${esc(c.c)}(${esc(c.r)}) ${tagc(c.e)}${!c.e?'부수로는 오행을 알 수 없는 글자라 중립으로 계산했어요. 옥편의 자원오행을 알면 \'목록에 없음 · 직접 입력\'으로 넣어 주세요.':need.includes(c.e)?'사주에 가장 필요한 용신 기운을 채워 줍니다.':c.e===CUR.hee?'용신을 돕는 희신 기운이라 좋습니다.':excess.includes(c.e)?'이미 많은 기운을 더해 균형을 흔듭니다.':'사주와 무난하게 어울립니다.'}`).join('<br>');
 $('ares').innerHTML=`<div class="gtop" style="margin-top:0"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" stroke-width="12"/><circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${R*score/100} ${R}"/></svg><div><b>${score}</b><span>100점 만점</span></div></div>
 <div><h2 style="margin:0 0 6px"><span style="font:900 40px 'Noto Serif KR',serif">${esc(hz)}</span> ${esc(nm)} · ${grade}</h2>
 <p style="margin:0">${chars.map(c=>c.m?`${esc(c.m)} ${esc(c.r)}`:esc(c.r)).join(' · ')}</p>
 <div class="bars" style="margin-top:14px">${[['81수리 4격',nums.filter(n=>GIL.has(n)).length*10,40],['획수 음양',bal?10:3,10],['발음오행',Math.round(flows.reduce((a,f)=>a+({gen:10,same:6,ok:6,clash:0})[f]*(2/flows.length),0)),20],['자원오행',Math.round(chars.reduce((a,c)=>a+(need.includes(c.e)?15:c.e===CUR.hee?12:excess.includes(c.e)?0:8)*(2/chars.length),0)),30]].map(([n,v,m])=>`<div class="bar" style="grid-template-columns:7em minmax(0,1fr) 3.5em"><span>${n}</span><div class="tr"><div class="f" style="width:${v/m*100}%;background:var(--accent)"></div></div><span class="n">${v}/${m}</span></div>`).join('')}</div></div></div>
 <div class="rd">
  <div class="rc"><h3>81수리 (획수로 보는 운)</h3>${nums.map((n,i)=>`<p><b>${GYEOK[i][0]} ${n}</b> ${GIL.has(n)?'<span class="tag wood">길</span>':'<span class="tag fire">흉</span>'} ${GYEOK[i][1]} · ${GYEOK[i][2]}</p>`).join('')}<p class="age">원획 ${sur[2]}·${chars.map(c=>c.s).join('·')} 기준${c2?'':', 외자 이름은 성과 이름으로 4격을 나눕니다'}.</p></div>
  <div class="rc"><h3>획수 음양 ${bal?'· 조화':'· 치우침'}</h3><p>${[sur[1],...chars.map(c=>c.c)].map((c,i)=>`${esc(c)} ${[sur[2],...chars.map(x=>x.s)][i]}획(${par[i]?'양':'음'})`).join(' · ')}</p><p>${bal?'홀수(양)와 짝수(음) 획이 섞여 있어 음양이 조화롭습니다.':'모든 글자가 '+(par[0]?'홀수(양)':'짝수(음)')+' 획이라 한쪽으로 치우쳤다고 봅니다.'}</p></div>
  <div class="rc"><h3>발음오행 (소리의 흐름)</h3><p>${reads.map((r,i)=>`${esc(r)}(${sel[i]?ELK[sel[i]]:'?'})`).join(' → ')}</p><p>${flows.map(f=>FL[f]).join(' · ')} — ${flows.includes('clash')?'소리 사이에 서로 누르는 상극이 있어 부르는 기운이 부딪힌다고 봅니다.':flows.every(f=>f==='gen')?'소리가 차례로 살려 주는 상생 흐름이라 아주 좋습니다.':'큰 충돌 없이 자연스럽게 이어지는 소리입니다.'}</p></div>
  <div class="rc"><h3>자원오행 (한자의 기운)</h3><p>${elT}</p><p class="age">이 사주의 용신 ${ELN[CUR.yong]} · 희신 ${ELN[CUR.hee]} · 기신 ${ELN[CUR.gi]}</p></div>
 </div><p class="note">작명 이론(81수리·음양·발음오행·자원오행)에 따른 점수입니다. 이름의 가치는 불러 주는 사람들의 마음이 더 크게 좌우합니다.</p>`;
}

/* ============ 15. 운세 달력 ============ */
let CALM=null;
function drawCal(){
 if(!CUR)return;if(!CALM){const n=new Date();CALM=new Date(n.getFullYear(),n.getMonth(),1)}
 const y=CALM.getFullYear(),m=CALM.getMonth()+1,days=new Date(y,m,0).getDate(),first=new Date(y,m-1,1).getDay(),t=new Date();
 const rows=[];for(let d=1;d<=days;d++){const gz=Solar.fromYmd(y,m,d).getLunar().getDayInGanZhi();rows.push({d,gz,...luckRaw(CUR,gz)})}
 norm(rows);
 $('ctitle').textContent=`${y}년 ${m}월`;
 $('calg').innerHTML=[...WK].map(w=>`<div class="w">${w}</div>`).join('')+'<div class="e"></div>'.repeat(first)+rows.map(r=>`<div class="d l${r.sc}${t.getFullYear()===y&&t.getMonth()+1===m&&t.getDate()===r.d?' tdy':''}" role="button" tabindex="0" data-day="${y}-${m}-${r.d}" title="${r.gz} ${r.a}">${r.r.some(x=>x.n==='충')?'<i class="x"></i>':''}<span class="n">${r.d}</span><span class="g">${r.gz}</span><span class="s">${'★'.repeat(r.sc)}</span></div>`).join('');
}
$('cprev').addEventListener('click',()=>{CALM=new Date(CALM.getFullYear(),CALM.getMonth()-1,1);drawCal()});
$('cnext').addEventListener('click',()=>{CALM=new Date(CALM.getFullYear(),CALM.getMonth()+1,1);drawCal()});

/* ============ 16. 택일 ============ */
const TPN={wed:'결혼·약혼',move:'이사·입주',biz:'계약·개업',exam:'시험·면접',trip:'여행·출장'};
function taek(){
 if(!CUR)return;
 const tp=$('tp').value,days=+$('tr').value,people=[CUR];
 if($('tw').checked){const B2=compute(getWho('gb'));if(!B2.err)people.push(B2)}
 const res=[],t0=new Date();
 for(let i=1;i<=days;i++){
  const dt=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()+i),gz=Solar.fromDate(dt).getLunar().getDayInGanZhi();
  let sc=0,ok=true;const why=[];
  for(const C of people){
   const L=luckRaw(C,gz);sc+=L.raw-3;
   const rz=relB(C.P[1].gz[1],gz[1]),ry=relB(C.P[3].gz[1],gz[1]);
   if(rz.some(x=>x.n==='충')){ok=false;break}
   if(ry.some(x=>x.n==='충')){if(tp==='move'){ok=false;break}sc-=1}
   const g=GRP[tenGod(C.dg,gz[0])],tgod=tenGod(C.dg,gz[0]);
   if(GUI[C.dg].includes(gz[1])){sc+=.8;why.push('천을귀인 날')}
   if(tp==='wed'){if(rz.some(x=>x.g)){sc+=1.2;why.push('배우자 자리와 합')}if(EL[gz[0]]===spElG(C)||EL[gz[1]]===spElG(C)){sc+=.8;why.push('배우자 별이 들어옴')}}
   if(tp==='move'){if(ry.some(x=>x.g)){sc+=1;why.push('띠와 합')}if(rz.some(x=>x.g)){sc+=.6;why.push('일지와 합')}}
   if(tp==='biz'){if(g==='재성'){sc+=1;why.push(tgod+' 날 (재물)')}else if(g==='식상'){sc+=.6;why.push(tgod+' 날 (수익 창출)')}else if(tgod==='정관'){sc+=.5;why.push('정관 날 (신용)')}if(tgod==='겁재'){sc-=1}}
   if(tp==='exam'){if(g==='인성'){sc+=1;why.push(tgod+' 날 (학업·문서)')}if(tgod==='정관'){sc+=.8;why.push('정관 날 (합격·인정)')}if(MUN[C.dg]===gz[1]){sc+=1;why.push('문창귀인 날')}}
   if(tp==='trip'){if([C.P[3],C.P[1]].some(p=>SAL.역마.m[TRI[p.gz[1]]]===gz[1])){sc+=1;why.push('역마 날')}if(tgod==='식신'){sc+=.5;why.push('식신 날 (즐거움)')}}
  }
  if(!ok)continue;
  if((tp==='wed'||tp==='move')&&(dt.getDay()===0||dt.getDay()===6)){sc+=.3;why.push('주말')}
  res.push({dt,gz,sc,why:[...new Set(why)]});
 }
 res.sort((a,b)=>b.sc-a.sc);
 const top=res.slice(0,8).sort((a,b)=>a.dt-b.dt);
 $('tres').innerHTML=top.length?top.map(r=>`<div class="rc"><h3>${fmtD(r.dt)} <span class="en">${r.gz}</span></h3><p>${r.why.length?r.why.join(' · '):'무난하게 좋은 날'}</p></div>`).join('')+`<p class="note" style="grid-column:1/-1">${TPN[tp]}에 좋은 날 ${top.length}개 (${people.length>1?'두 사람 모두':'내 사주'} 기준). 일지와 충돌하는 날${tp==='move'?'과 띠와 충돌하는 날':''}은 미리 뺐습니다.</p>`:'<div class="rc"><p>기간 안에 조건에 맞는 날이 없습니다. 기간을 늘려 보세요.</p></div>';
}
$('tgo').addEventListener('click',()=>{try{taek()}catch(e){$('tres').textContent='오류: '+e.message}});

/* ============ 17. 신년운세 ============ */
function newYear(){
 if(!CUR)return;const C=CUR,Y=+$('ny').value,gz=Solar.fromYmd(Y,7,1).getLunar().getYearInGanZhi();
 const a=tenGod(C.dg,gz[0]),b=tenGod(C.dg,ZM[gz[1]]),L=luckRaw(C,gz),st=Math.max(1,Math.min(5,Math.round(L.raw)));
 const ga=GRP[a],gb=GRP[b],gs=[ga,gb],tg=[a,b];
 const sj=SJ[C.P[3].gz[1]],si=sj.indexOf(gz[1]);
 const samT=si<0?'':`<div class="rc"><h3>삼재 · ${['들삼재','눌삼재','날삼재'][si]}</h3><p>${KO[C.P[3].gz[1]]}띠에게 ${Y}년은 삼재 ${['첫해(들삼재)','둘째 해(눌삼재)','마지막 해(날삼재)'][si]}입니다. ${['새로운 일을 크게 벌이기보다 기존 일을 다지는 게 좋습니다.','가장 조심할 해로 봅니다. 건강·계약·보증을 꼼꼼히 챙기세요.','어려움이 끝나 가는 해라 마무리를 잘하면 다음 해부터 풀립니다.'][si]}</p><p class="age">삼재는 띠 기준의 민속 신앙으로, 사주 전체의 흐름과 함께 참고하세요.</p></div>`;
 const pr=[];C.P.forEach(p=>{if(p.off)return;relB(p.gz[1],gz[1]).forEach(x=>pr.push(`${p.k}지 ${p.gz[1]}와 ${x.n}`))});
 const money=gs.includes('재성')?(tg.includes('편재')?'큰 돈이 오가는 해입니다. 투자·사업 기회가 오지만 변동성이 커서 분산이 필수입니다.':'꾸준한 수입이 늘어나는 해입니다. 저축과 자산 관리에 좋습니다.'):gs.includes('식상')?'재능이 돈이 되는 해입니다. 부업, 프리랜서, 새 아이디어로 수익을 만들기 좋습니다.':tg.includes('겁재')?'돈이 들어와도 나가기 쉬운 해입니다. 보증·동업·충동 지출을 조심하세요.':tg.includes('비견')?'독립 자금을 모으거나 내 힘으로 기반을 다지는 해입니다.':'큰 변동 없이 지키는 해입니다. 새 투자보다 관리에 집중하세요.';
 const work=tg.includes('정관')?'승진·인정·좋은 자리를 얻는 해입니다. 조직 안에서 평가가 좋아집니다.':tg.includes('편관')?'책임과 압박이 커지는 해입니다. 힘들지만 버티면 한 단계 올라갑니다. 이직 유혹은 신중하게.':gs.includes('식상')?'새 프로젝트, 창업, 이직 등 변화를 만들고 싶어지는 해입니다. 실력을 보여 줄 무대가 생깁니다.':gs.includes('인성')?'공부·자격증·문서 운이 좋은 해입니다. 배우고 준비하는 일이 결실을 맺습니다.':'경쟁자가 나타나거나 독립하고 싶어지는 해입니다. 내 영역을 분명히 하세요.';
 const zr=relB(C.P[1].gz[1],gz[1]),spIn=EL[gz[0]]===spElG(C)||EL[gz[1]]===spElG(C),doh=[C.P[3],C.P[1]].some(p=>SAL.도화.m[TRI[p.gz[1]]]===gz[1]);
 const love=[spIn?'배우자 별이 들어와 새로운 인연이나 결혼 이야기가 나오기 좋은 해입니다.':'',doh?'도화가 들어와 인기와 매력이 올라가는 해입니다.':'',zr.some(x=>x.g)?'배우자 자리와 합이라 연인·부부 관계가 한층 가까워집니다.':'',zr.some(x=>x.n==='충')?'배우자 자리와 충이라 관계에 변화가 생기기 쉽습니다. 대화를 늘리세요.':''].filter(Boolean).join(' ')||'연애운은 잔잔한 해입니다. 지금의 관계를 단단히 하는 데 집중하세요.';
 const yE=[EL[gz[0]],EL[gz[1]]],over=yE.filter(k=>C.cnt[k]>=3),fill=yE.filter(k=>C.cnt[k]===0);
 const health=(zr.some(x=>x.n==='충')?'일지와 충돌하는 해라 이동 중 사고·부상을 조심하세요. ':'')+(over.length?`이미 많은 ${[...new Set(over)].map(k=>ELN[k]).join(', ')} 기운이 더해져 ${[...new Set(over)].map(k=>ORG[k]).join(', ')} 쪽을 챙기세요. `:'')+(fill.length?`부족했던 ${[...new Set(fill)].map(k=>ELN[k]).join(', ')} 기운이 들어와 활력이 생깁니다.`:'')||'건강운은 무난합니다. 규칙적인 생활만 유지하면 됩니다.';
 const rows=[];for(let m=1;m<=12;m++){const g=Solar.fromYmd(Y,m,15).getLunar().getMonthInGanZhiExact();rows.push({m,g,...luckRaw(C,g)})}norm(rows);
 const best=[...rows].sort((x,y)=>y.raw-x.raw).slice(0,3).map(r=>r.m+'월').join(', '),worst=rows.filter(r=>r.r.some(x=>x.n==='충')).map(r=>r.m+'월');
 $('nyr').innerHTML=`<div class="rc today"><div><div class="age">${Y}년 총운</div><div class="big">${gz}</div><div>${KO[gz[0]]}${KO[gz[1]]}년 ${stars(st)}</div></div>
  <div><p><b>상반기 ${a}:</b> ${UN[a]}</p><p><b>하반기 ${b}:</b> ${UN[b]}</p>${pr.length?`<p class="age">원국과의 관계: ${pr.join(' · ')}</p>`:''}</div></div>
  <div class="rd" style="margin-top:14px">
  <div class="rc"><h3>재물운</h3><p>${money}</p></div><div class="rc"><h3>직장·사업운</h3><p>${work}</p></div>
  <div class="rc"><h3>애정운</h3><p>${love}</p></div><div class="rc"><h3>건강운</h3><p>${health}</p></div>
  ${samT}<div class="rc"><h3>좋은 달 · 조심할 달</h3><p>가장 좋은 달: <b>${best}</b></p><p>${worst.length?`조심할 달: <b>${worst.join(', ')}</b> (일지와 충돌)`:'특별히 조심할 달은 없습니다.'}</p></div></div>
  <div class="mo" style="margin-top:14px">${rows.map(r=>`<div><div class="h"><b>${r.m}월</b><span class="g">${r.g}</span></div>${stars(r.sc)}<p>${r.a} · ${UN[r.a].split('.')[0].replace('의 흐름','')}</p></div>`).join('')}</div>`;
}
{const n=new Date(),y0=n.getFullYear(),def=n.getMonth()>=9?y0+1:y0;$('ny').innerHTML=[y0,y0+1,y0+2].map(y=>`<option value="${y}"${y===def?' selected':''}>${y}년 (${Solar.fromYmd(y,7,1).getLunar().getYearInGanZhi()})</option>`).join('')}
$('ny').addEventListener('change',()=>{try{newYear()}catch(e){$('nyr').textContent='오류: '+e.message}});

/* ============ 18. 복사 ============ */
function copyOut(kind,btn){
 let t='';
 if(kind==='saju'){const v=$('v-saju');t='[사주 만세력]\n'+$('meta').innerText+'\n'+CUR.P.map(p=>`${p.t} ${p.off?'?':p.gz}`).join(' / ')+'\n\n'+[...v.querySelectorAll('section')].slice(1).map(s=>s.innerText.trim()).join('\n\n')}
 else if(kind==='match')t='[궁합]\n'+$('gres').innerText;
 else t='[이름 풀이]\n'+$('ares').innerText;
 t=t.replace(/\n{3,}/g,'\n\n').trim();
 const done=()=>{btn.textContent='복사했습니다';setTimeout(()=>btn.textContent=btn.dataset.l,1800)};
 const fallback=()=>{let ta=btn.parentElement.querySelector('.copybox');if(!ta){ta=document.createElement('textarea');ta.className='copybox';ta.readOnly=true;btn.parentElement.appendChild(ta)}ta.value=t;ta.focus();ta.select();btn.textContent='아래 글을 선택해 복사하세요'};
 try{navigator.clipboard.writeText(t).then(done,fallback)}catch(e){fallback()}
}
document.querySelectorAll('[data-copy]').forEach(b=>{b.dataset.l=b.textContent;b.addEventListener('click',()=>{try{copyOut(b.dataset.copy,b)}catch(e){b.textContent='먼저 결과를 계산해 주세요'}})});

