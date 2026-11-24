/* detail.js — 상세 패널(대운·세운·날짜) · 이름 비교 */
/* ============ 25. 상세 패널 (대운·세운·날짜) ============ */
const DO={비견:'혼자 집중하는 일, 운동, 새 계획 세우기',겁재:'팀 작업, 사람 만나기, 경쟁이 있는 일',식신:'창작, 취미, 맛있는 식사, 가르치는 일',상관:'발표, 아이디어 회의, 새로운 시도',편재:'영업, 투자 공부, 인맥 넓히기',정재:'정산, 저축, 계약서 검토, 장보기',편관:'어려운 과제 정면 돌파, 강도 높은 운동',정관:'면접, 보고, 공식적인 자리',편인:'공부, 연구, 혼자만의 시간',정인:'자격증 공부, 서류 처리, 어른께 조언 구하기'};
const AVOID={비견:'고집 부리기, 동업 결정',겁재:'충동 구매, 돈 빌려주기·보증',식신:'과식, 늘어지기',상관:'윗사람과 말다툼, 말실수',편재:'무리한 투자, 한 번에 거는 결정',정재:'지나친 절약으로 인색해 보이기',편관:'과로, 무리한 일정',정관:'규칙 위반, 약속 어기기',편인:'혼자 끙끙 앓기, 지나친 의심',정인:'미루기, 남에게 기대기'};
function areaTexts(C,gz){
 const a=tenGod(C.dg,gz[0]),b=tenGod(C.dg,ZM[gz[1]]),tg=[a,b],gs=tg.map(t=>GRP[t]);
 const zr=relB(C.P[1].gz[1],gz[1]),spIn=EL[gz[0]]===spElG(C)||EL[gz[1]]===spElG(C),doh=[C.P[3],C.P[1]].some(p=>SAL.도화.m[TRI[p.gz[1]]]===gz[1]);
 const money=gs.includes('재성')?(tg.includes('편재')?'큰 돈이 오가는 시기입니다. 기회가 크지만 변동성도 커서 분산이 필수입니다.':'꾸준한 수입이 늘고 모으기 좋은 시기입니다.'):gs.includes('식상')?'재능과 아이디어가 수익으로 이어지는 시기입니다.':tg.includes('겁재')?'돈이 들어와도 나가기 쉬우니 보증·동업·충동 지출을 조심하세요.':'큰 변동 없이 지키는 시기입니다. 관리에 집중하세요.';
 const work=tg.includes('정관')?'인정과 승진, 좋은 자리가 따르는 시기입니다.':tg.includes('편관')?'책임과 압박이 커지지만 버티면 한 단계 올라갑니다.':gs.includes('식상')?'새 프로젝트, 이직, 창업 등 변화를 만들기 좋은 시기입니다.':gs.includes('인성')?'공부·자격·문서 운이 좋아 준비한 것이 결실을 맺습니다.':'경쟁이 생기거나 독립하고 싶어지는 시기입니다. 내 영역을 분명히 하세요.';
 const love=[spIn?'배우자 별이 들어와 인연·결혼 이야기가 나오기 좋습니다.':'',doh?'도화가 들어와 매력과 인기가 올라갑니다.':'',zr.some(x=>x.g)?'배우자 자리와 합이라 관계가 가까워집니다.':'',zr.some(x=>x.n==='충')?'배우자 자리와 충이라 관계에 변화가 생기기 쉽습니다.':''].filter(Boolean).join(' ')||'애정운은 잔잔합니다. 지금의 관계를 단단히 하세요.';
 const yE=[EL[gz[0]],EL[gz[1]]];
 const health=(zr.some(x=>x.n==='충')?'일지와 충돌해 사고·부상을 조심하세요. ':'')+(yE.includes(C.gi)?`기신인 ${ELN[C.gi]} 기운이 들어와 ${ORG[C.gi]} 쪽을 챙기세요. `:'')+(yE.includes(C.yong)?`용신 ${ELN[C.yong]} 기운이 들어와 활력이 생깁니다.`:'')||'건강운은 무난합니다.';
 const rel=[];C.P.forEach(p=>{if(p.off)return;relB(p.gz[1],gz[1]).forEach(x=>rel.push(`${p.k}지 ${p.gz[1]}와 ${x.n}`))});
 const yong=yE.includes(C.yong)?'용신 기운이 들어오는 좋은 흐름':yE.includes(C.gi)?'기신 기운이 들어와 신중해야 할 흐름':'중립적인 흐름';
 return {a,b,money,work,love,health,rel,yong}}
