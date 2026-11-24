/* extra-tabs.js — 운세·택일 탭 상단 안내, 띠별 운세, 만세력 탭 */

/* ============ 29. 기준 사람 안내줄 (운세·택일 탭) ============ */
function drawWhoBars(C){
 const v=C.v,s=C.inSolar,txt=`<b>${esc(v.nm||'사주 탭에 입력한 사람')}</b><span class="age">양력 ${s.getYear()}.${pad(s.getMonth())}.${pad(s.getDay())}${v.notime?'':' '+pad(s.getHour())+':'+pad(s.getMinute())} · ${KO[C.dg]}${ELK[EL[C.dg]]} 일간 · ${KO[C.P[3].gz[1]]}띠</span> 기준<a href="#saju">사주 바꾸기 →</a>`;
 for(const id of ['wb1','wb2'])$(id).innerHTML=txt;
}

/* ============ 30. 띠별 운세 ============ */
const DDNAME={子:'쥐',丑:'소',寅:'호랑이',卯:'토끼',辰:'용',巳:'뱀',午:'말',未:'양',申:'원숭이',酉:'닭',戌:'개',亥:'돼지'};
const DDP={d:['오늘','날'],m:['이번 달','달'],y:['올해','해']};
let DDMODE='d';
function ddGz(mode){const n=new Date(),l=Solar.fromYmdHms(n.getFullYear(),n.getMonth()+1,n.getDate(),12,0,0).getLunar();
 return mode==='d'?l.getDayInGanZhi():mode==='m'?l.getMonthInGanZhiExact():Solar.fromYmd(n.getFullYear(),7,1).getLunar().getYearInGanZhi()}
function ddLuck(b,gz,mode){
 let s=3;const r=relB(b,gz[1]),E=ORD.indexOf(EL[b]),why=[];
 if(r.some(x=>x.g)){s+=1;why.push('hap')}
 if(r.some(x=>x.n==='충')){s-=1.5;why.push('chung')}else if(r.some(x=>x.n==='원진'||x.n==='형')){s-=.8;why.push('won')}else if(r.some(x=>x.n==='해'||x.n==='파')){s-=.5;why.push('hae')}
 for(const c of gz){const k=ORD.indexOf(EL[c]);if((k+1)%5===E){s+=.5;why.push('gen')}else if(k===E)s+=.2;else if((k+2)%5===E){s-=.5;why.push('ctl')}else if((E+2)%5===k)s+=.2}
 let sam=-1;if(mode==='y'){sam=SJ[b].indexOf(gz[1]);if(sam>=0)s-=.7}
 return {st:Math.max(1,Math.min(5,Math.round(s))),why,sam}}
function ddText(L,p){
 const w=L.why;
 if(w.includes('chung'))return `변동과 충돌이 많은 ${p}입니다. 큰 결정은 미루고 몸을 아끼세요.`;
 if(w.includes('hap'))return `귀인과 인연이 닿는 ${p}입니다. 도움을 청하면 일이 쉽게 풀립니다.`;
 if(w.includes('won'))return `사소한 말다툼을 조심할 ${p}입니다. 한 박자 쉬어 가세요.`;
 if(w.includes('hae'))return `약속이 틀어지기 쉬운 ${p}입니다. 일정을 한 번 더 확인하세요.`;
 if(w.includes('gen'))return `기운을 북돋아 주는 ${p}입니다. 새로 시작하기 좋습니다.`;
 if(w.includes('ctl'))return `압박을 느끼기 쉬운 ${p}입니다. 무리하지 말고 페이스를 지키세요.`;
 return `무난하게 흘러가는 ${p}입니다. 하던 일에 꾸준히 집중하세요.`}
function ddYears(b){const out=[];for(let y=1950;y<=new Date().getFullYear();y++)if('子丑寅卯辰巳午未申酉戌亥'[(y-4)%12]===b)out.push(y);return out.slice(-6).map(y=>String(y).slice(2)).join('·')+'년생'}
function drawDdi(){
 const gz=ddGz(DDMODE),[lab,unit]=DDP[DDMODE],mine=CUR?CUR.P[3].gz[1]:'';
 $('ddg').innerHTML=[...'子丑寅卯辰巳午未申酉戌亥'].map(b=>{const L=ddLuck(b,gz,DDMODE),gen=ORD[(ORD.indexOf(EL[b])+4)%5];
  return `<div class="${b===mine?'me':''}"><div class="hd"><span class="zz ${EL[b]}" style="background:var(--${EL[b]})">${b}</span><div><div class="nm">${DDNAME[b]}띠${b===mine?' · 내 띠':''}</div><div class="yr">${ddYears(b)}</div></div></div>
   <p>${stars(L.st)}</p><p>${ddText(L,unit)}${L.sam>=0?` ${['들','눌','날'][L.sam]}삼재에 해당합니다.`:''}</p><p class="age">행운의 색 ${LK[gen][1]}</p></div>`}).join('');
 $('ddnote').textContent=`${lab}의 간지 ${gz}(${KO[gz[0]]}${KO[gz[1]]}) 기준입니다. 띠는 설날이 아니라 입춘(2월 4일 무렵)에 바뀌므로, 1월~2월 초 출생은 앞 해의 띠일 수 있어요.`;
}
$('ddsel').addEventListener('click',ev=>{const b=ev.target.closest('[data-p]');if(!b)return;DDMODE=b.dataset.p;$('ddsel').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));drawDdi()});

