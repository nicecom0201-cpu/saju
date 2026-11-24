/* main.js — 탭 전환과 시작 (맨 마지막에 불러와야 함) */
/* ============ 12. 탭 전환과 시작 ============ */
function route(){
 const TABS=['saju','luck','match','name','taek','manse'],t=TABS.includes(location.hash.slice(1))?location.hash.slice(1):'saju';
 for(const k of TABS)$('v-'+k).hidden=k!==t;
 if(t==='manse')try{initManse()}catch(e){}
 if(t==='luck')try{drawCal()}catch(e){}
 const on=document.querySelector(`#tabs a[data-t="${t}"]`);if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest',inline:'nearest'});
 document.querySelectorAll('#tabs a').forEach(a=>a.classList.toggle('on',a.dataset.t===t));
 if(t==='match'&&!$('gres').innerHTML)try{gRun()}catch(e){}
 if(t==='name'&&!$('nres').innerHTML)try{nameRun()}catch(e){}
 if(t==='name'&&!$('ares').innerHTML)try{$('a1').value=$('a1').value||'민';$('a2').value=$('a2').value||'준';hjOpts(1);hjOpts(2);nameAnalyze()}catch(e){}
}
window.addEventListener('hashchange',route);
const act=(ev,fn)=>{if(ev.type==='keydown'&&ev.key!=='Enter'&&ev.key!==' ')return;if(ev.type==='keydown')ev.preventDefault();fn()};
for(const id of ['dy','tl'])for(const t of ['click','keydown'])$(id).addEventListener(t,ev=>{const c=ev.target.closest('[data-dy]');if(c)act(ev,()=>openDaeun(+c.dataset.dy))});
for(const t of ['click','keydown']){
 $('calg').addEventListener(t,ev=>{const c=ev.target.closest('[data-day]');if(c)act(ev,()=>{const [y,m,d]=c.dataset.day.split('-').map(Number);openDay(y,m,d,[[CUR,'']])})});
 $('gcal').addEventListener(t,ev=>{const c=ev.target.closest('[data-day]');if(c)act(ev,()=>{const [y,m,d]=c.dataset.day.split('-').map(Number);openDay(y,m,d,[[GA,GNAMES[0]],[GB,GNAMES[1]]])})});
}
const run=()=>{try{calc()}catch(er){$('err').textContent='계산 중 오류: '+er.message}};
$('go').addEventListener('click',run);
$('f').addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.tagName!=='BUTTON'){ev.preventDefault();run()}});
$('f').addEventListener('change',ev=>{if(ev.target.id!=='nm')run()});
$('notime').addEventListener('change',()=>{$('time').disabled=$('notime').checked});
const DEF={nm:'',cal:'s',date:'1990-05-15',time:'14:30',sex:'1',loc:'127.0',sect:'2'};
fillForm(DEF);
applyAdmin();
whoForm('ga','첫째 사람',readForm());
const GB_DEF={nm:'',cal:'s',date:'1992-08-21',time:'10:00',sex:'0'};
whoForm('gb','둘째 사람',GB_DEF);
drawPeople();
run();
route();
