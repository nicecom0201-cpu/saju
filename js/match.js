/* match.js — 궁합 계산 · 상세 풀이 · 관계별 모드 */
/* ============ 10. 궁합 ============ */
function whoForm(id,title,def){
 $(id).innerHTML=`<h3>${title}</h3>
  <label>불러오기<select data-f="pick"><option value="">직접 입력</option></select></label>
  <label>이름<input data-f="nm" maxlength="20"></label>
  <label>달력<select data-f="cal"><option value="s">양력</option><option value="l">음력</option><option value="ll">음력(윤달)</option></select></label>
  <label>생년월일<input data-f="date" type="date"></label>
  <label>태어난 시각<input data-f="time" type="time"></label>
  <label>성별<select data-f="sex"><option value="1">남</option><option value="0">여</option></select></label>
  <label class="chk"><input data-f="notime" type="checkbox">시각 모름</label>`;
 setWho(id,def);
 $(id).querySelector('[data-f=pick]').addEventListener('change',ev=>{const val=ev.target.value;if(val==='')return;
  const src=val==='cur'?readForm():ADMIN?people()[+val]:null;if(src)setWho(id,src);gRun()});
}
const fld=(id,f)=>$(id).querySelector(`[data-f=${f}]`);
function setWho(id,v){['nm','cal','date','time','sex'].forEach(f=>{if(v[f]!=null)fld(id,f).value=v[f]});fld(id,'notime').checked=!!v.notime}
function getWho(id){const v={loc:'127.0',sect:'2'};['nm','cal','date','time','sex'].forEach(f=>v[f]=fld(id,f).value);v.notime=fld(id,'notime').checked;return v}
function drawWho(){for(const id of ['ga','gb']){const s=fld(id,'pick');if(!s)continue;
 s.innerHTML='<option value="">직접 입력</option><option value="cur">사주 탭의 현재 입력</option>'+(ADMIN?people():[]).map((p,i)=>`<option value="${i}">${esc(p.nm)} (${esc(p.date)})</option>`).join('')}}