/* ============ 31. 만세력 ============ */
const JQK={'立春':['입춘','立春',1],'雨水':['우수','雨水',0],'惊蛰':['경칩','驚蟄',1],'春分':['춘분','春分',0],'清明':['청명','淸明',1],'谷雨':['곡우','穀雨',0],'立夏':['입하','立夏',1],'小满':['소만','小滿',0],'芒种':['망종','芒種',1],'夏至':['하지','夏至',0],'小暑':['소서','小暑',1],'大暑':['대서','大暑',0],'立秋':['입추','立秋',1],'处暑':['처서','處暑',0],'白露':['백로','白露',1],'秋分':['추분','秋分',0],'寒露':['한로','寒露',1],'霜降':['상강','霜降',0],'立冬':['입동','立冬',1],'小雪':['소설','小雪',0],'大雪':['대설','大雪',1],'冬至':['동지','冬至',0],'小寒':['소한','小寒',1],'大寒':['대한','大寒',0]};
const JQPIN={DA_XUE:'大雪',DONG_ZHI:'冬至',XIAO_HAN:'小寒',DA_HAN:'大寒',LI_CHUN:'立春',YU_SHUI:'雨水',JING_ZHE:'惊蛰'};
// 라이브러리의 절기 시각(중국 표준시 UTC+8)을 한국 표준시(UTC+9)로 바꿈
const toKST=s=>new Date(s.getYear(),s.getMonth()-1,s.getDay(),s.getHour(),s.getMinute()+60,s.getSecond());
const JQCACHE={};
function jqYear(Y){
 if(JQCACHE[Y])return JQCACHE[Y];
 const seen=new Set(),out=[];
 for(const ly of [Y-1,Y,Y+1]){const t=Lunar.fromYmd(ly,6,1).getJieQiTable();
  for(const [k,s] of Object.entries(t)){const cn=JQPIN[k]||k;if(!JQK[cn])continue;const d=toKST(s);if(d.getFullYear()!==Y)continue;const key=cn+d.toDateString();if(seen.has(key))continue;seen.add(key);out.push({cn,d})}}
 out.sort((a,b)=>a.d-b.d);return JQCACHE[Y]=out}