function openPanel(title,html){
 $('pt').textContent=title;$('pb').innerHTML=html;$('panel').hidden=false;document.body.style.overflow='hidden';$('pclose').focus();
}
function closePanel(){$('panel').hidden=true;document.body.style.overflow=''}
$('pclose').addEventListener('click',closePanel);
$('panel').addEventListener('click',ev=>{if(ev.target.id==='panel')closePanel();const y=ev.target.closest('[data-sy]');if(y)openYear(+y.dataset.sy)});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!$('panel').hidden)closePanel()});
const areaHTML=T=>`<div class="rd"><div class="rc"><h3>재물</h3><p>${T.money}</p></div><div class="rc"><h3>직장·일</h3><p>${T.work}</p></div><div class="rc"><h3>애정</h3><p>${T.love}</p></div><div class="rc"><h3>건강</h3><p>${T.health}</p></div></div>`;
function openDaeun(i){
 const C=CUR,d=C.e.getYun(C.sex).getDaYun(10).slice(1)[i];if(!d)return;
 const g=d.getGanZhi(),T=areaTexts(C,g),L=luckRaw(C,g),st=Math.max(1,Math.min(5,Math.round(L.raw)));
 const ys=[];for(let y=d.getStartYear();y<=d.getEndYear();y++){const yg=Solar.fromYmd(y,7,1).getLunar().getYearInGanZhi();ys.push({y,yg,...luckRaw(C,yg)})}norm(ys);
 const now=new Date().getFullYear();
 openPanel(`${d.getStartAge()}~${d.getStartAge()+9}세 대운 · ${g}`,`<div class="phead"><div class="big">${g}</div><div>${KO[g[0]]}${KO[g[1]]} 대운 ${stars(st)}<br><span class="age">${d.getStartYear()}~${d.getEndYear()}년 · ${T.yong}</span></div></div>
  <p><b>앞 5년 ${T.a}:</b> ${UN[T.a]}</p><p><b>뒤 5년 ${T.b}:</b> ${UN[T.b]}</p>${T.rel.length?`<p class="age">원국과의 관계: ${T.rel.join(' · ')}</p>`:''}
  ${areaHTML(T)}<h3 class="ph3">이 대운의 해마다 흐름</h3><div class="yl">${ys.map(r=>`<button type="button" data-sy="${r.y}" class="${r.y===now?'now':''}"><b>${r.y}</b><span>${r.yg}</span>${stars(r.sc)}</button>`).join('')}</div><p class="age">연도를 누르면 그해 상세 풀이가 열립니다.</p>`);
}
function openYear(y){
 const C=CUR,g=Solar.fromYmd(y,7,1).getLunar().getYearInGanZhi(),T=areaTexts(C,g),L=luckRaw(C,g),st=Math.max(1,Math.min(5,Math.round(L.raw)));
 const age=y-C.inSolar.getYear(),sj=SJ[C.P[3].gz[1]].indexOf(g[1]);
 const ms=[];for(let m=1;m<=12;m++){const mg=Solar.fromYmd(y,m,15).getLunar().getMonthInGanZhiExact();ms.push({m,mg,...luckRaw(C,mg)})}norm(ms);
 openPanel(`${y}년 (${age}세) · ${g}`,`<div class="phead"><div class="big">${g}</div><div>${KO[g[0]]}${KO[g[1]]}년 ${stars(st)}<br><span class="age">${T.yong}${sj>=0?` · ${['들','눌','날'][sj]}삼재`:''}</span></div></div>
  <p><b>상반기 ${T.a}:</b> ${UN[T.a]}</p><p><b>하반기 ${T.b}:</b> ${UN[T.b]}</p>${T.rel.length?`<p class="age">원국과의 관계: ${T.rel.join(' · ')}</p>`:''}
  ${areaHTML(T)}<h3 class="ph3">월별 흐름</h3><div class="yl">${ms.map(r=>`<div><b>${r.m}월</b><span>${r.mg}</span>${stars(r.sc)}</div>`).join('')}</div>`);
}
const SIJIN=[['子','23~01시'],['丑','01~03시'],['寅','03~05시'],['卯','05~07시'],['辰','07~09시'],['巳','09~11시'],['午','11~13시'],['未','13~15시'],['申','15~17시'],['酉','17~19시'],['戌','19~21시'],['亥','21~23시']];
function hourRows(C,y,m,d){const r=SIJIN.map(([z,t],i)=>{const g=Solar.fromYmdHms(y,m,d,i===0?0:i*2,30,0).getLunar().getTimeInGanZhi();return {z,t,g,...luckRaw(C,g)}});norm(r);return r}
function openDay(y,m,d,people){
 const dt=new Date(y,m-1,d),gz=Solar.fromYmd(y,m,d).getLunar().getDayInGanZhi();
 const blocks=people.map(([C,nm])=>{
  const L=luckRaw(C,gz),st=Math.max(1,Math.min(5,Math.round(L.raw))),hr=hourRows(C,y,m,d);
  const good=[...hr].sort((a,b)=>b.raw-a.raw).slice(0,3).sort((a,b)=>SIJIN.findIndex(x=>x[0]===a.z)-SIJIN.findIndex(x=>x[0]===b.z)),bad=hr.filter(h=>h.r.some(x=>x.n==='충'));
  const extra=[GUI[C.dg].includes(gz[1])?'천을귀인 날이라 도움을 받기 쉽습니다.':'',MUN[C.dg]===gz[1]?'문창귀인 날이라 공부·시험·글쓰기에 좋습니다.':'',L.r.some(x=>x.n==='충')?'일지와 충돌하는 날이라 감정 충돌과 이동 중 사고를 조심하세요.':L.r.some(x=>x.g)?'일지와 합이라 사람 관계가 부드럽게 풀립니다.':''].filter(Boolean);
  return `${nm?`<h3 class="ph3">${esc(nm)}</h3>`:''}<p>${stars(st)} <b>${L.a}의 날</b> — ${UN[L.a]}</p>${extra.map(x=>`<p>${x}</p>`).join('')}
   <div class="rd"><div class="rc"><h3>하면 좋은 일</h3><p>${DO[L.a]}</p></div><div class="rc"><h3>피할 일</h3><p>${AVOID[L.a]}</p></div></div>
   <h3 class="ph3">시간대별 운세</h3><div class="hr">${hr.map(h=>`<div class="${good.includes(h)?'g':''}${bad.includes(h)?' b':''}"><b>${KO[h.z]}시</b><span>${h.t}</span>${'★'.repeat(h.sc)}</div>`).join('')}</div>
   <p class="age">좋은 시간: ${good.map(h=>`${KO[h.z]}시(${h.t})`).join(', ')}${bad.length?` · 피할 시간: ${bad.map(h=>`${KO[h.z]}시(${h.t})`).join(', ')}`:''}</p>`}).join('<hr>');
 openPanel(fmtD(dt)+' · '+gz,`<div class="phead"><div class="big">${gz}</div><div>${KO[gz[0]]}${KO[gz[1]]}일</div></div>${blocks}`);
}

