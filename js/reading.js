/* reading.js — 풀이 문장 · 오늘/월별 운세 · 평생 사주 */
/* ============ 6. 풀이 문장 ============ */
const GT={
 비겁:['자립심과 경쟁심이 강하고 주관이 뚜렷합니다. 동료·친구 같은 수평적 관계에서 힘을 얻습니다.','독립 사업, 스포츠, 영업, 팀 프로젝트','모든 걸 혼자 짊어지기 쉬워요. 도움을 요청하는 연습이 도움이 됩니다.'],
 식상:['표현력과 창의력이 좋아 말·글·기술로 재능을 드러냅니다. 즐기면서 할 때 성과가 납니다.','기획, 콘텐츠·예술, 교육·강의, 요리, 개발','생각을 밖으로 꺼내는 연습(글쓰기, 발표)을 하면 좋아요.'],
 재성:['현실 감각과 계산이 빠르고 결과와 실속을 중시합니다. 기회를 알아보는 눈이 있습니다.','금융·투자, 사업, 유통·무역, 회계','돈 관리는 감보다 자동이체·가계부 같은 시스템으로 하는 게 좋아요.'],
 관성:['책임감과 규칙 의식이 강하고 조직 안에서 인정받는 힘이 있습니다.','공무원, 대기업·관리직, 법률·행정, 군경','자유로운 대신 스스로 규칙과 마감을 정해두면 좋아요.'],
 인성:['배우고 생각하는 힘이 크며 인내심과 수용력이 있습니다. 윗사람의 도움을 받기 쉽습니다.','연구·학문, 교육, 자격증 전문직, 상담','쉬고 배우는 시간을 의식적으로 확보하면 좋아요.']};
const UN={비견:'독립·자기 주도의 흐름. 새로 시작하거나 홀로서기에 좋고, 경쟁자 등장에 유의합니다.',
 겁재:'사람과 경쟁이 많아지는 흐름. 협업 기회가 오지만 지출·보증·동업은 조심합니다.',
 식신:'재능을 펼치고 여유를 누리는 흐름. 만들고 가르치고 즐기는 일이 잘 풀립니다.',
 상관:'변화와 표현의 흐름. 아이디어가 넘치고 틀을 깨고 싶어지며, 말실수와 윗사람과의 마찰에 주의합니다.',
 편재:'큰 돈이 움직이는 흐름. 사업·투자 기회가 오지만 변동성도 커서 무리한 베팅은 피합니다.',
 정재:'안정적인 수입의 흐름. 꾸준히 모으고 관리하기 좋습니다.',
 편관:'압박과 도전의 흐름. 책임이 무거워지지만 버티고 돌파하면 크게 성장합니다.',
 정관:'인정과 승진의 흐름. 조직에서 자리를 잡고 평판이 올라갑니다.',
 편인:'직관과 전환의 흐름. 새로운 공부나 특수 분야에 끌리고 생각이 많아집니다.',
 정인:'배움과 지원의 흐름. 문서·자격·계약 운이 있고 윗사람의 도움이 들어옵니다.'};
const XS={wood:'추진력은 크지만 고집이 세질 수 있어요',fire:'열정이 넘치지만 급해질 수 있어요',earth:'신중하고 듬직하지만 변화에 느릴 수 있어요',metal:'결단은 빠르지만 말이 날카로워질 수 있어요',water:'생각이 깊지만 걱정이 많아질 수 있어요'};
const LK={wood:['새로 시작하는 힘','초록','3·8','동쪽'],fire:['표현과 열정','빨강','2·7','남쪽'],earth:['꾸준함과 중심','노랑','5·10','중앙'],metal:['마무리와 결단','흰색','4·9','서쪽'],water:['유연함과 휴식','검정·남색','1·6','북쪽']};

