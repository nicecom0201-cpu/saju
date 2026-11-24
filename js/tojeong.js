/* tojeong.js — 토정비결
   괘 산출: 전통 방식(세는나이·생월·생일과 그해 간지의 선천수)으로 상괘(1~8)·중괘(1~6)·하괘(1~3)를 구합니다.
   풀이: 원전·해설서 문장을 옮기지 않고 이 사이트에서 새로 쓴 문장입니다. */
const SCS={甲:9,己:9,乙:8,庚:8,丙:7,辛:7,丁:6,壬:6,戊:5,癸:5,子:9,午:9,丑:8,未:8,寅:7,申:7,卯:6,酉:6,辰:5,戌:5,巳:4,亥:4};
const gzNum=g=>SCS[g[0]]+SCS[g[1]];
// 상괘: 한 해의 큰 흐름 (팔괘 순서: 건·태·리·진·손·감·간·곤)
const TJ_UP=[
 ['乾','하늘','큰 뜻을 펼치는 해','하늘의 기운이 머리 위에 있으니 마음에 품은 큰 뜻을 꺼내기 좋은 해입니다. 앞장서서 이끌수록 길이 열리고, 윗사람과 조직의 신임이 따릅니다. 다만 혼자 다 하려 하면 지치니 믿을 사람에게 일을 나누세요.',4],
 ['兌','연못','사람 속에서 기쁨을 얻는 해','잔잔한 연못처럼 사람이 모이고 웃을 일이 늘어나는 해입니다. 말 한마디가 복을 부르니 칭찬과 감사를 아끼지 마세요. 즐거움에 빠져 씀씀이가 커지기 쉬우니 지갑만은 단단히 닫아 두세요.',4],
 ['離','불','이름이 드러나는 해','밝은 불이 주변을 비추듯 그동안의 노력이 겉으로 드러나는 해입니다. 발표, 시험, 승진처럼 평가받는 일에 힘이 실립니다. 불은 쉽게 번지니 감정이 달아오를 때는 한 번 식히고 말하세요.',4],
 ['震','우레','새 출발과 변화의 해','우레가 겨울잠을 깨우듯 묵혀 둔 일을 시작하게 되는 해입니다. 이사, 이직, 새 공부처럼 변화의 바람이 불어옵니다. 처음엔 소란스러워도 방향만 맞으면 하반기에 자리를 잡습니다.',3],
 ['巽','바람','소통과 이동의 해','바람이 틈을 찾아 스며들듯 부드러운 소통으로 일이 풀리는 해입니다. 멀리 오가는 일, 문서와 연락이 늘고 새로운 인연이 바람을 타고 옵니다. 마음이 갈대처럼 흔들리기 쉬우니 중심 하나는 꼭 잡아 두세요.',3],
 ['坎','물','시련 속에 지혜를 얻는 해','깊은 물을 건너듯 조심스럽게 나아가야 하는 해입니다. 예상 못 한 걸림돌이 있지만 서두르지 않으면 반드시 건너편에 닿습니다. 이 해에 배운 교훈과 아낀 돈이 다음 해의 큰 밑천이 됩니다.',2],
 ['艮','산','멈추고 다지는 해','산처럼 제자리를 지키며 힘을 모으는 해입니다. 무리하게 넓히기보다 가진 것을 정리하고 실력을 쌓을 때 탈이 없습니다. 조용히 준비한 사람에게 해가 끝날 무렵 좋은 소식이 옵니다.',2],
 ['坤','땅','품어서 거두는 해','넓은 땅이 씨앗을 품듯 꾸준함이 결실로 돌아오는 해입니다. 가족과 집안일, 부동산처럼 터전에 관한 일에 복이 있습니다. 남을 돕는 만큼 돌아오니 베풀되 보증만은 피하세요.',4]];
// 중괘: 재물과 사람
const TJ_MID=[
 ['재물이 모이는 흐름','들어오는 돈의 길이 넓어집니다. 작은 돈을 우습게 보지 않으면 한 해가 끝날 때 통장이 두둑해집니다.',4],
 ['귀인을 만나는 흐름','어려울 때 손을 내밀어 주는 사람이 나타납니다. 오래 연락하지 못한 사람에게 먼저 안부를 전하세요.',4],
 ['지출을 조심할 흐름','돈이 들어오는 만큼 나갈 일도 많습니다. 꼭 필요한 곳인지 한 번 더 따져 보면 손해를 막습니다.',2],
 ['문서와 계약의 흐름','계약, 자격, 서류 일이 많아지는 해입니다. 도장을 찍기 전에 끝까지 읽으면 좋은 문서가 복이 됩니다.',3],
 ['구설을 조심할 흐름','내 뜻과 다르게 말이 퍼지기 쉽습니다. 남의 이야기는 듣기만 하고 옮기지 않는 것이 가장 좋은 처방입니다.',2],
 ['가정이 화목한 흐름','집안에 웃음이 늘고 가족의 도움이 큽니다. 집에서 보내는 시간이 운을 채워 주는 해입니다.',4]];
