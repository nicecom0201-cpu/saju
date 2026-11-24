/* tests.js — 자동 검증 테스트
   페이지 주소 끝에 #test 를 붙여 열면 실행되고, 결과가 창으로 뜹니다.
   기대값은 알려진 절기 시각(2024 입춘 17:27, 경칩 11:23 한국 시각)과
   널리 알려진 일진(2000-01-01 戊午, 1900-01-01 甲戌)으로 확인한 값입니다. */
const TESTS=[
 ['입춘 직전 (표준시 17:00)',{date:'2024-02-04',time:'17:00',loc:'0',sect:'2'},'辛酉 戊戌 乙丑 癸卯'],
 ['입춘 직후 (표준시 17:40)',{date:'2024-02-04',time:'17:40',loc:'0',sect:'2'},'辛酉 戊戌 丙寅 甲辰'],
 ['입춘 직전 (서울 보정 17:20)',{date:'2024-02-04',time:'17:20',loc:'127.0',sect:'2'},'庚申 戊戌 乙丑 癸卯'],
 ['경칩 직전 (11:10)',{date:'2024-03-05',time:'11:10',loc:'0',sect:'2'},'戊午 戊辰 丙寅 甲辰'],
 ['경칩 직후 (11:30)',{date:'2024-03-05',time:'11:30',loc:'0',sect:'2'},'戊午 戊辰 丁卯 甲辰'],
 ['서머타임 1987-07-01 10:00',{date:'1987-07-01',time:'10:00',loc:'127.0',sect:'2'},'壬辰 辛亥 丙午 丁卯'],
 ['UTC+8:30 시기 1958-01-10',{date:'1958-01-10',time:'14:30',loc:'127.0',sect:'2'},'丁未 丁亥 癸丑 丁酉'],
 ['자시 00:10 (0시에 날짜 바뀜)',{date:'1990-05-15',time:'00:10',loc:'127.0',sect:'2'},'丙子 己卯 辛巳 庚午'],
 ['자시 00:10 (23시에 날짜 바뀜)',{date:'1990-05-15',time:'00:10',loc:'127.0',sect:'1'},'丙子 庚辰 辛巳 庚午'],
 ['1900-01-01 (일진 甲戌)',{date:'1900-01-01',time:'12:00',loc:'127.0',sect:'2'},'庚午 甲戌 丙子 己亥'],
 ['2000-01-01 (일진 戊午)',{date:'2000-01-01',time:'12:00',loc:'0',sect:'2'},'戊午 戊午 丙子 己卯'],
 ['음력 윤달 2020-윤4-10',{cal:'ll',date:'2020-04-10',time:'12:00',loc:'0',sect:'2'},null]];
function runTests(){
 const out=[];let pass=0;
 for(const [n,v,exp] of TESTS){
  const C=compute({cal:'s',sex:'1',notime:false,...v});
  if(C.err){out.push([n,false,C.err]);continue}
  const got=C.P.map(p=>p.gz).join(' ');
  const ok=exp?got===exp:C.inSolar.toYmd()==='2020-06-01';
  if(ok)pass++;out.push([n,ok,exp?`${got}${ok?'':' (기대 '+exp+')'}`:`양력 ${C.inSolar.toYmd()} (기대 2020-06-01)`]);
 }
 // 십신·12운성 계산을 라이브러리와 대조
 const G='甲乙丙丁戊己庚辛壬癸',SSK={'比肩':'비견','劫财':'겁재','食神':'식신','伤官':'상관','偏财':'편재','正财':'정재','七杀':'편관','正官':'정관','偏印':'편인','正印':'정인'};
 let bad=0;for(const a of G)for(const b of G)if(SSK[LunarUtil.SHI_SHEN[a+b]]!==tenGod(a,b))bad++;
 out.push(['십신 100조합 라이브러리 대조',!bad,bad?`${bad}개 불일치`:'모두 일치']);if(!bad)pass++;
 let bad2=0,n2=0;for(let d=0;d<200;d++){const e=Solar.fromYmd(2001,1,1).next(d*11).getLunar().getEightChar();for(const [z,f] of [[e.getYear()[1],e.getYearDiShi()],[e.getDay()[1],e.getDayDiShi()]]){n2++;if(ds12(e.getDayGan(),z)!==DS[f])bad2++}}
 out.push([`12운성 ${n2}건 라이브러리 대조`,!bad2,bad2?`${bad2}개 불일치`:'모두 일치']);if(!bad2)pass++;
 openPanel(`자동 테스트 ${pass}/${out.length} 통과`,`<table class="mt"><thead><tr><th>항목</th><th>결과</th><th>시주 일주 월주 연주</th></tr></thead><tbody>${out.map(([n,ok,d])=>`<tr><td>${n}</td><td><b style="color:${ok?'var(--wood)':'var(--fire)'}">${ok?'통과':'실패'}</b></td><td>${d}</td></tr>`).join('')}</tbody></table>`);
 return {pass,total:out.length,out};
}
if(location.hash==='#test')setTimeout(runTests,300);