function reading(C){
 const {gc,st,sc,n,cnt,dg}=C;
 const stT={신강:'나를 돕는 기운이 강한 사주입니다. 밀어붙이는 힘이 좋아서 식상·재성·관성(표현·재물·일)으로 에너지를 쓸 때 균형이 맞는다고 봅니다.',
  신약:'주변 영향을 잘 받는 섬세한 사주입니다. 인성·비겁(배움·사람의 도움)이 들어올 때 힘을 얻고, 무리한 확장보다 내실이 맞습니다.',
  중화:'나를 돕는 힘과 쓰는 힘이 비슷한 균형형 사주입니다. 상황에 맞춰 유연하게 움직이는 장점이 있습니다.'}[st];
 const mx=Math.max(...Object.values(gc)),tops=Object.keys(gc).filter(k=>gc[k]===mx),miss=Object.keys(gc).filter(k=>!gc[k]);
 const sub=Object.keys(gc).filter(k=>gc[k]&&gc[k]<mx).sort((a,b)=>gc[b]-gc[a])[0];
 const many=ORD.filter(k=>cnt[k]>=3),none=ORD.filter(k=>!cnt[k]);
 const yr=new Date().getFullYear(),ygz=Solar.fromYmd(yr,7,1).getLunar().getYearInGanZhi();
 const yg1=tenGod(dg,ygz[0]),yg2=tenGod(dg,ZM[ygz[1]]);
 return [
 `<div class="rc"><h3>기본 성향 · ${st}</h3><p>${stT}</p><p>나를 돕는 기운의 비율 ${C.Y.pct}% (월지·일지 가중치 포함). 자세한 내용은 아래 용신 분석에 있습니다.</p></div>`,
 `<div class="rc"><h3>십신 분포 · ${tops.join('·')} 중심</h3><div class="tg">${Object.keys(gc).map(k=>`<div><span>${k}</span><i style="width:${mx?gc[k]/mx*100:0}%"></i><b>${gc[k]}</b></div>`).join('')}</div>${tops.map(k=>`<p><b>${k}:</b> ${GT[k][0]}</p>`).join('')}${miss.length?`<p>${miss.join('·')} 기운이 없어요. ${miss.map(k=>GT[k][2]).join(' ')}</p>`:''}</div>`,
 `<div class="rc"><h3>적성 · 잘 맞는 분야</h3>${tops.map(k=>`<p><b>${k}</b> 기운이 강해 <b>${GT[k][1]}</b> 쪽에서 강점이 드러난다고 봅니다.</p>`).join('')}${sub&&tops.length===1?`<p>보조 기운 ${sub}: ${GT[sub][1]}</p>`:''}</div>`,
 `<div class="rc"><h3>오행 균형</h3>${many.length?`<p>${many.map(tagc).join('')}${many.map(k=>XS[k]).join(', ')}.</p>`:'<p>한쪽으로 크게 치우친 오행은 없습니다.</p>'}${none.length?`<p>${none.map(tagc).join('')}기운이 없어 ${none.map(k=>LK[k][0]).join(', ')}을 보완하면 좋아요. 행운의 색: ${none.map(k=>LK[k][1]).join(', ')}.</p>`:''}</div>`,
 `<div class="rc"><h3>${yr}년 운세 · ${ygz} (${KO[ygz[0]]}${KO[ygz[1]]})년</h3><p><b>상반기 ${yg1}:</b> ${UN[yg1]}</p><p><b>하반기 ${yg2}:</b> ${UN[yg2]}</p></div>`].join('');
}
function curDaYun(C){const now=new Date().getFullYear(),d=C.e.getYun(C.sex).getDaYun(10).slice(1).find(x=>now>=x.getStartYear()&&now<=x.getEndYear());
 if(!d)return '';const g=d.getGanZhi(),a=tenGod(C.dg,g[0]),b=tenGod(C.dg,ZM[g[1]]);
 return `<div class="rc"><h3>현재 대운 · ${g} (${d.getStartAge()}~${d.getStartAge()+9}세)</h3><p><b>앞 5년 ${a}:</b> ${UN[a]}</p><p><b>뒤 5년 ${b}:</b> ${UN[b]}</p></div>`}

