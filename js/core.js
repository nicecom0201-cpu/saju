/* core.js — 기본 데이터 · 시각 보정 · 사주 계산 · 합충 · 신살 (화면과 무관한 계산 엔진) */
/* ============ 1. 기본 데이터 ============ */
const KO={甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',己:'기',庚:'경',辛:'신',壬:'임',癸:'계',子:'자',丑:'축',寅:'인',卯:'묘',辰:'진',巳:'사',午:'오',未:'미',申:'신',酉:'유',戌:'술',亥:'해'};
const EL={甲:'wood',乙:'wood',丙:'fire',丁:'fire',戊:'earth',己:'earth',庚:'metal',辛:'metal',壬:'water',癸:'water',
 寅:'wood',卯:'wood',巳:'fire',午:'fire',辰:'earth',戌:'earth',丑:'earth',未:'earth',申:'metal',酉:'metal',亥:'water',子:'water'};
const ELN={wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};
const SS={'比肩':'비견','劫财':'겁재','食神':'식신','伤官':'상관','偏财':'편재','正财':'정재','七杀':'편관','正官':'정관','偏印':'편인','正印':'정인','日主':'일간(나)'};
const DS={'长生':'장생','沐浴':'목욕','冠带':'관대','临官':'건록','帝旺':'제왕','衰':'쇠','病':'병','死':'사','墓':'묘','绝':'절','胎':'태','养':'양'};
const DM={
 甲:['큰 나무','곧게 위로 자라는 큰 나무. 추진력과 책임감이 강하고 원칙을 중시하는 리더형으로 봅니다.',['곧음','리더십','성장']],
 乙:['풀과 덩굴','부드럽게 휘어 살아남는 풀과 꽃. 유연하고 적응력이 좋으며 사람 사이를 잘 엮습니다.',['유연함','친화력','끈기']],
 丙:['태양','모두를 비추는 태양. 밝고 솔직하며 표현력과 열정이 크다고 봅니다.',['열정','표현','공명정대']],
 丁:['촛불','어둠을 밝히는 촛불과 별빛. 섬세하고 따뜻하며 집중력과 통찰이 깊습니다.',['섬세함','배려','집중']],
 戊:['큰 산','묵직하게 버티는 산. 신뢰감과 포용력이 있고 쉽게 흔들리지 않습니다.',['듬직함','포용','안정']],
 己:['논밭의 흙','곡식을 길러내는 흙. 현실적이고 꼼꼼하며 사람과 일을 잘 키워냅니다.',['실속','세심함','양육']],
 庚:['바위와 쇠','단단한 원석과 쇠. 결단력과 의리가 강하고 맺고 끊음이 분명합니다.',['결단','의리','강직']],
 辛:['보석','다듬어진 보석. 완벽을 추구하고 감각이 예민하며 자존심이 강합니다.',['예리함','미적 감각','완벽주의']],
 壬:['큰 바다','넓게 흐르는 바다와 강. 지혜롭고 스케일이 크며 자유로움을 좋아합니다.',['지혜','포부','자유']],
 癸:['비와 이슬','만물을 적시는 비. 직관이 뛰어나고 조용히 스며드는 영향력이 있습니다.',['직관','감수성','적응']]};
const ORD=['wood','fire','earth','metal','water'];
const YANG='甲丙戊庚壬';
const ZM={子:'癸',丑:'己',寅:'甲',卯:'乙',辰:'戊',巳:'丙',午:'丁',未:'己',申:'庚',酉:'辛',戌:'戊',亥:'壬'};
const GRP={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',편재:'재성',정재:'재성',편관:'관성',정관:'관성',편인:'인성',정인:'인성'};
const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stars=n=>`<span class="stars">${'★'.repeat(n)}${'☆'.repeat(5-n)}</span>`;
const ira=w=>(w.charCodeAt(w.length-1)-0xAC00)%28?'이라':'라';
const tagc=k=>`<span class="tag ${k}">${ELN[k]}</span>`;
const CS_START={甲:'亥',丙:'寅',戊:'寅',庚:'巳',壬:'申',乙:'午',丁:'酉',己:'酉',辛:'子',癸:'卯'},CS12=['장생','목욕','관대','건록','제왕','쇠','병','사','묘','절','태','양'];
function ds12(dm,zhi){const Z='子丑寅卯辰巳午未申酉戌亥',a=Z.indexOf(CS_START[dm]),b=Z.indexOf(zhi);return CS12[YANG.includes(dm)?(b-a+12)%12:(a-b+12)%12]}
function tenGod(dm,g){const a=ORD.indexOf(EL[dm]),b=ORD.indexOf(EL[g]),same=YANG.includes(dm)===YANG.includes(g),r=(b-a+5)%5;
 return [['비견','겁재'],['식신','상관'],['편재','정재'],['편인','정인'],['편관','정관']][[0,1,2,4,3][r]][same?0:1]}

/* ============ 2. 시각 보정 (한국 표준시·서머타임 이력) ============
   [변경 시각(UTC), 그때부터의 UTC 오프셋(분)] — tz 데이터베이스 Asia/Seoul 기준 */
const TZ=[['1908-03-31T16:00',510],['1911-12-31T16:00',540],['1948-05-31T15:00',600],['1948-09-12T14:00',540],['1949-04-02T15:00',600],['1949-09-10T14:00',540],['1950-03-31T15:00',600],['1950-09-09T14:00',540],['1951-05-05T15:00',600],['1951-09-08T14:00',540],['1954-03-20T15:00',510],['1955-05-04T16:00',570],['1955-09-08T15:00',510],['1956-05-19T16:00',570],['1956-09-29T15:00',510],['1957-05-04T16:00',570],['1957-09-21T15:00',510],['1958-05-03T16:00',570],['1958-09-20T15:00',510],['1959-05-02T16:00',570],['1959-09-19T15:00',510],['1960-04-30T16:00',570],['1960-09-17T15:00',510],['1961-08-09T16:00',540],['1987-05-09T17:00',600],['1987-10-10T17:00',540],['1988-05-07T17:00',600],['1988-10-08T17:00',540]].map(([t,o])=>[Date.parse(t+'Z'),o]);
function tzOff(y,mo,d,h,mi){const W=Date.UTC(y,mo-1,d,h,mi);
 for(let i=TZ.length-1;i>=0;i--){const o=TZ[i][1],u=W-o*6e4;if(u>=TZ[i][0]&&(i===TZ.length-1||u<TZ[i+1][0]))return o}
 return null}

/* ============ 3. 사주 계산 (모든 탭이 같이 씀) ============ */
function compute(v){
 if(typeof Solar==='undefined')return {err:'계산 라이브러리를 불러오지 못했습니다.'};
 if(!v.date)return {err:'생년월일을 입력해 주세요.'};
 const [y,m,d]=v.date.split('-').map(Number);
 const [hh,mm]=(v.notime||!v.time?'12:00':v.time).split(':').map(Number);
 let solar;
 try{solar=v.cal==='s'?Solar.fromYmdHms(y,m,d,hh,mm,0):Lunar.fromYmdHms(y,v.cal==='ll'?-m:m,d,hh,mm,0).getSolar()}
 catch(e){return {err:'존재하지 않는 날짜입니다. 음력·윤달 여부를 확인해 주세요.'}}
 const inSolar=solar,lon=Number(v.loc||0);
 const off=tzOff(solar.getYear(),solar.getMonth(),solar.getDay(),solar.getHour(),solar.getMinute());
 let corr=0;
 if(!v.notime&&off!=null)corr=lon?Math.round(lon*4)-off:540-off;
 if(corr){const dt=new Date(solar.getYear(),solar.getMonth()-1,solar.getDay(),solar.getHour(),solar.getMinute()+corr,0);solar=Solar.fromDate(dt)}
 const e=solar.getLunar().getEightChar();e.setSect(Number(v.sect||2));
 // ── 절기 경계 보정 ──
 // 라이브러리의 절기 시각은 중국 표준시(UTC+8) 기준이라, 연주·월주·대운은
 // 실제 출생 순간을 UTC+8 시각으로 바꿔서 계산하고, 일주·시주는 출생지 시각을 그대로 씁니다.
 const bjShift=(off!=null?480-off:480-Math.round((lon||127)*4));
 const bjD=new Date(inSolar.getYear(),inSolar.getMonth()-1,inSolar.getDay(),inSolar.getHour(),inSolar.getMinute()+bjShift,0);
 const eB=Solar.fromDate(bjD).getLunar().getEightChar();eB.setSect(Number(v.sect||2));
 const dg0=e.getDayGan();
 e.getYear=()=>eB.getYear();e.getMonth=()=>eB.getMonth();
 e.getYearHideGan=()=>eB.getYearHideGan();e.getMonthHideGan=()=>eB.getMonthHideGan();
 e.getYearShiShenGan=()=>tenGod(dg0,eB.getYear()[0]);e.getMonthShiShenGan=()=>tenGod(dg0,eB.getMonth()[0]);
 e.getYearShiShenZhi=()=>eB.getYearHideGan().map(h=>tenGod(dg0,h));e.getMonthShiShenZhi=()=>eB.getMonthHideGan().map(h=>tenGod(dg0,h));
 e.getYearDiShi=()=>ds12(dg0,eB.getYear()[1]);e.getMonthDiShi=()=>ds12(dg0,eB.getMonth()[1]);
 e.getYearNaYin=()=>eB.getYearNaYin();e.getMonthNaYin=()=>eB.getMonthNaYin();
 e.getYun=sx=>eB.getYun(sx);
 const P=[
  {t:'시주',k:'시',gz:e.getTime(),gs:e.getTimeShiShenGan(),zs:e.getTimeShiShenZhi(),hid:e.getTimeHideGan(),ds:e.getTimeDiShi(),off:!!v.notime},
  {t:'일주',k:'일',gz:e.getDay(),gs:'日主',zs:e.getDayShiShenZhi(),hid:e.getDayHideGan(),ds:e.getDayDiShi(),me:1},
  {t:'월주',k:'월',gz:e.getMonth(),gs:e.getMonthShiShenGan(),zs:e.getMonthShiShenZhi(),hid:e.getMonthHideGan(),ds:e.getMonthDiShi()},
  {t:'연주',k:'연',gz:e.getYear(),gs:e.getYearShiShenGan(),zs:e.getYearShiShenZhi(),hid:e.getYearHideGan(),ds:e.getYearDiShi()}];
 const cnt={wood:0,fire:0,earth:0,metal:0,water:0};
 P.forEach(p=>{if(!p.off){cnt[EL[p.gz[0]]]++;cnt[EL[p.gz[1]]]++}});
 const dg=e.getDayGan(),sex=Number(v.sex);
 // 신강·신약
 const chars=[];P.forEach(p=>{if(p.off)return;if(!p.me)chars.push(p.gz[0]);chars.push(p.gz[1])});
 const me=EL[dg],mom=ORD[(ORD.indexOf(me)+4)%5];
 let sc=0;chars.forEach(c=>{if(EL[c]===me||EL[c]===mom)sc++});
 if(EL[P[2].gz[1]]===me||EL[P[2].gz[1]]===mom)sc++;
 const n=chars.length+1,st=sc>=n/2+1?'신강':sc<=n/2-1?'신약':'중화';
 const gc={비겁:0,식상:0,재성:0,관성:0,인성:0};chars.forEach(c=>gc[GRP[tenGod(dg,ZM[c]||c)]]++);
 const good={신강:['식상','재성','관성'],신약:['인성','비겁'],중화:['식상','재성']}[st];
 const bad={신강:['인성','비겁'],신약:['재성','관성'],중화:[]}[st];
 const C={v,solar,inSolar,off,corr,lon,e,P,cnt,dg,sex,st,sc,n,gc,good,bad};C.Y=yongsin(C);
 // 신강·신약 표시를 용신 분석의 가중치 계산(pct)으로 통일
 C.st=C.Y.pct>=55?'신강':C.Y.pct<=45?'신약':'중화';C.good={신강:['식상','재성','관성'],신약:['인성','비겁'],중화:['식상','재성']}[C.st];C.bad={신강:['인성','비겁'],신약:['재성','관성'],중화:[]}[C.st];
 C.yong=C.Y.yong;C.hee=C.Y.hee;C.gi=C.Y.gi;C.gu=C.Y.gu;return C;
}

/* ============ 4. 합·충 관계 ============ */
const pairIn=(list,a,b)=>list.some(x=>(x[0]===a&&x[1]===b)||(x[0]===b&&x[1]===a));
const S_HAP={甲己:'토',乙庚:'금',丙辛:'수',丁壬:'목',戊癸:'화'};
const S_CHUNG=['甲庚','乙辛','丙壬','丁癸'];
const B={육합:['子丑','寅亥','卯戌','辰酉','巳申','午未'],충:['子午','丑未','寅申','卯酉','辰戌','巳亥'],
 형:['寅巳','巳申','寅申','丑戌','戌未','丑未','子卯','辰辰','午午','酉酉','亥亥'],
 파:['子酉','丑辰','寅亥','卯午','巳申','未戌'],해:['子未','丑午','寅巳','卯辰','申亥','酉戌'],원진:['子未','丑午','寅酉','卯申','辰亥','巳戌']};
const SAM=[['申子辰','수'],['寅午戌','화'],['巳酉丑','금'],['亥卯未','목']];
function relS(a,b){const k=S_HAP[a+b]||S_HAP[b+a];if(k)return [{n:'천간합('+k+')',g:1}];if(pairIn(S_CHUNG,a,b))return [{n:'천간충',g:0}];return []}
function relB(a,b){const r=[];
 if(pairIn(B.육합,a,b))r.push({n:'육합',g:1});
 for(const [s,el] of SAM)if(a!==b&&s.includes(a)&&s.includes(b)&&(a===s[1]||b===s[1]))r.push({n:'반합('+el+')',g:1});
 for(const k of ['충','형','파','해','원진'])if(pairIn(B[k],a,b))r.push({n:k,g:0});
 return r}
function natalRels(C){
 const ps=C.P.filter(p=>!p.off),out=[];
 for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){
  const a=ps[i],b=ps[j];
  const pi=C.P.indexOf(a),pj=C.P.indexOf(b);
  relS(a.gz[0],b.gz[0]).forEach(r=>out.push({...r,pi,pj,kind:'s',t:`${a.k}간 ${a.gz[0]} · ${b.k}간 ${b.gz[0]}`}));
  relB(a.gz[1],b.gz[1]).forEach(r=>out.push({...r,pi,pj,kind:'b',t:`${a.k}지 ${a.gz[1]} · ${b.k}지 ${b.gz[1]}`}));
 }
 const zs=ps.map(p=>p.gz[1]).join('');
 for(const [s,el] of SAM)if([...s].every(c=>zs.includes(c)))out.unshift({n:'삼합('+el+')',g:1,t:s});
 return out}

/* ============ 5. 신살 ============ */
const TRI={申:'수',子:'수',辰:'수',寅:'화',午:'화',戌:'화',巳:'금',酉:'금',丑:'금',亥:'목',卯:'목',未:'목'};
const SAL={
 도화:{m:{수:'酉',화:'卯',금:'午',목:'子'},d:'사람을 끄는 매력과 인기. 예술·연예·서비스 분야에서 빛나고 이성 인연이 많습니다.'},
 역마:{m:{수:'寅',화:'申',금:'亥',목:'巳'},d:'움직임과 이동의 별. 출장·이사·해외·무역처럼 돌아다니는 일과 인연이 깊습니다.'},
 화개:{m:{수:'辰',화:'戌',금:'丑',목:'未'},d:'예술·종교·학문의 별. 혼자 몰입하는 깊이가 있고 정신적인 세계에 끌립니다.'}};
const GUI={甲:'丑未',戊:'丑未',庚:'丑未',乙:'子申',己:'子申',丙:'亥酉',丁:'亥酉',辛:'寅午',壬:'巳卯',癸:'巳卯'};
const MUN={甲:'巳',乙:'午',丙:'申',丁:'酉',戊:'申',己:'酉',庚:'亥',辛:'子',壬:'寅',癸:'卯'};
const YIN={甲:'卯',丙:'午',戊:'午',庚:'酉',壬:'子'};
const HONG={甲:'午',乙:'午',丙:'寅',丁:'未',戊:'辰',己:'辰',庚:'戌',辛:'酉',壬:'子',癸:'申'};
const BAEK=['甲辰','乙未','丙戌','丁丑','戊辰','壬戌','癸丑'],GOE=['庚辰','庚戌','壬辰','壬戌','戊戌'];
function sinsal(C){
 const ps=C.P.filter(p=>!p.off),dg=C.dg,out=[];
 const add=(n,where,d,g)=>{const f=out.find(x=>x.n===n);if(f){where.forEach(w=>f.w.includes(w)||f.w.push(w))}else out.push({n,w:[...where],d,g})};
 for(const base of [C.P[3],C.P[1]])for(const [n,o] of Object.entries(SAL)){
  const tgt=o.m[TRI[base.gz[1]]],w=ps.filter(p=>p!==base&&p.gz[1]===tgt).map(p=>p.k+'지');if(w.length)add(n+'살',w,o.d,n==='도화'?1:2)}
 const g1=ps.filter(p=>GUI[dg].includes(p.gz[1])).map(p=>p.k+'지');if(g1.length)add('천을귀인',g1,'가장 좋은 길신. 어려울 때 귀인이 나타나 도와주고 위기를 넘기는 힘이 있습니다.',1);
 const g2=ps.filter(p=>p.gz[1]===MUN[dg]).map(p=>p.k+'지');if(g2.length)add('문창귀인',g2,'총명함과 글재주의 별. 공부·시험·글쓰기에 유리합니다.',1);
 const g3=ps.filter(p=>p.gz[1]===YIN[dg]).map(p=>p.k+'지');if(g3.length)add('양인살',g3,'강한 칼의 기운. 결단력과 추진력이 크지만 성급함과 다툼을 조심합니다. 의료·군경·기술직에서 힘이 됩니다.',2);
 const g4=ps.filter(p=>p.gz[1]===HONG[dg]).map(p=>p.k+'지');if(g4.length)add('홍염살',g4,'은근한 매력과 감성의 별. 분위기 있는 매력으로 사람의 마음을 끕니다.',1);
 const g5=ps.filter(p=>BAEK.includes(p.gz)).map(p=>p.k+'주');if(g5.length)add('백호살',g5,'강한 에너지의 별. 큰일을 해내는 힘이 있지만 사고·건강을 미리 조심하라는 뜻으로 봅니다.',2);
 const g6=ps.filter(p=>GOE.includes(p.gz)).map(p=>p.k+'주');if(g6.length)add('괴강살',g6,'우두머리의 기운. 카리스마와 리더십이 강하고 극단적인 성공과 실패를 오갈 수 있습니다.',2);
 return out}

