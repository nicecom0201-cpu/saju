/* topbar.js — 상단 실시간 날짜·시간·요일·날씨
   날씨: Open-Meteo 무료 API (키 필요 없음). 위치는 접속 IP 기준 대략적인 도시(묻는 창 없음), 실패하면 서울. */
const WMO={0:'맑음',1:'대체로 맑음',2:'구름 조금',3:'흐림',45:'안개',48:'안개',51:'약한 이슬비',53:'이슬비',55:'강한 이슬비',56:'어는 이슬비',57:'어는 이슬비',61:'약한 비',63:'비',65:'강한 비',66:'어는 비',67:'어는 비',71:'약한 눈',73:'눈',75:'많은 눈',77:'싸락눈',80:'소나기',81:'소나기',82:'강한 소나기',85:'눈 소나기',86:'강한 눈 소나기',95:'뇌우',96:'우박 동반 뇌우',99:'우박 동반 뇌우'};
function tickClock(){const d=new Date();
 $('tbdate').textContent=`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${'일월화수목금토'[d.getDay()]}요일`;
 $('tbtime').textContent=`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`}
tickClock();setInterval(tickClock,1000);
let WX_POS={lat:37.5665,lon:126.978,name:'서울'};
async function loadWeather(){
 const w=$('tbwx');
 try{
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${WX_POS.lat}&longitude=${WX_POS.lon}&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
  const r=await fetch(u);if(!r.ok)throw 0;const j=await r.json(),c=j.current,dy=j.daily;
  w.textContent=`${WX_POS.name} ${Math.round(c.temperature_2m)}° ${WMO[c.weather_code]||''} · 최고 ${Math.round(dy.temperature_2m_max[0])}° 최저 ${Math.round(dy.temperature_2m_min[0])}°`;
  w.title=`체감 ${Math.round(c.apparent_temperature)}° · Open-Meteo 제공`;
 }catch(e){w.textContent='날씨 정보를 불러올 수 없어요'}
}
// 위치: 브라우저에 묻지 않고 접속 IP로 대략적인 도시를 찾음 (GeoJS 무료 서비스). 실패하면 서울.
const CITY_KO={Seoul:'서울',Busan:'부산',Incheon:'인천',Daegu:'대구',Daejeon:'대전',Gwangju:'광주',Ulsan:'울산',Sejong:'세종',Suwon:'수원',Seongnam:'성남',Goyang:'고양',Yongin:'용인',Bucheon:'부천',Ansan:'안산',Anyang:'안양',Cheongju:'청주',Jeonju:'전주',Cheonan:'천안',Changwon:'창원',Gimhae:'김해',Pohang:'포항',Jeju:'제주','Jeju City':'제주',Chuncheon:'춘천',Wonju:'원주',Gangneung:'강릉',Hwaseong:'화성',Pyeongtaek:'평택',Uijeongbu:'의정부',Paju:'파주',Gimpo:'김포',Gumi:'구미',Gyeongju:'경주',Jinju:'진주',Mokpo:'목포',Yeosu:'여수',Suncheon:'순천',Iksan:'익산',Gunsan:'군산',Asan:'아산',Siheung:'시흥',Namyangju:'남양주',Hanam:'하남',Gwangmyeong:'광명',Guri:'구리',Osan:'오산',Icheon:'이천',Anseong:'안성',Yangsan:'양산',Geoje:'거제',Tongyeong:'통영',Andong:'안동',Chungju:'충주',Jecheon:'제천',Sokcho:'속초',Seogwipo:'서귀포'};
async function findCity(){
 try{const c=JSON.parse(sessionStorage.getItem('wx-pos')||'null');if(c){WX_POS=c;return}}catch(e){}
 try{const r=await fetch('https://get.geojs.io/v1/ip/geo.json');if(!r.ok)throw 0;const j=await r.json();
  const lat=parseFloat(j.latitude),lon=parseFloat(j.longitude);if(!isFinite(lat)||!isFinite(lon))throw 0;
  WX_POS={lat:+lat.toFixed(2),lon:+lon.toFixed(2),name:CITY_KO[j.city]||j.city||'현재 지역'};
  try{sessionStorage.setItem('wx-pos',JSON.stringify(WX_POS))}catch(e){}
 }catch(e){}
}
async function startWeather(){await findCity();loadWeather();setInterval(loadWeather,30*60*1000)}
startWeather();
