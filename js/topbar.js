/* topbar.js — 상단 실시간 날짜·시간·요일·날씨
   날씨: Open-Meteo 무료 API (키 필요 없음). 위치를 허용하면 현재 위치, 아니면 서울 기준. */
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
function startWeather(){
 loadWeather();setInterval(loadWeather,30*60*1000);
 try{if(navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>{WX_POS={lat:+p.coords.latitude.toFixed(3),lon:+p.coords.longitude.toFixed(3),name:'현재 위치'};loadWeather()},()=>{}, {timeout:8000,maximumAge:3600000})}catch(e){}
}
startWeather();