const mini=(C,name)=>`<div class="rc"><h3>${esc(name||'이름 없음')} · ${KO[C.dg]}${ELN[EL[C.dg]].slice(0,1)} 일간</h3><div class="mini">${C.P.map(p=>`<div><div class="t">${p.t}</div>${p.off?'<div class="c" style="background:var(--line)">?</div><div class="c" style="background:var(--line)">?</div>':`<div class="c ${EL[p.gz[0]]}">${p.gz[0]}</div><div class="c ${EL[p.gz[1]]}" style="margin-top:4px">${p.gz[1]}</div>`}</div>`).join('')}</div></div>`;
function gunghap(A,Bx){
 const items=[];
 // 1) 오행 보완 (25)
 const la=ORD.filter(k=>!A.cnt[k]),lb=ORD.filter(k=>!Bx.cnt[k]);
 const cov=la.filter(k=>Bx.cnt[k]).length+lb.filter(k=>A.cnt[k]).length,tl=la.length+lb.length;
 const s1=tl?Math.round(10+15*cov/tl):20;
 items.push({n:'오행 보완',m:25,s:s1,t:tl?`${la.length?`첫째 사람에게 없는 ${la.map(k=>ELN[k]).join('·')}`:''}${la.length&&lb.length?', ':''}${lb.length?`둘째 사람에게 없는 ${lb.map(k=>ELN[k]).join('·')}`:''}${cov?` 중 ${cov}개를 상대가 채워 줍니다.`:'을 상대도 갖고 있지 않아 서로 채워 주지는 못합니다. 함께 그 기운(색·활동)을 보완하면 좋습니다.'}`:'두 사람 모두 오행을 고루 갖춰 서로 기대지 않고도 균형이 맞습니다.'});
 // 2) 일간 관계 (20)
 const a=A.dg,b=Bx.dg,ia=ORD.indexOf(EL[a]),ib=ORD.indexOf(EL[b]);
 const hap=S_HAP[a+b]||S_HAP[b+a];let s2,t2;
 if(hap){s2=20;t2=`${a}·${b}는 천간합이라 처음부터 끌리고 서로를 자연스럽게 받아들이는 사이입니다.`}
 else if((ia+1)%5===ib||(ib+1)%5===ia){s2=16;t2=`두 일간이 ${ELN[EL[a]]}·${ELN[EL[b]]}로 서로 살려주는 상생 관계라 한쪽이 다른 쪽을 키워 주는 사이입니다.`}
 else if(ia===ib){s2=12;t2='같은 오행의 일간이라 친구처럼 잘 통하지만 고집이 부딪힐 때가 있습니다.'}
 else {s2=7;t2=`두 일간이 ${ELN[EL[a]]}·${ELN[EL[b]]}로 서로 누르는 상극 관계라 긴장감이 있지만, 서로를 다듬어 주는 자극이 되기도 합니다.`}
 items.push({n:'일간(성향) 궁합',m:20,s:s2,t:t2});
 // 3) 일지 배우자 자리 (25)
 const za=A.P[1].gz[1],zb=Bx.P[1].gz[1],r3=relB(za,zb);
 const badMap={충:4,원진:6,형:6,해:9,파:9},goodMap={육합:25,반합:22};
 let s3=15,t3=`배우자 자리 ${za}·${zb} 사이에 특별한 합·충이 없어 무난한 생활 궁합입니다.`;
 const bads=r3.filter(x=>!x.g),goods=r3.filter(x=>x.g);
 if(bads.length){s3=Math.min(...bads.map(x=>badMap[x.n]));t3=`배우자 자리 ${za}·${zb}가 <b>${bads.map(x=>x.n).join('·')}</b> 관계라 생활 습관이나 감정 표현에서 부딪힐 수 있어 대화와 배려가 중요합니다.`}
 else if(goods.length){s3=Math.max(...goods.map(x=>goodMap[x.n.slice(0,2)]||22));t3=`배우자 자리 ${za}·${zb}가 <b>${goods.map(x=>x.n).join('·')}</b> 관계라 함께 살수록 손발이 잘 맞는 생활 궁합입니다.`}
 items.push({n:'배우자 자리(일지)',m:25,s:s3,t:t3});
 // 4) 띠 (10)
 const ya=A.P[3].gz[1],yb=Bx.P[3].gz[1],r4=relB(ya,yb);
 let s4=7,t4=`${KO[ya]}띠와 ${KO[yb]}띠는 무난한 관계입니다.`;
 if(r4.some(x=>!x.g)){s4=3;t4=`${KO[ya]}띠와 ${KO[yb]}띠는 ${r4.filter(x=>!x.g).map(x=>x.n).join('·')} 관계라 집안·가치관 차이를 맞춰 가야 합니다.`}
 else if(r4.some(x=>x.g)){s4=10;t4=`${KO[ya]}띠와 ${KO[yb]}띠는 ${r4.map(x=>x.n).join('·')} 관계라 띠궁합이 좋습니다.`}
 items.push({n:'띠 궁합',m:10,s:s4,t:t4});
 // 5) 배우자 별 (20)
 const spEl=C=>C.sex?ORD[(ORD.indexOf(EL[C.dg])+2)%5]:ORD[(ORD.indexOf(EL[C.dg])+3)%5];
 const ea=spEl(A),eb=spEl(Bx);let s5=0;const t5=[];
 if(EL[Bx.dg]===ea){s5+=10;t5.push('상대의 일간이 첫째 사람의 배우자 별과 같은 오행입니다')}else if(Bx.cnt[ea]>=2){s5+=6;t5.push('상대 사주에 첫째 사람의 배우자 별 기운이 넉넉합니다')}else s5+=3;
 if(EL[A.dg]===eb){s5+=10;t5.push('첫째 사람의 일간이 상대의 배우자 별과 같은 오행입니다')}else if(A.cnt[eb]>=2){s5+=6;t5.push('첫째 사람 사주에 상대의 배우자 별 기운이 넉넉합니다')}else s5+=3;
 items.push({n:'배우자 별',m:20,s:s5,t:(t5.length?t5.join('. ')+'. 서로를 “내 사람”으로 느끼기 쉬운 구조입니다.':'서로의 배우자 별 기운이 강하지는 않아, 끌림보다 함께 쌓는 신뢰가 중요한 관계입니다.')+` (남성은 재성, 여성은 관성을 배우자 별로 봅니다.)`});
 const total=items.reduce((x,y)=>x+y.s,0);
 const grade=total>=90?'천생연분':total>=80?'아주 좋은 궁합':total>=70?'좋은 궁합':total>=60?'무난한 궁합':'노력이 필요한 궁합';
 const gdesc=total>=80?'서로의 부족함을 채우고 자연스럽게 끌리는 인연입니다.':total>=70?'큰 충돌 없이 서로에게 도움이 되는 인연입니다.':total>=60?'장단점이 섞여 있어 서로를 이해하려는 노력에 따라 크게 달라집니다.':'다른 점이 많은 만큼 대화와 배려로 맞춰 가면 단단해지는 인연입니다.';
 return {items,total,grade,gdesc};
}

/* ---- 궁합 상세 풀이 ---- */
const LOVE={비겁:['친구 같은 연애','대등한 관계를 원하고 함께 운동·여행하며 가까워집니다. 자존심 싸움만 조심하면 오래가는 동반자형입니다.'],
 식상:['표현형 연애','말과 이벤트로 마음을 드러내고 재미있는 데이트를 좋아합니다. 감정 기복이 보일 때는 한 박자 쉬어 가는 게 좋습니다.'],
 재성:['현실형 연애','챙겨 주고 실질적으로 도와주는 것으로 사랑을 표현합니다. 마음을 말로도 전해 주면 훨씬 따뜻하게 느껴집니다.'],
 관성:['책임형 연애','신중하게 시작하지만 한 번 마음을 주면 오래 갑니다. 걱정이 잔소리로 들리지 않게 표현 방식을 다듬으면 좋습니다.'],
 인성:['보살핌형 연애','이해심이 깊고 기다려 주는 사랑입니다. 받는 사랑에 익숙해지지 않도록 먼저 표현하는 연습이 도움이 됩니다.']};
