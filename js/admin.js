/* admin.js — 관리자 모드 */
/* ============ 28. 관리자 모드 ============
   저장한 사람 목록은 관리자 PIN을 입력했을 때만 보입니다.
   PIN은 해시(SHA-256)로만 저장하고, 페이지를 새로 열면 다시 잠깁니다. */
let ADMIN=false,FAIL=0,LOCKUNTIL=0;
async function pinHash(pin){
 const data=new TextEncoder().encode('saju-admin-v1:'+pin);
 if(window.crypto&&crypto.subtle){const h=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('')}
 let h=0;for(const b of data)h=(h*31+b)>>>0;return 'x'+h.toString(16)}
function applyAdmin(){
 document.body.classList.toggle('admin',ADMIN);
 $('adminbtn').textContent=ADMIN?'관리자 잠금':'관리자';
 $('adminbox').hidden=!ADMIN;$('sv').hidden=!ADMIN;
 if(ADMIN){drawPeople();$('adminbox').scrollIntoView({behavior:'smooth',block:'start'})}else{$('people').innerHTML='';drawWho()}
}
function adminForm(mode,msg){
 const set=mode==='set'||mode==='change';
 openPanel(set?'관리자 PIN 설정':'관리자 로그인',`<form id="pinf" class="form" style="grid-template-columns:minmax(0,1fr)" autocomplete="off">
  ${mode==='change'?'<label>현재 PIN<input id="pin0" type="password" inputmode="numeric" maxlength="12"></label>':''}
  <label>${set?'새 PIN (숫자 4~12자리)':'PIN'}<input id="pin1" type="password" inputmode="numeric" maxlength="12" autofocus></label>
  ${set?'<label>새 PIN 확인<input id="pin2" type="password" inputmode="numeric" maxlength="12"></label>':''}
  <button type="submit">${set?'PIN 저장':'열기'}</button><p class="err" id="pinerr">${msg||''}</p>
  <p class="note" style="margin:0">${set?'PIN은 이 브라우저에만 암호 형태(해시)로 저장됩니다. 잊어버리면 저장 목록을 다시 볼 수 없으니 꼭 기억해 두세요.':'저장한 사람 정보는 관리자만 볼 수 있습니다.'}</p></form>`);
 setTimeout(()=>{const f=$(mode==='change'?'pin0':'pin1');if(f)f.focus()},50);
 $('pinf').addEventListener('submit',async ev=>{ev.preventDefault();const e=$('pinerr');
  if(Date.now()<LOCKUNTIL){e.textContent=`잠시 후 다시 시도하세요 (${Math.ceil((LOCKUNTIL-Date.now())/1000)}초).`;return}
  const p1=$('pin1').value.trim();
  if(set){
   if(mode==='change'&&await pinHash($('pin0').value.trim())!==LS.get('saju-admin',null)){e.textContent='현재 PIN이 맞지 않습니다.';return}
   if(!/^\d{4,12}$/.test(p1)){e.textContent='숫자 4~12자리로 입력해 주세요.';return}
   if(p1!==$('pin2').value.trim()){e.textContent='두 PIN이 다릅니다.';return}
   LS.set('saju-admin',await pinHash(p1));ADMIN=true;closePanel();applyAdmin();return}
  if(await pinHash(p1)===LS.get('saju-admin',null)){FAIL=0;ADMIN=true;closePanel();applyAdmin();
   const last=LS.get('saju-in',null);if(last){fillForm(last);run()}}
  else{FAIL++;if(FAIL>=5){LOCKUNTIL=Date.now()+60000;FAIL=0;e.textContent='5번 틀려서 1분 동안 잠깁니다.'}else e.textContent=`PIN이 맞지 않습니다. (${FAIL}/5)`}});
}
$('adminbtn').addEventListener('click',()=>{
 if(ADMIN){ADMIN=false;fillForm(DEF);run();
  // 궁합 탭에 불러온 사람 정보도 지움
  setWho('ga',DEF);setWho('gb',GB_DEF);$('gres').innerHTML='';$('gcwrap').hidden=true;GA=GB=null;closePanel();applyAdmin();return}
 adminForm(LS.get('saju-admin',null)?'login':'set')});
$('pinchg').addEventListener('click',()=>adminForm('change'));
$('wipe').addEventListener('click',()=>{const b=$('wipe');
 if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='정말 모두 지울까요? 한 번 더 누르세요';setTimeout(()=>{b.dataset.c='';b.textContent='저장 목록 전체 삭제'},4000);return}
 LS.set('saju-people',[]);LS.set('saju-in',null);b.dataset.c='';b.textContent='저장 목록 전체 삭제';drawPeople()});