/* ============ 27. 이름 비교 ============ */
let LASTNAME=null,CMP=[];
function drawCmp(){
 if(!CMP.length){$('cmp').innerHTML='<p class="note">이름을 풀이한 뒤 "비교에 추가"를 누르면 최대 4개까지 나란히 비교할 수 있습니다.</p>';return}
 const best=Math.max(...CMP.map(x=>x.score));
 const row=(n,f)=>`<tr><td>${n}</td>${CMP.map(x=>`<td>${f(x)}</td>`).join('')}</tr>`;
 $('cmp').innerHTML=`<div class="scroll"><table class="mt"><thead><tr><th></th>${CMP.map((x,i)=>`<th><span style="font:900 22px 'Noto Serif KR',serif">${esc(x.hz)}</span><br>${esc(x.nm)} <button type="button" class="x" data-cx="${i}" aria-label="${esc(x.nm)} 빼기">×</button></th>`).join('')}</tr></thead><tbody>
  ${row('총점',x=>`<b class="${x.score===best?'gm':''}">${x.score}점</b>${x.score===best&&CMP.length>1?' 최고':''}`)}${row('등급',x=>x.grade)}
  ${row('81수리',x=>`${x.parts[0]}/40`)}${row('4격 수',x=>x.nums.map(n=>`<span class="${GIL.has(n)?'':'gm'}">${n}</span>`).join('·'))}${row('획수 음양',x=>`${x.parts[1]}/10`)}${row('발음오행',x=>`${x.parts[2]}/20`)}${row('자원오행',x=>`${x.parts[3]}/30 ${x.els.map(tagc).join('')}`)}</tbody></table></div>
  <p class="note">붉은 숫자는 흉수입니다. 같은 사주(${esc(CUR&&CUR.v.nm||'현재 입력')}) 기준으로 비교합니다.</p>`;
}
$('cadd').addEventListener('click',()=>{if(!LASTNAME){nameAnalyze()}if(!LASTNAME)return;if(CMP.some(x=>x.hz===LASTNAME.hz&&x.nm===LASTNAME.nm))return;CMP.push(LASTNAME);if(CMP.length>4)CMP.shift();drawCmp()});
$('cmp').addEventListener('click',ev=>{const b=ev.target.closest('[data-cx]');if(!b)return;CMP.splice(+b.dataset.cx,1);drawCmp()});