const fmtT=d=>`${d.getMonth()+1}월 ${d.getDate()}일 (${WK[d.getDay()]}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
function drawJQ(){
 const Y=+$('jqy').value,L=jqYear(Y),now=new Date(),nx=L.find(x=>x.d>now);
 $('jqh').textContent=`${Y}년 24절기`;
 $('jqt').innerHTML=`<thead><tr><th>절기</th><th>한자</th><th>날짜·시각</th><th>구분</th></tr></thead><tbody>${L.map(x=>{const k=JQK[x.cn];return `<tr class="${x===nx?'now':''}"><td>${k[0]}</td><td>${k[1]}</td><td>${fmtT(x.d)}</td><td>${k[2]?'● 절입 (월 바뀜)':'중기'}</td></tr>`}).join('')}</tbody>`;
}
function manseQuery(){
 $('merr').textContent='';const cal=$('mcal').value,dv=$('mdate').value;if(!dv){$('merr').textContent='날짜를 입력해 주세요.';return}
 const [y,m,d]=dv.split('-').map(Number);let s;
 try{s=cal==='s'?Solar.fromYmd(y,m,d):Lunar.fromYmd(y,cal==='ll'?-m:m,d).getSolar()}catch(e){$('merr').textContent='존재하지 않는 날짜입니다. 음력·윤달 여부를 확인해 주세요.';return}
 const l=Solar.fromYmdHms(s.getYear(),s.getMonth(),s.getDay(),12,0,0).getLunar(),dt=new Date(s.getYear(),s.getMonth()-1,s.getDay());
 const yg=l.getYearInGanZhiExact(),mg=l.getMonthInGanZhiExact(),dg=l.getDayInGanZhi();
 const jl=jqYear(s.getYear()).concat(jqYear(s.getYear()-1),jqYear(s.getYear()+1)).sort((a,b)=>a.d-b.d);
 const end=new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),23,59),prev=[...jl].reverse().find(x=>x.d<=end),next=jl.find(x=>x.d>end);
 const today=new Date();today.setHours(0,0,0,0);const diff=Math.round((dt-today)/864e5);
 const jqDay=jl.find(x=>x.d.toDateString()===dt.toDateString());
 const cell=(k,v,sm='')=>`<div><div class="k">${k}</div><div class="v">${v}${sm?`<small>${sm}</small>`:''}</div></div>`;
 let mine='';if(CUR){const L=luckRaw(CUR,dg),st=Math.max(1,Math.min(5,Math.round(L.raw)));mine=`<div class="rc" style="margin-top:12px"><h3>${esc(CUR.v.nm||'내 사주')} 기준 이날</h3><p>${stars(st)} <b>${L.a}의 날</b> — ${UN[L.a]}</p></div>`}
 $('mres').innerHTML=`<div class="mgrid">
  ${cell('양력',`${s.getYear()}.${pad(s.getMonth())}.${pad(s.getDay())}`,WK[dt.getDay()]+'요일')}
  ${cell('음력',`${l.getYear()}.${pad(Math.abs(l.getMonth()))}.${pad(l.getDay())}`,l.getMonth()<0?'윤달':'')}
  ${cell('연주',yg,`${KO[yg[0]]}${KO[yg[1]]}년 · ${DDNAME[yg[1]]}띠`)}
  ${cell('월주',mg,`${KO[mg[0]]}${KO[mg[1]]}월`)}
  ${cell('일주 (일진)',dg,`${KO[dg[0]]}${KO[dg[1]]}일`)}
  ${cell('절기',prev?JQK[prev.cn][0]:'',next?`다음 ${JQK[next.cn][0]} ${next.d.getMonth()+1}/${next.d.getDate()}`:'')}
  ${cell('오늘부터',diff===0?'오늘':diff>0?`${diff}일 뒤`:`${-diff}일 전`)}
 </div>${jqDay?`<p class="note">이날 ${fmtT(jqDay.d)}에 ${j(JQK[jqDay.cn][0],'이','가')} 듭니다.${JQK[jqDay.cn][2]?' 이 시각 전후로 월주가 바뀌므로, 사주를 볼 때는 태어난 시각까지 넣어 사주 탭에서 확인하세요.':''}</p>`:''}${mine}`;
}
let MM=null;
function drawManseCal(){
 if(!MM){const n=new Date();MM=new Date(n.getFullYear(),n.getMonth(),1)}
 const y=MM.getFullYear(),m=MM.getMonth()+1,days=new Date(y,m,0).getDate(),first=new Date(y,m-1,1).getDay(),t=new Date();
 const jq={};jqYear(y).forEach(x=>{if(x.d.getMonth()+1===m)jq[x.d.getDate()]=JQK[x.cn][0]});
 $('mmtitle').textContent=`${y}년 ${m}월`;
 let cells='';for(let d=1;d<=days;d++){const l=Solar.fromYmdHms(y,m,d,12,0,0).getLunar(),dt=new Date(y,m-1,d);
  const lu=l.getDay()===1?`음 ${l.getMonth()<0?'윤':''}${Math.abs(l.getMonth())}.1`:`음 ${l.getDay()}`;
  cells+=`<div class="d${dt.getDay()===0?' sun':''}${t.toDateString()===dt.toDateString()?' tdy':''}" role="button" tabindex="0" data-md="${y}-${pad(m)}-${pad(d)}"><span class="n">${d}</span><span class="lu">${lu}</span><span class="g">${l.getDayInGanZhi()}</span>${jq[d]?`<span class="jq">${jq[d]}</span>`:''}</div>`}
 $('mmcal').innerHTML=[...WK].map(w=>`<div class="w">${w}</div>`).join('')+'<div class="e"></div>'.repeat(first)+cells;
}
{const y0=new Date().getFullYear();$('jqy').innerHTML=[y0-1,y0,y0+1,y0+2].map(y=>`<option value="${y}"${y===y0?' selected':''}>${y}년</option>`).join('')}
$('jqy').addEventListener('change',()=>{try{drawJQ()}catch(e){$('jqt').textContent='오류: '+e.message}});
$('mgo').addEventListener('click',()=>{try{manseQuery()}catch(e){$('merr').textContent='오류: '+e.message}});
$('mtoday').addEventListener('click',()=>{const n=new Date();$('mcal').value='s';$('mdate').value=`${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())}`;manseQuery()});
$('mf').addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();manseQuery()}});
$('mmprev').addEventListener('click',()=>{MM=new Date(MM.getFullYear(),MM.getMonth()-1,1);drawManseCal()});
$('mmnext').addEventListener('click',()=>{MM=new Date(MM.getFullYear(),MM.getMonth()+1,1);drawManseCal()});
for(const t of ['click','keydown'])$('mmcal').addEventListener(t,ev=>{const c=ev.target.closest('[data-md]');if(!c)return;if(t==='keydown'&&ev.key!=='Enter'&&ev.key!==' ')return;ev.preventDefault&&t==='keydown'&&ev.preventDefault();$('mcal').value='s';$('mdate').value=c.dataset.md;manseQuery();$('mres').scrollIntoView({behavior:'smooth',block:'center'})});
function initManse(){if($('mmcal').innerHTML)return;const n=new Date();$('mdate').value=`${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())}`;manseQuery();drawManseCal();drawJQ()}