// 하괘: 한 해의 마무리
const TJ_LOW=[
 ['처음은 더디나 끝이 좋음','상반기에는 일이 더디게 풀리지만 가을 이후 막힌 것이 뚫립니다. 초반의 답답함에 포기하지 마세요.',1],
 ['고르게 흘러감','큰 굴곡 없이 한 해가 고르게 흘러갑니다. 꾸준한 사람이 가장 많이 얻는 해입니다.',0],
 ['처음이 좋고 끝을 조심','봄과 여름에 기회가 몰리니 그때 부지런히 움직이세요. 연말에는 벌이기보다 정리하는 것이 좋습니다.',-1]];
const TJ_MON=[
 ['기운이 가라앉는 달','서두르면 탈이 나니 쉬어 가세요.','건강과 안전을 먼저 챙기세요.'],
 ['조심스러운 달','말과 돈 모두 아껴 쓰면 무난합니다.','작은 약속도 꼼꼼히 지키세요.'],
 ['무난한 달','평소 하던 일을 꾸준히 이어 가면 됩니다.','가까운 사람과 시간을 보내세요.'],
 ['기운이 오르는 달','미뤄 둔 일을 시작하기 좋습니다.','먼저 연락하면 반가운 소식이 옵니다.'],
 ['운이 활짝 핀 달','중요한 결정과 도전에 힘이 실립니다.','기회가 오면 망설이지 말고 잡으세요.']];
const LMN=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
function tojeong(C,Y){
 const bl=C.inSolar.getLunar(),bm=Math.abs(bl.getMonth()),bd=bl.getDay(),age=Y-bl.getYear()+1;
 const ygz=Lunar.fromYmd(Y,1,1).getYearInGanZhi();
 const mlen=LunarMonth.fromYm(Y,bm).getDayCount(),mgz=Lunar.fromYmd(Y,bm,1).getMonthInGanZhi();
 const dgz=Lunar.fromYmd(Y,bm,Math.min(bd,mlen)).getDayInGanZhi();
 const up=(age+gzNum(ygz))%8||8,mid=(mlen+gzNum(mgz))%6||6,low=(bd+gzNum(dgz))%3||3;
 const U=TJ_UP[up-1],M=TJ_MID[mid-1],L=TJ_LOW[low-1];
 const base=U[4]+M[2]-3+L[2]*0;
 // 12달: 괘 숫자와 달 순서로 정해지는 흐름 + 하괘의 전후반 기울기 + 그달 월건과 띠의 합·충
 const months=LMN.map((n,i)=>{let s=((up*3+mid*5+low*7+(i+1)*11)%5)-2+(base-3)*.5;
  s+=L[2]*(i<6?-.6:.6);
  const mg=Lunar.fromYmd(Y,i+1,1).getMonthInGanZhi(),r=relB(C.P[3].gz[1],mg[1]);if(r.some(x=>x.g))s+=.7;if(r.some(x=>x.n==='충'))s-=.9;
  const lv=Math.max(0,Math.min(4,Math.round(s+2)));return {n,lv,mg,txt:TJ_MON[lv]}});
 return {Y,ygz,age,up,mid,low,U,M,L,months,score:Math.max(1,Math.min(5,Math.round((U[4]+M[2])/2+L[2]*.3)))};
}
function drawTojeong(){
 if(!CUR)return;const Y=+$('tjy').value,T=tojeong(CUR,Y);
 $('tjres').innerHTML=`<div class="rc tjhead"><div class="tjno"><span>${T.up}</span><span>${T.mid}</span><span>${T.low}</span></div>
  <div><div class="age">${Y}년 ${T.ygz}(${KO[T.ygz[0]]}${KO[T.ygz[1]]})년 · ${T.age}세 · ${T.up}${T.mid}${T.low}괘</div><h3 style="font:700 24px/1.3 'Noto Serif KR',serif;margin:4px 0">${T.U[0]}(${T.U[1]}) — ${T.U[2]}</h3>${stars(T.score)}</div></div>
  <div class="rd" style="margin-top:12px"><div class="rc"><h3>한 해의 큰 흐름</h3><p>${T.U[3]}</p></div>
  <div class="rc"><h3>재물과 사람 · ${T.M[0]}</h3><p>${T.M[1]}</p></div>
  <div class="rc"><h3>한 해의 마무리 · ${T.L[0]}</h3><p>${T.L[1]}</p></div></div>
  <h3 class="ph3" style="margin-top:22px">달마다 보는 신수 (음력 기준)</h3>
  <div class="mo">${T.months.map(m=>`<div><div class="h"><b>${m.n}</b><span class="g">${m.mg}</span></div>${stars(m.lv+1)}<p><b style="color:var(--ink)">${m.txt[0]}</b> · ${m.txt[1]} ${m.txt[2]}</p></div>`).join('')}</div>
  <p class="note">괘는 전통 산출법(세는나이·음력 생월·생일과 ${Y}년 간지의 선천수)으로 구했고, 풀이는 이 사이트에서 새로 쓴 것으로 원전 문장과 다릅니다. 음력 생일 ${Math.abs(CUR.inSolar.getLunar().getMonth())}월 ${CUR.inSolar.getLunar().getDay()}일 기준입니다.</p>`;
}
{const n=new Date(),y0=n.getFullYear(),def=n.getMonth()>=9?y0+1:y0;$('tjy').innerHTML=[y0,y0+1].map(y=>`<option value="${y}"${y===def?' selected':''}>${y}년</option>`).join('')}
$('tjy').addEventListener('change',()=>{try{drawTojeong()}catch(e){$('tjres').textContent='오류: '+e.message}});
