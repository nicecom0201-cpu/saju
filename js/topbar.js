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
  w.textContent=`${WX_POS.name}${WX_POS.auto?'':''} ${Math.round(c.temperature_2m)}° ${WMO[c.weather_code]||''} · 최고 ${Math.round(dy.temperature_2m_max[0])}° 최저 ${Math.round(dy.temperature_2m_min[0])}°`;
  w.title=`체감 ${Math.round(c.apparent_temperature)}° · 눌러서 지역 바꾸기`;
  w.setAttribute('aria-label',w.textContent+' (눌러서 지역 바꾸기)');
 }catch(e){w.textContent='날씨 정보를 불러올 수 없어요'}
}
// 위치: 사용자가 고른 지역이 있으면 그 지역, 없으면 내부적으로 대략적인 도시를 찾음 (GeoJS). 실패하면 서울.
const CITY_KO={Seoul:'서울',Busan:'부산',Incheon:'인천',Daegu:'대구',Daejeon:'대전',Gwangju:'광주',Ulsan:'울산',Sejong:'세종',Suwon:'수원',Seongnam:'성남',Goyang:'고양',Yongin:'용인',Bucheon:'부천',Ansan:'안산',Anyang:'안양',Cheongju:'청주',Jeonju:'전주',Cheonan:'천안',Changwon:'창원',Gimhae:'김해',Pohang:'포항',Jeju:'제주','Jeju City':'제주',Chuncheon:'춘천',Wonju:'원주',Gangneung:'강릉',Hwaseong:'화성',Pyeongtaek:'평택',Uijeongbu:'의정부',Paju:'파주',Gimpo:'김포',Gumi:'구미',Gyeongju:'경주',Jinju:'진주',Mokpo:'목포',Yeosu:'여수',Suncheon:'순천',Iksan:'익산',Gunsan:'군산',Asan:'아산',Siheung:'시흥',Namyangju:'남양주',Hanam:'하남',Gwangmyeong:'광명',Guri:'구리',Osan:'오산',Icheon:'이천',Anseong:'안성',Yangsan:'양산',Geoje:'거제',Tongyeong:'통영',Andong:'안동',Chungju:'충주',Jecheon:'제천',Sokcho:'속초',Seogwipo:'서귀포'};
// 직접 고르는 지역 목록 [이름, 위도, 경도]
const WX_PLACES=[['서울 강남구',37.517,127.047],['서울 강동구',37.530,127.124],['서울 강북구',37.640,127.025],['서울 강서구',37.551,126.849],['서울 관악구',37.478,126.951],['서울 광진구',37.538,127.082],['서울 구로구',37.495,126.887],['서울 금천구',37.457,126.895],['서울 노원구',37.654,127.056],['서울 도봉구',37.669,127.047],['서울 동대문구',37.574,127.039],['서울 동작구',37.512,126.939],['서울 마포구',37.566,126.901],['서울 서대문구',37.579,126.936],['서울 서초구',37.483,127.032],['서울 성동구',37.563,127.036],['서울 성북구',37.589,127.016],['서울 송파구',37.514,127.106],['서울 양천구',37.517,126.866],['서울 영등포구',37.526,126.896],['서울 용산구',37.532,126.990],['서울 은평구',37.602,126.929],['서울 종로구',37.573,126.979],['서울 중구',37.563,126.997],['서울 중랑구',37.606,127.093],
 ['인천',37.456,126.705],['수원',37.263,127.029],['성남',37.420,127.127],['고양',37.658,126.832],['용인',37.241,127.178],['부천',37.503,126.766],['춘천',37.881,127.730],['강릉',37.752,128.876],['청주',36.642,127.489],['대전',36.350,127.385],['세종',36.480,127.289],['천안',36.815,127.114],['전주',35.824,127.148],['광주',35.160,126.851],['대구',35.871,128.601],['포항',36.019,129.343],['울산',35.538,129.311],['부산',35.180,129.075],['창원',35.228,128.681],['제주',33.499,126.531],['서귀포',33.254,126.560]];
const wxSaved=()=>{try{return JSON.parse(localStorage.getItem('wx-loc')||'null')}catch(e){return null}};
async function findCity(){
 const sv=wxSaved();if(sv){WX_POS=sv;return}
 try{const c=JSON.parse(sessionStorage.getItem('wx-pos')||'null');if(c){WX_POS=c;return}}catch(e){}
 try{const r=await fetch('https://get.geojs.io/v1/ip/geo.json');if(!r.ok)throw 0;const j=await r.json();
  const lat=parseFloat(j.latitude),lon=parseFloat(j.longitude);if(!isFinite(lat)||!isFinite(lon))throw 0;
  // 서울 안의 구 단위는 IP로 정확히 알 수 없어서 '서울'로만 표시
  if(/seoul/i.test((j.region||'')+' '+(j.city||'')))WX_POS={lat:37.5665,lon:126.978,name:'서울'};
  else WX_POS={lat:+lat.toFixed(2),lon:+lon.toFixed(2),name:CITY_KO[j.city]||j.city||'현재 지역'};
  WX_POS.auto=1;
  try{sessionStorage.setItem('wx-pos',JSON.stringify(WX_POS))}catch(e){}
 }catch(e){}
}
function wxPicker(){
 const sel=$('wxsel'),sv=wxSaved();
 // 화면에는 지역 목록만 보이고, 처음 위치는 내부에서 자동으로 정함
 sel.innerHTML='<option value="" disabled>지역 선택</option>'+WX_PLACES.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('');
 const si=sv?WX_PLACES.findIndex(p=>p[0].replace(/^서울 /,'')===sv.name):-1;sel.value=si>=0?String(si):'';
 $('tbwx').addEventListener('click',()=>{sel.hidden=!sel.hidden;if(!sel.hidden)sel.focus()});
 sel.addEventListener('change',async()=>{
  if(sel.value==='')return;
  {const p=WX_PLACES[+sel.value];WX_POS={lat:p[1],lon:p[2],name:p[0].replace(/^서울 /,'')};try{localStorage.setItem('wx-loc',JSON.stringify(WX_POS))}catch(e){}}
  sel.hidden=true;loadWeather()});
}
async function startWeather(){wxPicker();await findCity();loadWeather();setInterval(loadWeather,30*60*1000)}
startWeather();