/* 운의 점수: 필요한 십신이면 +, 해로운 십신이면 −, 부족한 오행 +, 넘치는 오행 −, 일지와 충 −, 합 + */
function luckRaw(C,gz){
 const a=tenGod(C.dg,gz[0]),b=tenGod(C.dg,ZM[gz[1]]);let sc=3;
 [a,b].forEach(t=>{if(C.good.includes(GRP[t]))sc+=.5;else if(C.bad.includes(GRP[t]))sc-=.5});
 [gz[0],gz[1]].forEach(c=>{const k=EL[c];sc+=k===C.yong?.8:k===C.hee?.4:k===C.gi?-.8:k===C.gu?-.4:0;if(C.cnt[k]===0)sc+=.2});
 const r=relB(C.P[1].gz[1],gz[1]);if(r.some(x=>x.n==='충'))sc-=.75;else if(r.some(x=>x.g))sc+=.4;
 return {a,b,raw:sc,r}}
const norm=rows=>{const lo=Math.min(...rows.map(r=>r.raw)),hi=Math.max(...rows.map(r=>r.raw));rows.forEach(r=>r.sc=hi===lo?3:Math.round(2+3*(r.raw-lo)/(hi-lo)))};

const STAGE=['말년 (60세~)','중년 (40~59세)','청년 (20~39세)','초년 (~19세)'];
const TGS={비견:'자기 힘으로 서려는',겁재:'경쟁 속에서 사람을 얻는',식신:'재능을 즐겁게 펼치는',상관:'틀을 깨고 개성을 드러내는',편재:'큰 기회와 돈의 흐름을 타는',정재:'성실하게 쌓아 결실을 거두는',편관:'압박을 이겨내며 단단해지는',정관:'인정받고 자리를 잡는',편인:'독특한 공부와 직관이 깊어지는',정인:'배움과 보살핌 속에 안정되는'};
const ENG={장생:'상승',관대:'상승',건록:'왕성',제왕:'왕성',목욕:'보통',양:'보통',태:'보통',쇠:'완만',병:'완만',사:'잠잠',묘:'잠잠',절:'잠잠'};
const ENT={상승:'기운이 오르는 때라 새 출발이 잘 맞고',왕성:'에너지가 가장 강한 때라 주도적으로 이끌기 좋고',보통:'기운이 무르익는 중이라 준비하고 다지기 좋고',완만:'기운이 차분해지는 때라 경험과 관록으로 움직이기 좋고',잠잠:'기운을 안으로 모으는 때라 내실과 휴식이 중요하고'};
const ORG={wood:'간·담, 근육·눈',fire:'심장·소장, 혈액순환',earth:'위장·비장, 소화기',metal:'폐·대장, 호흡기·피부',water:'신장·방광, 생식기·뼈'};
function lifetime(C){
 const {P,e,sex,dg,gc,cnt,st,good}=C;
 $('life').innerHTML=P.map((p,i)=>{
  if(p.off)return `<div class="rc"><div class="age">${STAGE[i]}</div><div class="gz">?</div><p>태어난 시각을 넣으면 말년운이 나옵니다.</p></div>`;
  const zg=tenGod(dg,ZM[p.gz[1]]),gg=p.me?null:tenGod(dg,p.gz[0]),en=ENG[DS[p.ds]||p.ds]||'보통';
  return `<div class="rc"><div class="age">${STAGE[i]}</div><div class="gz">${p.gz}<span class="en">${en}</span></div>
   <p>${gg?`겉으로는 ${TGS[gg]} 모습, 속으로는 ${TGS[zg]} 시기입니다.`:`${TGS[zg]} 시기입니다.`} ${ENT[en]}, ${p.me?'배우자·가정과의 관계가 삶의 중심이 됩니다':i===3?'부모·집안의 영향을 받습니다':i===2?'사회 진출과 커리어의 기반을 쌓습니다':'자녀와 그동안의 결실을 거둡니다'}.</p>
   <p class="age">${gg?'천간 '+gg+' · ':''}지지 ${zg}</p></div>`}).reverse().join('');
 const now=new Date().getFullYear();
 const rows=e.getYun(sex).getDaYun(10).slice(1).map(d=>{const g=d.getGanZhi();return {d,g,...luckRaw(C,g),cur:now>=d.getStartYear()&&now<=d.getEndYear()}});
 norm(rows);
 $('tl').innerHTML=rows.map((r,i)=>`<div class="${r.cur?'now':''}" role="button" tabindex="0" data-dy="${i}"><span>${r.d.getStartAge()}~${r.d.getStartAge()+9}세</span><span class="g">${r.g}</span>${stars(r.sc).replace('stars','st')}<span>${r.a}·${r.b} — ${UN[r.a].split('.')[0]}</span></div>`).join('');
 const best=rows.filter(r=>r.d.getStartAge()<80).sort((x,y)=>y.raw-x.raw||x.d.getStartAge()-y.d.getStartAge()).slice(0,2).sort((x,y)=>x.d.getStartAge()-y.d.getStartAge()).map(r=>`${r.d.getStartAge()}~${r.d.getStartAge()+9}세 ${r.g}`);
 const ages=f=>rows.filter(r=>r.d.getStartAge()<80&&(f(GRP[r.a])||f(GRP[r.b]))).map(r=>r.d.getStartAge()+'세').slice(0,4).join(', ')||'해당 없음';
 const sp=sex?'재성':'관성',dz=tenGod(dg,ZM[P[1].gz[1]]);
 const PT={비겁:'친구처럼 동등하게 지내는',식상:'다정하고 표현이 풍부한',재성:'현실적이고 살림과 경제를 잘 챙기는',관성:'책임감 있고 반듯한',인성:'나를 보살펴 주는 따뜻한'};
 const money=gc.재성===0?'원국에 재성이 없어 한 번에 큰 돈보다 전문성과 직업으로 꾸준히 버는 구조입니다.':gc.식상&&gc.재성?'식상이 재성을 낳는 구조(식상생재)라 재능과 아이디어가 돈으로 이어지기 쉽습니다.':gc.재성>=3&&st==='신약'?'돈은 잘 보이지만 감당하기 버거울 수 있는 구조라 분산과 관리가 핵심입니다.':'재물을 알아보는 눈이 있어 꾸준히 모으면 안정적으로 불어나는 구조입니다.';
 const job=gc.관성&&gc.인성?'관성과 인성이 함께 있어(관인상생) 조직, 공직, 자격증 분야에서 인정받기 좋습니다.':gc.관성===0?'관성이 없어 조직에 매이기보다 프리랜서·자영업처럼 자유로운 방식이 잘 맞습니다.':gc.식상>=3?'식상이 강해 창의·기술·표현 분야에서 이름을 내기 좋습니다.':'꾸준히 실력을 쌓아 자리를 넓혀 가는 구조입니다.';
 const love=(gc[sp]===0?`배우자를 뜻하는 ${sp}이 원국에 없어 인연이 늦게 오거나 스스로 찾아 나서야 하는 구조로 봅니다.`:gc[sp]>=3?`배우자를 뜻하는 ${sp}이 많아 인연이 많은 만큼 선택이 중요합니다.`:`배우자를 뜻하는 ${sp}이 적당히 있어 인연이 자연스럽게 이어지는 편입니다.`)+` 배우자 자리(일지)는 ${dz}${ira(dz)} <b>${PT[GRP[dz]]} 배우자</b>와 인연이 깊다고 봅니다.`;
 const many=ORD.filter(k=>cnt[k]>=3),none=ORD.filter(k=>!cnt[k]);
 $('fld').innerHTML=[
  `<div class="rc"><h3>재물운</h3><p>${money}</p><p>재물 기회가 커지는 대운: ${ages(g=>g==='재성')}</p></div>`,
  `<div class="rc"><h3>직업·명예운</h3><p>${job}</p><p>승진·인정이 따르는 대운: ${ages(g=>g==='관성')}</p></div>`,
  `<div class="rc"><h3>애정·결혼운</h3><p>${love}</p><p>인연이 들어오는 대운: ${ages(g=>g===sp)}</p></div>`,
  `<div class="rc"><h3>건강 (전통 해석)</h3><p>${[...many,...none].length?[...many,...none].map(k=>`${tagc(k)}${ORG[k]}`).join('<br>')+'<br>쪽을 평소에 신경 쓰면 좋다고 봅니다.':'오행이 고르게 분포해 크게 치우친 곳이 없습니다.'}</p><p class="age">명리 전통의 오행·장기 대응이며, 실제 건강은 검진으로 확인하세요.</p></div>`,
  `<div class="rc"><h3>인생 최고의 시기</h3><p>별점이 가장 높은 대운은 <b>${best.join(', ')}</b> 대운입니다. ${st} 사주에 필요한 기운과 부족한 오행이 채워지는 때입니다.</p><p class="age">별점: ${st}에 맞는 십신, 부족한 오행이 들어오면 +, 넘치는 오행이나 일지와 충돌하면 −로 계산해, 이 사주의 대운끼리 비교한 상대 점수입니다.</p></div>`].join('');
}