const DATE={wood:'숲길 산책, 등산, 식물 키우기',fire:'공연·축제, 햇살 좋은 야외, 맛집 탐방',earth:'캠핑, 요리·공방 클래스, 시골 여행',metal:'전시회, 드라이브, 쇼핑',water:'바다·호수, 온천, 카페에서 긴 대화'};
const topG=C=>Object.keys(C.gc).sort((a,b)=>C.gc[b]-C.gc[a])[0];
const hasSal=(C,n)=>sinsal(C).some(x=>x.n===n);
function temp(C){let t=C.cnt.fire*1+C.cnt.water*.5+C.gc.식상*.5;if(hasSal(C,'도화살'))t+=1.5;if(hasSal(C,'홍염살'))t+=1.5;
 return {t,lv:t>=4?'뜨거운':t>=2.5?'따뜻한':'은은한'}}
const j=(w,a,b)=>{const c=String(w).replace(/<[^>]*>|&[a-z#0-9]+;/g,'').trim().slice(-1).charCodeAt(0)-0xAC00;return w+(c>=0&&c<11172?(c%28?a:b):a+'('+b+')')};
function gDetail(A,Bx,na,nb){
 const out=[];
 // 성격 궁합
 out.push(`<div class="rc"><h3>성격 궁합</h3><p><b>${na}</b>${j(na,'은','는').slice(na.length)} ${DM[A.dg][0]}(${A.dg}) 같은 사람으로 ${j(DM[A.dg][2].join('·'),'이','가')} 특징입니다.</p><p><b>${nb}</b>${j(nb,'은','는').slice(nb.length)} ${DM[Bx.dg][0]}(${Bx.dg}) 같은 사람으로 ${j(DM[Bx.dg][2].join('·'),'이','가')} 특징입니다.</p><p>${(()=>{const ia=ORD.indexOf(EL[A.dg]),ib=ORD.indexOf(EL[Bx.dg]);
  if(S_HAP[A.dg+Bx.dg]||S_HAP[Bx.dg+A.dg])return '서로 끌어당기는 천간합이라 말하지 않아도 통하는 부분이 많습니다.';
  if((ia+1)%5===ib)return `${j(na,'이','가')} ${j(nb,'을','를')} 키워 주는 관계입니다. ${j(na,'은','는')} 베풀 때 보람을 느끼고, ${j(nb,'은','는')} 그 덕에 자신감을 얻습니다.`;
  if((ib+1)%5===ia)return `${j(nb,'이','가')} ${j(na,'을','를')} 키워 주는 관계입니다. ${j(nb,'은','는')} 든든한 지원군이 되어 주고, ${j(na,'은','는')} 그 덕에 힘을 냅니다.`;
  if(ia===ib)return '같은 기운이라 취향과 생각이 비슷해 편하지만, 둘 다 양보하지 않으면 고집이 부딪힙니다.';
  if((ia+2)%5===ib)return `${j(na,'이','가')} ${j(nb,'을','를')} 이끌고 다듬는 관계입니다. ${j(na,'은','는')} 말투를 부드럽게, ${j(nb,'은','는')} 조언을 간섭으로만 받아들이지 않는 게 핵심입니다.`;
  return `${j(nb,'이','가')} ${j(na,'을','를')} 이끌고 다듬는 관계입니다. ${j(nb,'은','는')} 말투를 부드럽게, ${j(na,'은','는')} 조언을 간섭으로만 받아들이지 않는 게 핵심입니다.`})()}</p></div>`);
 // 연애 스타일
 const la=LOVE[topG(A)],lb=LOVE[topG(Bx)];
 out.push(`<div class="rc"><h3>연애 스타일</h3><p><b>${na} · ${la[0]}:</b> ${la[1]}</p><p><b>${nb} · ${lb[0]}:</b> ${lb[1]}</p></div>`);
 // 속궁합
 const ta=temp(A),tb=temp(Bx),diff=Math.abs(ta.t-tb.t),zr=relB(A.P[1].gz[1],Bx.P[1].gz[1]);
 let sk=80-Math.round(diff*8);if(zr.some(x=>x.g))sk+=12;if(zr.some(x=>x.n==='충'))sk-=8;if(zr.some(x=>x.n==='원진'))sk-=6;
 const fw=(A.cnt.fire>=2&&Bx.cnt.water>=2)||(Bx.cnt.fire>=2&&A.cnt.water>=2);if(fw)sk+=5;
 sk=Math.max(35,Math.min(98,sk));
 const skT=diff<1?'두 사람의 애정 온도가 비슷해 스킨십의 속도와 분위기를 맞추기 쉽습니다.':diff<2.5?'애정 온도에 약간 차이가 있어, 한 사람이 조금 더 적극적이고 다른 사람이 분위기를 따라가는 편입니다. 원하는 걸 솔직하게 말할수록 좋아집니다.':'애정 온도 차이가 커서 한쪽은 더 원하고 한쪽은 부담을 느낄 수 있습니다. 속도를 맞추고 서로의 신호를 존중하는 게 가장 중요합니다.';
 out.push(`<div class="rc"><h3>속궁합 <span class="en">${sk}점</span></h3><p><b>${na}</b>: ${ta.lv} 애정 온도 · <b>${nb}</b>: ${tb.lv} 애정 온도</p><p>${skT}</p>${zr.some(x=>x.g)?'<p>배우자 자리가 합을 이뤄 몸과 마음이 자연스럽게 가까워지는 조합입니다.</p>':''}${zr.some(x=>!x.g)?'<p>배우자 자리에 부딪힘이 있어 피곤하거나 다툰 날엔 감정을 먼저 풀고 다가가는 게 좋습니다.</p>':''}${fw?'<p>불(火)과 물(水)이 만나 서로에게 강하게 끌리는 조합입니다. 뜨겁게 붙고 차갑게 식는 기복만 조절하면 됩니다.</p>':''}<p class="age">화(火)·수(水) 기운, 표현력(식상), 도화·홍염살, 배우자 자리 관계로 본 전통적인 애정 궁합입니다.</p></div>`);
 // 대화
 const ea=A.gc.식상,eb=Bx.gc.식상,ha=A.gc.인성,hb=Bx.gc.인성;
 const talk=ea>=2&&eb>=2?'둘 다 말로 풀어내는 타입이라 대화가 끊이지 않지만, 동시에 말하려다 부딪히기 쉽습니다. 상대 말이 끝날 때까지 들어 주는 규칙을 정해 보세요.':
  (ea>=2&&hb>=2)?`${j(na,'이','가')} 말하고 ${j(nb,'이','가')} 들어 주는 이상적인 조합입니다.`:(eb>=2&&ha>=2)?`${j(nb,'이','가')} 말하고 ${j(na,'이','가')} 들어 주는 이상적인 조합입니다.`:
  ea+eb<=1?'둘 다 속마음을 잘 꺼내지 않는 편이라 오해가 쌓이기 쉽습니다. 일주일에 한 번 “요즘 어때?” 대화 시간을 만들어 보세요.':'말하는 쪽과 듣는 쪽이 상황에 따라 바뀌는 무난한 소통 궁합입니다.';
 out.push(`<div class="rc"><h3>대화·소통 궁합</h3><p>${talk}</p><p class="age">표현력(식상) ${na} ${ea} · ${nb} ${eb} / 수용력(인성) ${na} ${ha} · ${nb} ${hb}</p></div>`);
 // 돈
 const ma=A.gc.재성,mb=Bx.gc.재성;
 const money=ma>=2&&mb>=2?'둘 다 돈 감각이 좋아 공동 목표(내 집 마련, 투자)를 세우면 빠르게 이룹니다. 다만 주도권 다툼이 생기지 않게 역할을 나누세요.':
  ma>=2||mb>=2?`${ma>=mb?na:nb}이(가) 돈 관리에 더 밝으니 가계 관리를 맡기면 안정적입니다.`:'두 사람 모두 돈보다 사람·일을 중시하는 편이라, 자동이체 저축 같은 시스템을 만들어 두면 좋습니다.';
 const risk=(A.gc.비겁>=3||Bx.gc.비겁>=3)?' 비겁(경쟁·지출) 기운이 강한 사람이 있어 보증·동업·충동 지출은 함께 상의하세요.':'';
 out.push(`<div class="rc"><h3>돈·경제 궁합</h3><p>${money}${risk}</p></div>`);
 // 결혼 생활
 const home=zr.some(x=>x.g)?'함께 살수록 생활 리듬이 맞아 가는 편안한 가정형 궁합입니다.':zr.some(x=>x.n==='충')?'생활 습관(수면·청소·식사 시간)이 달라 처음엔 부딪히지만, 각자의 공간과 규칙을 정하면 오히려 서로 자극이 되는 관계입니다.':zr.some(x=>!x.g)?'사소한 생활 습관에서 서운함이 쌓이기 쉬워, 작은 불만을 미루지 않고 바로 이야기하는 게 좋습니다.':'큰 충돌 없이 무난하게 맞춰 가는 생활 궁합입니다.';
 const resp=(A.gc.관성+Bx.gc.관성>=3)?' 두 사람 모두 책임감이 강해 가정을 단단하게 지킵니다.':'';
 out.push(`<div class="rc"><h3>결혼 생활 궁합</h3><p>${home}${resp}</p></div>`);
 // 갈등과 해결
 const cf=[];
 const ia=ORD.indexOf(EL[A.dg]),ib=ORD.indexOf(EL[Bx.dg]);
 if((ia+2)%5===ib||(ib+2)%5===ia)cf.push('일간이 상극이라 한 사람의 조언이 다른 사람에게 지적으로 들릴 수 있습니다. → 의견을 말하기 전에 먼저 공감 한마디를 붙이세요.');
 zr.filter(x=>!x.g).forEach(x=>cf.push({충:'배우자 자리가 충돌(충)해 생활 방식 차이로 다툽니다. → 각자의 시간과 공간을 인정해 주세요.',원진:'배우자 자리가 원진이라 이유 없이 서운함이 쌓일 때가 있습니다. → 서운한 건 그날 바로 말로 푸세요.',형:'배우자 자리가 형이라 말이 날카로워질 수 있습니다. → 화가 날 땐 30분 쉬고 대화하세요.',해:'배우자 자리가 해라 작은 오해가 커지기 쉽습니다. → 추측 대신 직접 물어보세요.',파:'배우자 자리가 파라 약속이 틀어질 때 실망이 큽니다. → 계획을 함께 적어 두세요.'}[x.n]));
 const both=ORD.filter(k=>A.cnt[k]>=3&&Bx.cnt[k]>=3);
 both.forEach(k=>cf.push(`둘 다 ${ELN[k]} 기운이 많아 ${XS[k]}. 같은 약점이 겹치니 서로 브레이크가 되어 주세요.`));
 out.push(`<div class="rc"><h3>갈등 포인트와 해결법</h3>${cf.length?cf.map(x=>`<p>${x}</p>`).join(''):'<p>두 사람 사이에 뚜렷한 충돌 요소가 없습니다. 오히려 너무 편해서 소홀해지지 않도록 기념일과 작은 이벤트를 챙기세요.</p>'}</div>`);
 // 결혼 시기
 const spEl=C=>C.sex?ORD[(ORD.indexOf(EL[C.dg])+2)%5]:ORD[(ORD.indexOf(EL[C.dg])+3)%5];
 const y0=new Date().getFullYear(),yrs=[];
 for(let y=y0;y<y0+10;y++){const g=Solar.fromYmd(y,7,1).getLunar().getYearInGanZhi();let sc=0;
  for(const C of [A,Bx]){const r=relB(C.P[1].gz[1],g[1]);if(r.some(x=>x.g))sc+=1;if(r.some(x=>x.n==='충'))sc-=1;if(EL[g[0]]===spEl(C)||EL[g[1]]===spEl(C))sc+=1}
  yrs.push({y,g,sc})}
 const good=yrs.filter(x=>x.sc>=2).sort((a,b)=>b.sc-a.sc||a.y-b.y).slice(0,3).sort((a,b)=>a.y-b.y);
 const bad=yrs.filter(x=>x.sc<=-1).map(x=>x.y);
 out.push(`<div class="rc"><h3>함께하기 좋은 해 (결혼·동거·큰 결정)</h3><p>${good.length?good.map(x=>`<b>${x.y}년 ${x.g}</b>`).join(', ')+' — 두 사람의 배우자 자리와 배우자 별이 함께 움직이는 해입니다.':'앞으로 10년 안에 두드러진 해는 없어, 두 사람이 준비된 때가 가장 좋은 때입니다.'}</p>${bad.length?`<p>${bad.join(', ')}년은 배우자 자리가 흔들리는 해라 큰 결정은 신중하게 하세요.</p>`:''}</div>`);
 // 데이트
 const sum=ORD.map(k=>[k,A.cnt[k]+Bx.cnt[k]]).sort((a,b)=>a[1]-b[1]),need=sum.filter(x=>x[1]===sum[0][1]).map(x=>x[0]);
 out.push(`<div class="rc"><h3>둘에게 맞는 데이트</h3><p>두 사람에게 함께 부족한 기운은 ${need.map(tagc).join('')}입니다. 이 기운을 채우는 <b>${need.map(k=>DATE[k]).join(', ')}</b> 같은 데이트가 관계에 활력을 줍니다.</p><p>커플 행운의 색: ${need.map(k=>LK[k][1]).join(', ')} · 행운의 방향: ${need.map(k=>LK[k][3]).join(', ')}</p></div>`);
 return out.join('');
}
/* ---- 관계별 궁합 모드 ---- */
const MODE_GRADE={love:['천생연분','아주 좋은 궁합','좋은 궁합','무난한 궁합','노력이 필요한 궁합'],friend:['평생 친구','찰떡 친구','좋은 친구','무난한 사이','서로 다른 매력의 사이'],biz:['최고의 파트너','든든한 파트너','좋은 파트너','무난한 협업','역할 조율이 필요한 관계'],family:['서로를 키우는 가족','따뜻한 가족','좋은 관계','무난한 관계','이해가 필요한 관계']};
const MODE_DESC={friend:['서로를 채워 주고 오래 함께할 사이입니다.','함께 있으면 편하고 도움이 되는 사이입니다.','장단점이 섞인 사이라 서로에 대한 관심이 관계를 키웁니다.','다른 점이 많아 배울 것도 많은 사이입니다.'],biz:['역할이 잘 나뉘고 서로의 빈 곳을 채우는 파트너입니다.','함께 일하면 성과가 나는 조합입니다.','강점이 겹치거나 비는 부분이 있어 역할 분담이 성패를 가릅니다.','스타일 차이가 커서 규칙과 계약을 먼저 분명히 해야 합니다.'],family:['부모와 자녀가 서로를 자연스럽게 키워 주는 관계입니다.','따뜻하게 이어지는 관계입니다.','성향 차이를 이해하면 더 가까워지는 관계입니다.','기질이 많이 달라 대화와 인정이 특히 중요한 관계입니다.']};
const ROLE={비겁:'현장 실행·영업 (추진력)',식상:'기획·마케팅·제품 개발 (아이디어)',재성:'재무·영업 관리 (숫자 감각)',관성:'조직 관리·운영·대관 (책임감)',인성:'연구·전략·교육 (분석력)'};
const FRS={비겁:'운동·여행을 함께하는 활동형 우정',식상:'수다와 재미가 끊이지 않는 유쾌한 우정',재성:'서로 실속 있게 챙겨 주는 현실형 우정',관성:'약속을 잘 지키는 믿음직한 우정',인성:'고민을 들어 주는 깊은 우정'};
const PAR={비겁:'자녀를 친구처럼 대하는 수평형 부모',식상:'자녀의 재능과 표현을 북돋는 응원형 부모',재성:'생활과 경제 감각을 길러 주는 현실형 부모',관성:'규칙과 책임을 가르치는 원칙형 부모',인성:'품어 주고 기다려 주는 보살핌형 부모'};
const KID={비겁:'자기 주장과 독립심이 강한 아이',식상:'표현력과 호기심이 많은 아이',재성:'현실 감각이 빠르고 실속을 챙기는 아이',관성:'규칙을 잘 지키고 책임감 있는 아이',인성:'생각이 깊고 배우기를 좋아하는 아이'};
function applyMode(G,A,Bx,mode){
 if(mode==='love')return G;
 const f=n=>{const x=G.items.find(i=>i.n===n);return x?x.s/x.m:0},tx=n=>G.items.find(i=>i.n===n).t.replace(/배우자 자리/g,'일지(생활 자리)');
 const ta=topG(A),tb=topG(Bx),it=[];
 const ad=(n,m,fr,t)=>it.push({n,m,s:Math.round(m*Math.max(0,Math.min(1,fr))),t});
 if(mode==='friend'){
  ad('오행 보완',25,f('오행 보완'),tx('오행 보완'));ad('일간(성향) 궁합',25,f('일간(성향) 궁합'),tx('일간(성향) 궁합'));
  ad('생활 리듬(일지)',20,f('배우자 자리(일지)'),tx('배우자 자리(일지)'));ad('띠 궁합',15,f('띠 궁합'),tx('띠 궁합'));
  ad('취향·성향',15,ta===tb?1:(ta==='비겁'||tb==='비겁')?.7:.55,ta===tb?`둘 다 ${ta} 중심이라 취향과 노는 방식이 비슷합니다.`:`${ta} 중심과 ${tb} 중심으로 성향이 달라 서로 새로운 세계를 보여 줍니다.`);
 }else if(mode==='biz'){
  const cover=new Set([ta,tb]),roleF=ta!==tb?(cover.has('재성')&&(cover.has('식상')||cover.has('관성'))?1:.85):.5;
  const ma=A.gc.재성,mb=Bx.gc.재성,mon=ma&&mb?1:ma||mb?.65:.35;
  ad('오행 보완',20,f('오행 보완'),tx('오행 보완'));ad('일간(성향) 궁합',20,f('일간(성향) 궁합'),tx('일간(성향) 궁합'));
  ad('역할 보완',25,roleF,ta!==tb?`강점이 ${ta}·${tb}로 달라 역할을 나누기 좋습니다.`:`둘 다 ${ta}가 강해 같은 일을 하려다 부딪힐 수 있어 업무 영역을 먼저 나누세요.`);
  ad('재물 기운',15,mon,ma&&mb?'두 사람 모두 재물 감각(재성)이 있어 수익 구조를 잘 만듭니다.':ma||mb?'한 사람에게 재물 감각이 있어 그 사람이 돈 관리를 맡는 게 좋습니다.':'둘 다 돈보다 일 자체를 중시해 수익 관리 체계를 따로 갖춰야 합니다.');
  ad('일하는 리듬(일지)',10,f('배우자 자리(일지)'),tx('배우자 자리(일지)'));ad('띠 궁합',10,f('띠 궁합'),tx('띠 궁합'));
 }else{
  const ia=ORD.indexOf(EL[A.dg]),ib=ORD.indexOf(EL[Bx.dg]),hap=S_HAP[A.dg+Bx.dg]||S_HAP[Bx.dg+A.dg];
  const [fr,t]=hap?[.95,'부모와 자녀의 일간이 합이라 말하지 않아도 마음이 통합니다.']:(ia+1)%5===ib?[1,'부모가 자녀를 살려 주는 상생이라 부모의 헌신이 자녀의 성장으로 그대로 이어집니다.']:(ib+1)%5===ia?[.8,'자녀가 부모를 살려 주는 관계라 자녀가 부모에게 힘과 기쁨이 됩니다.']:ia===ib?[.75,'같은 기운이라 부모와 자녀가 서로를 닮아 잘 이해하지만 고집이 부딪힐 때가 있습니다.']:(ia+2)%5===ib?[.35,'부모가 자녀를 누르는 관계라 기대가 간섭으로 느껴질 수 있습니다. 칭찬과 선택권을 더 주세요.']:[.45,'자녀의 기운이 부모를 누르는 관계라 자녀의 고집이 셉니다. 대화로 규칙을 함께 정하세요.'];
  ad('오행 보완',25,f('오행 보완'),tx('오행 보완'));ad('부모·자녀 일간',30,fr,t);
  ad('생활 리듬(일지)',15,f('배우자 자리(일지)'),tx('배우자 자리(일지)'));ad('띠 궁합',15,f('띠 궁합'),tx('띠 궁합'));
  ad('양육 궁합',15,A.gc.인성||A.gc.식상?1:.6,A.gc.인성||A.gc.식상?'부모에게 보살핌(인성)이나 소통(식상) 기운이 있어 자녀를 잘 이해합니다.':'부모가 원칙과 결과를 중시하는 편이라 과정에 대한 칭찬을 의식적으로 늘리면 좋습니다.');
 }
 const total=it.reduce((x,y)=>x+y.s,0),gi=total>=90?0:total>=80?1:total>=70?2:total>=60?3:4;
 return {items:it,total,grade:MODE_GRADE[mode][gi],gdesc:MODE_DESC[mode][Math.max(0,gi-1)]};
}
function modeDetail(A,Bx,na,nb,mode,base){
 const cards=base.split('<div class="rc"><h3>').slice(1).map(x=>'<div class="rc"><h3>'+x);
 const pick=h=>(cards.find(c=>c.startsWith('<div class="rc"><h3>'+h))||'').replace(/배우자 자리/g,'일지(생활 자리)');
 const ta=topG(A),tb=topG(Bx),sum=ORD.map(k=>[k,A.cnt[k]+Bx.cnt[k]]).sort((a,b)=>a[1]-b[1]),need=sum.filter(x=>x[1]===sum[0][1]).map(x=>x[0]);
 const act=`<div class="rc"><h3>함께하면 좋은 활동</h3><p>두 사람에게 함께 부족한 ${need.map(tagc).join('')}기운을 채우는 <b>${need.map(k=>DATE[k]).join(', ')}</b> 같은 활동이 관계에 활력을 줍니다.</p></div>`;
 if(mode==='friend')return [pick('성격 궁합'),`<div class="rc"><h3>우정 스타일</h3><p><b>${na}</b>: ${FRS[ta]}</p><p><b>${nb}</b>: ${FRS[tb]}</p></div>`,pick('대화·소통 궁합'),pick('갈등 포인트'),act].join('');
 if(mode==='biz'){
  const y0=new Date().getFullYear(),yrs=[];for(let y=y0;y<y0+6;y++){const g=Solar.fromYmd(y,7,1).getLunar().getYearInGanZhi();let s=0;for(const C of [A,Bx]){const gr=GRP[tenGod(C.dg,g[0])];if(gr==='재성')s+=1;if(gr==='식상')s+=.6;if(relB(C.P[1].gz[1],g[1]).some(x=>x.n==='충'))s-=1}yrs.push({y,g,s})}
  const gy=yrs.filter(x=>x.s>=1).sort((a,b)=>b.s-a.s).slice(0,3).sort((a,b)=>a.y-b.y);
  const risk=(A.gc.비겁>=3||Bx.gc.비겁>=3)?'비겁(경쟁) 기운이 강한 사람이 있어 지분·수익 배분을 처음부터 문서로 정해 두세요.':'지분과 역할을 문서로 정해 두면 오래 갑니다.';
  return [pick('성격 궁합'),`<div class="rc"><h3>역할 분담 추천</h3><p><b>${na}</b>: ${ROLE[ta]}</p><p><b>${nb}</b>: ${ROLE[tb]}</p></div>`,pick('대화·소통 궁합'),`<div class="rc"><h3>돈과 의사결정</h3><p>${risk}</p><p>${A.gc.관성>=Bx.gc.관성?na:nb}이(가) 원칙과 일정 관리에 더 강해 최종 결정 절차를 맡기면 좋습니다.</p></div>`,
   `<div class="rc"><h3>함께 사업하기 좋은 해</h3><p>${gy.length?gy.map(x=>`<b>${x.y}년 ${x.g}</b>`).join(', ')+' — 두 사람 모두에게 재물·성과 기운이 들어오는 해입니다.':'앞으로 몇 년 안에 두드러진 해는 없어, 준비가 된 때가 가장 좋은 때입니다.'}</p></div>`,pick('갈등 포인트')].join('').replace(/(\S+)이\(가\)/g,(m,w)=>j(w,'이','가'));
 }
 const kidApt=GT[tb][1];
 return [`<div class="rc"><h3>부모의 양육 스타일</h3><p><b>${na}</b>: ${PAR[ta]}입니다.</p></div>`,`<div class="rc"><h3>자녀의 기질</h3><p><b>${nb}</b>: ${KID[tb]}입니다. ${DM[Bx.dg][0]}(${Bx.dg}) 일간으로 ${DM[Bx.dg][2].join('·')}이(가) 돋보입니다.</p></div>`,
  `<div class="rc"><h3>자녀의 적성과 공부</h3><p>${tb} 기운이 강해 <b>${kidApt}</b> 쪽에 흥미와 재능을 보이기 쉽습니다.</p><p>${Bx.gc.인성?'혼자 깊이 파고드는 공부가 잘 맞습니다.':Bx.gc.식상?'말하고 만들어 보는 체험형 공부가 잘 맞습니다.':'목표와 보상이 분명한 공부 방식이 잘 맞습니다.'}</p></div>`,
  pick('대화·소통 궁합'),pick('갈등 포인트'),act].join('').replace(/(\S+)이\(가\)/g,(m,w)=>j(w,'이','가'));
}

function gRun(){
 $('gerr').textContent='';
 const va=getWho('ga'),vb=getWho('gb'),A=compute(va),Bx=compute(vb);
 if(A.err||Bx.err){$('gerr').textContent=(A.err?'첫째 사람: '+A.err:'둘째 사람: '+Bx.err);return}
 GA=A;GB=Bx;GNAMES=[va.nm||'첫째',vb.nm||'둘째'];$('gcwrap').hidden=false;setTimeout(drawCoupleCal,0);
 const mode=$('gm').value,G=applyMode(gunghap(A,Bx),A,Bx,mode),R=2*Math.PI*52;
 $('gres').innerHTML=`<div class="gtop"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" stroke-width="12"/><circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${R*G.total/100} ${R}"/></svg><div><b>${G.total}</b><span>100점 만점</span></div></div>
  <div><h2 style="margin:0 0 8px">${esc(va.nm||'첫째 사람')} ${mode==='love'?'♥':'·'} ${esc(vb.nm||'둘째 사람')} · ${G.grade}</h2><p style="margin:0 0 14px">${G.gdesc}</p>
  <div class="bars">${G.items.map(x=>`<div class="bar" style="grid-template-columns:8em minmax(0,1fr) 3.5em"><span>${x.n}</span><div class="tr"><div class="f" style="width:${x.s/x.m*100}%;background:var(--accent)"></div></div><span class="n">${x.s}/${x.m}</span></div>`).join('')}</div></div></div>
  <div class="minis">${mini(A,va.nm||'첫째 사람')}${mini(Bx,vb.nm||'둘째 사람')}</div>
  <div class="rd" style="margin-top:16px">${G.items.map(x=>`<div class="rc"><h3>${x.n} <span class="en">${x.s}/${x.m}</span></h3><p>${x.t}</p></div>`).join('')}</div>
  <h2 style="margin-top:32px">궁합 상세 풀이</h2>
  <div class="rd">${(()=>{const na=esc(va.nm||'첫째 사람'),nb=esc(vb.nm||'둘째 사람'),base=gDetail(A,Bx,na,nb);return mode==='love'?base:modeDetail(A,Bx,na,nb,mode,base)})()}</div>
  <p class="note">점수 기준: ${G.items.map(x=>x.n+' '+x.m).join(' · ')}. 궁합은 관계의 성향을 보는 참고 자료입니다.</p>`;
}
$('gm').addEventListener('change',()=>{try{gRun()}catch(e){$('gerr').textContent='계산 중 오류: '+e.message}});
$('ago').addEventListener('click',()=>{try{nameAnalyze()}catch(e){$('ares').textContent='오류: '+e.message}});
$('ggo').addEventListener('click',()=>{try{gRun()}catch(e){$('gerr').textContent='계산 중 오류: '+e.message}});

