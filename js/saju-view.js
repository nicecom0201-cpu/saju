/* saju-view.js — 사주 탭 화면 · 저장 목록 */
/* ============ 8. 사주 화면 ============ */
const FIELDS=['nm','cal','date','time','sex','loc','sect'];
const readForm=()=>{const v={};FIELDS.forEach(k=>v[k]=$(k).value);v.notime=$('notime').checked;return v};
const fillForm=v=>{FIELDS.forEach(k=>{if(v[k]!=null)$(k).value=v[k]});$('notime').checked=!!v.notime;$('time').disabled=!!v.notime};
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let CUR=null;
const cell=c=>`<div class="ch ${EL[c]}">${c}<small>${KO[c]}</small></div>`;
function calc(){
 $('err').textContent='';
 const v=readForm(),C=compute(v);
 if(C.err){$('err').textContent=C.err;return}
 if(ADMIN)LS.set('saju-in',v);CUR=C;
 const {P,e,cnt,dg,solar,inSolar}=C;
 $('board').innerHTML=P.map(p=>`<div class="pil${p.me?' me':''}${p.off?' off':''}">
  <div class="t">${p.t} · ${p.off?'시각 모름':KO[p.gz[0]]+KO[p.gz[1]]}</div>
  <div class="ss">${p.off?'':SS[p.gs]||p.gs}</div>${cell(p.gz[0])}${cell(p.gz[1])}
  <div class="ss">${p.off?'':SS[p.zs[0]]||p.zs[0]}</div>
  <div class="hid">${p.off?'':'지장간 '+p.hid.map(h=>KO[h]).join('·')+' · '+(DS[p.ds]||p.ds)}</div></div>`).join('');
 const L=solar.getLunar();
 const tzNote=C.off===600?'서머타임 기간 출생 (1시간 자동 반영)':C.off===510||C.off===570?'당시 표준시 UTC+8:30'+(C.off===570?' + 서머타임':'')+' 반영':'';
 $('meta').innerHTML=`${v.nm?`<span><b>${esc(v.nm)}</b></span>`:''}<span>양력 <b>${inSolar.getYear()}.${pad(inSolar.getMonth())}.${pad(inSolar.getDay())}${v.notime?'':' '+pad(inSolar.getHour())+':'+pad(inSolar.getMinute())}</b></span>
  <span>음력 <b>${L.getYear()}.${pad(Math.abs(L.getMonth()))}.${pad(L.getDay())}${L.getMonth()<0?' (윤)':''}</b></span>
  ${C.corr?`<span>보정 시각 <b>${pad(solar.getHour())}:${pad(solar.getMinute())}</b> (${C.corr>0?'+':'−'}${Math.abs(C.corr)}분)</span>`:''}
  ${tzNote&&!v.notime?`<span><b>${tzNote}</b></span>`:''}
  <span>띠 <b>${KO[e.getYear()[1]]}띠</b></span>`;
 const R=natalRels(C);RELS=R;drawRelSvg();
 $('rels').innerHTML=R.length?R.map(r=>`<span class="${r.g?'good':'bad'}">${r.t} <b>${r.n}</b></span>`).join('')+'<span>초록: 합(서로 끌어당김) · 빨강: 충·형·파·해·원진(부딪힘)</span>':'<span>원국 안에 특별한 합·충 관계가 없습니다.</span>';
 const tot=Object.values(cnt).reduce((a,b)=>a+b,0);
 $('bars').innerHTML=ORD.map(k=>`<div class="bar"><span>${ELN[k]}</span><div class="tr"><div class="f ${k}" style="width:${cnt[k]/tot*100}%"></div></div><span class="n">${cnt[k]}</span></div>`).join('');
 const lack=ORD.filter(k=>!cnt[k]),much=ORD.filter(k=>cnt[k]>=3);
 $('lack').textContent=(lack.length?`없는 오행: ${lack.map(k=>ELN[k]).join(', ')}. 이름짓기에서 보완할 후보입니다. `:'다섯 오행이 모두 있습니다. ')+(much.length?`많은 오행: ${much.map(k=>ELN[k]).join(', ')}.`:'')+(v.notime?' (시주 제외 6글자 기준)':'');
 const dm=DM[dg];
 $('dm').innerHTML=`<div><span class="big">${dg}</span><b>${KO[dg]}${ELN[EL[dg]].slice(0,1)} · ${dm[0]}</b></div><p>${dm[1]}</p><div class="kw">${dm[2].map(k=>`<span>${k}</span>`).join('')}</div>`;
 const S=sinsal(C);
 $('sins').innerHTML=S.length?S.map(s=>`<div class="rc"><h3>${s.n} <span class="en">${s.w.join('·')}</span></h3><p>${s.d}</p></div>`).join(''):'<div class="rc"><p>원국에 대표적인 신살이 없습니다. 특정 기운에 치우치지 않은 담백한 구조입니다.</p></div>';
 const yun=e.getYun(C.sex),dys=yun.getDaYun(10).slice(1),now=new Date().getFullYear();
 $('dy').innerHTML=dys.map(x=>{const g=x.getGanZhi(),c=now>=x.getStartYear()&&now<=x.getEndYear();
  return `<div class="${c?'now':''}" role="button" tabindex="0" data-dy="${dys.indexOf(x)}"><div class="a">${x.getStartAge()}세~</div><div class="g">${g}</div><div class="a">${KO[g[0]]}${KO[g[1]]} · ${x.getStartYear()}</div></div>`}).join('');
 $('dyn').textContent=`대운은 출생 후 약 ${yun.getStartYear()}년 ${yun.getStartMonth()}개월에 시작합니다. 붉은 테두리가 올해(${now}년)가 속한 대운입니다.`;
 $('rd').innerHTML=reading(C)+curDaYun(C)+(v.notime?'<div class="rc"><h3>참고</h3><p>태어난 시각을 모르면 시주를 빼고 6글자로 풀이합니다.</p></div>':'');
 todayLuck(C);
 lifetime(C);
 drawCal();
 newYear();
 drawYong(C);
 drawMT(C);
 lifeGraph(C);
 $('nsex').value=v.sex;
}