/* ============ 7. 오늘의 운세 · 월별 운세 ============ */
function todayLuck(C){
 const now=new Date(),gz=Solar.fromDate(now).getLunar().getDayInGanZhi();
 const L=luckRaw(C,gz),sc=Math.max(1,Math.min(5,Math.round(L.raw)));
 const need=ORD.filter(k=>!C.cnt[k]);const lk=need.length?need[0]:ORD.reduce((a,b)=>C.cnt[a]<=C.cnt[b]?a:b);
 const rel=L.r.length?`오늘의 지지 ${gz[1]}이(가) 내 일지 ${C.P[1].gz[1]}와 <b>${L.r.map(x=>x.n).join('·')}</b> 관계라 ${L.r.some(x=>!x.g)?'감정 충돌이나 일정 변동을 조심하세요.':'사람과 일이 부드럽게 맞물립니다.'}`:'';
 $('today').innerHTML=`<div class="rc today"><div><div class="age">${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} 일진</div><div class="big">${gz}</div><div>${KO[gz[0]]}${KO[gz[1]]}일 ${stars(sc)}</div></div>
  <div><p><b>${L.a}의 날:</b> ${UN[L.a]}</p>${rel?`<p>${rel}</p>`:''}<p>행운의 색 <b>${LK[lk][1]}</b> · 숫자 <b>${LK[lk][2]}</b> · 방향 <b>${LK[lk][3]}</b></p></div></div>`;
 const yr=now.getFullYear(),rows=[];
 for(let m=1;m<=12;m++){const g=Solar.fromYmd(yr,m,15).getLunar().getMonthInGanZhiExact();rows.push({m,g,...luckRaw(C,g)})}
 norm(rows);
 $('moh').textContent=`${yr}년 월별 운세`;
 $('mo').innerHTML=rows.map(r=>`<div class="${r.m===now.getMonth()+1?'now':''}"><div class="h"><b>${r.m}월</b><span class="g">${r.g}</span></div>${stars(r.sc)}<p>${r.a} · ${UN[r.a].split('.')[0].replace('의 흐름','')}${r.r.some(x=>x.n==='충')?' · 일지 충, 변동 주의':''}</p></div>`).join('')
  +`<p class="note" style="grid-column:1/-1;margin:4px 0 0">월은 절기 기준이라 양력 각 달 초(4~8일경)에 바뀝니다. 별점은 올해 열두 달끼리 비교한 상대 점수입니다.</p>`;
}

