/* snap.js — 결과를 사진(PNG)으로 저장 (html2canvas는 처음 누를 때만 불러옴) */
let H2C=null;
function loadH2C(){
 if(window.html2canvas)return Promise.resolve();
 if(!H2C)H2C=new Promise((ok,no)=>{const s=document.createElement('script');s.src='js/html2canvas.min.js';s.onload=ok;s.onerror=()=>{H2C=null;no(new Error('load'))};document.head.appendChild(s)});
 return H2C;
}
const txt=id=>{const e=$(id);return !!e&&e.innerText.trim().length>20};
const SNAP={
 saju:{el:()=>$('v-saju'),name:'사주',ready:()=>typeof CUR!=='undefined'&&CUR&&CUR.P},
 match:{el:()=>$('gres'),name:'궁합',ready:()=>txt('gres')},
 name:{el:()=>$('ares'),name:'이름풀이',ready:()=>txt('ares')},
 luck:{el:()=>$('v-luck'),name:'운세',ready:()=>txt('today'),skip:'.whobar,#cprev,#cnext',after:'nyr'},
 taek:{el:()=>$('tres'),name:'택일',ready:()=>txt('tres'),after:'tres'},
 manse:{el:()=>$('v-manse'),name:'만세력',ready:()=>txt('mres'),skip:'#mf,#mmprev,#mmnext',after:'mres'},
 tojeong:{el:()=>$('tjres'),name:'토정비결',ready:()=>txt('tjres'),after:'tjres'},
 dream:{el:()=>$('dres'),name:'꿈해몽',ready:()=>txt('dres'),after:'dres'},
 tarot:{el:()=>$('tarotres'),name:'타로',ready:()=>txt('tarotres'),after:'tarotres'}
};
async function snapOut(kind,btn){
 const c=SNAP[kind];
 if(!c.ready()){btn.textContent='먼저 결과를 계산해 주세요';setTimeout(()=>btn.textContent=btn.dataset.l,1800);return}
 btn.disabled=true;btn.textContent='사진 만드는 중…';
 try{
  await loadH2C();
  const el=c.el(),r=el.getBoundingClientRect(),w=Math.ceil(r.width),h=Math.ceil(el.scrollHeight)+70;
  const sc=Math.max(1,Math.min(2,Math.sqrt(15e6/(w*h)),14000/h));
  const bg=getComputedStyle(document.body).backgroundColor;
  const cv=await html2canvas(el,{scale:sc,backgroundColor:bg,useCORS:true,logging:false,windowWidth:document.documentElement.clientWidth,
   ignoreElements:n=>n.matches&&n.matches('#f,.tools,.err,.copybox,[data-copy],[data-snap],#cadd,.tip,#sv'+(c.skip?','+c.skip:'')),
   onclone:d=>{const st=d.createElement('style');st.textContent='.ch,.mini .c{box-shadow:none!important}.tcard>span{transition:none!important;transform:none!important}.tcard:not(.open) .tface,.tcard.open .tback{display:none!important}.tcard.open .tface.rev{transform:rotate(180deg)!important}';d.head.appendChild(st);const e=d.getElementById(el.id);if(!e)return;e.style.paddingBottom='0';
    if(!e.matches('main'))e.style.padding='18px 16px';
    const f=d.createElement('div');f.textContent='사주 만세력 · '+new Date().toLocaleDateString('ko-KR')+' · LORD';
    f.style.cssText='text-align:center;font:500 13px "IBM Plex Sans KR",sans-serif;opacity:.6;padding:18px 0 22px';e.appendChild(f)}});
  const blob=await new Promise(ok=>cv.toBlob(ok,'image/png'));
  const t=new Date(),fn=`${c.name}_${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}.png`;
  const file=new File([blob],fn,{type:'image/png'});
  const mobile=matchMedia('(pointer:coarse)').matches;
  if(mobile&&navigator.canShare&&navigator.canShare({files:[file]})){
   try{await navigator.share({files:[file],title:fn});btn.textContent='저장/공유 완료'}
   catch(e){if(e.name==='AbortError')btn.textContent=btn.dataset.l;else{dl(blob,fn);btn.textContent='사진을 내려받았어요'}}
  }else{dl(blob,fn);btn.textContent='사진을 내려받았어요'}
 }catch(e){btn.textContent='사진 저장에 실패했어요'}
 btn.disabled=false;setTimeout(()=>btn.textContent=btn.dataset.l,2200);
}
function dl(blob,fn){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
function snapBtn(kind){const s=document.createElement('button');s.type='button';s.className='ghost';s.dataset.snap=kind;s.textContent='사진으로 저장';s.dataset.l=s.textContent;s.addEventListener('click',()=>snapOut(kind,s));return s}
document.querySelectorAll('[data-copy]').forEach(b=>b.after(snapBtn(b.dataset.copy)));
for(const[k,c]of Object.entries(SNAP))if(c.after){const a=$(c.after);if(!a)continue;const d=document.createElement('div');d.className='tools';d.appendChild(snapBtn(k));
 if(k==='luck'||k==='manse'){const w=[...c.el().querySelectorAll('.wrap')].pop();(w||c.el()).appendChild(d)}else a.after(d)}