/* ============ 9. 여러 명 저장 ============ */
const people=()=>LS.get('saju-people',[]);
function drawPeople(){
 const L=people();
 if(!ADMIN){$('people').innerHTML='';drawWho();return}
 const CALN={s:'양력',l:'음력',ll:'음력(윤달)'},LOCN=v=>{const o=[...$('loc').options].find(x=>x.value===v);return o?o.textContent:''};
 $('people').innerHTML=L.length?`<table class="mt"><thead><tr><th>이름</th><th>성별</th><th>생년월일</th><th>시각</th><th>달력</th><th>출생지</th><th></th></tr></thead><tbody>${L.map((p,i)=>`<tr><td><b>${esc(p.nm||'이름 없음')}</b></td><td>${p.sex==='1'?'남':'여'}</td><td>${esc(p.date)}</td><td>${p.notime?'모름':esc(p.time||'')}</td><td>${CALN[p.cal]||''}</td><td>${esc(LOCN(p.loc))}</td><td style="white-space:nowrap"><button type="button" class="ghost" data-load="${i}">불러오기</button> <button type="button" class="ghost" data-del="${i}" aria-label="${esc(p.nm)} 삭제">삭제</button></td></tr>`).join('')}</tbody></table>`:'<p class="note">아직 저장한 사람이 없습니다. 위에 이름을 넣고 저장을 누르세요.</p>';
 drawWho();
}
$('sv').addEventListener('click',()=>{if(!ADMIN)return;const v=readForm();if(!v.nm.trim()){$('err').textContent='저장하려면 이름을 입력해 주세요.';$('nm').focus();return}
 const L=people().filter(p=>p.nm!==v.nm);L.push(v);LS.set('saju-people',L);drawPeople();$('err').textContent=`${v.nm} 님을 저장했습니다.`});
$('people').addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b||!ADMIN)return;const L=people();
 if(b.dataset.load!=null){fillForm(L[+b.dataset.load]);run()}
 if(b.dataset.del!=null){L.splice(+b.dataset.del,1);LS.set('saju-people',L);drawPeople()}});

