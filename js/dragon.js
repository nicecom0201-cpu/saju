/* dragon.js — 상단 오른쪽에서 헤엄치는 용 (이 사이트 자체 디자인, SVG + 자바스크립트 애니메이션)
   몸통은 원 마디를 사인파 위에 놓아 구불구불 움직이고, 머리는 첫 마디의 방향을 따라 돕니다. */
(function(){
 const svg=document.getElementById('dragon');if(!svg)return;
 const NS='http://www.w3.org/2000/svg',N=30,W=320,H=170;
 const mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e};
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 const defs=mk('defs',{});
 defs.innerHTML=`<radialGradient id="dgBody" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe7a3"/><stop offset=".45" stop-color="#e3a630"/><stop offset="1" stop-color="#9c5a12"/></radialGradient>
 <radialGradient id="dgPearl" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#ffe9b0"/><stop offset="1" stop-color="#f0a33a"/></radialGradient>
 <radialGradient id="dgGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
 <linearGradient id="dgHead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c75a"/><stop offset="1" stop-color="#b97416"/></linearGradient>`;
 // 구름
 const clouds=[];for(const [x,y,s] of [[250,140,1],[70,30,.7],[180,22,.55]]){const g=mk('g',{opacity:.35});g.innerHTML=`<path d="M0 0c6-10 20-10 24-2 4-8 18-8 22 2 8-2 14 4 12 10H-8c-4-6 0-12 8-10z" fill="#c9ccd3"/>`;clouds.push({g,x,y,s})}
 // 여의주
 const glow=mk('circle',{r:22,fill:'url(#dgGlow)'}),flame=mk('path',{fill:'#ff8a3d',opacity:.85}),pearl=mk('circle',{r:9,fill:'url(#dgPearl)'});
 // 몸통 (꼬리부터 그려야 머리가 위에 옴)
 const segs=[],fins=[];
 const bodyG=mk('g',{});
 for(let i=N-1;i>=0;i--){
  const r=12.5*(1-i/N*.72);
  const fin=mk('path',{fill:'#d8443a',stroke:'#8f2219','stroke-width':.6},bodyG);
  const c=mk('circle',{r,fill:'url(#dgBody)',stroke:'#8a4c0e','stroke-width':.8},bodyG);
  const belly=mk('circle',{r:r*.45,fill:'#fff3cf',opacity:.75},bodyG);
  segs[i]={c,belly,r};fins[i]=fin;
 }
 // 꼬리 깃
 const tail=mk('path',{fill:'#d8443a',stroke:'#8f2219','stroke-width':.6},bodyG);
 // 머리
 const head=mk('g',{});
 head.innerHTML=`
  <path class="wh1" d="M-30 6 C-48 14,-58 2,-72 10" fill="none" stroke="#f6c75a" stroke-width="1.6" stroke-linecap="round"/>
  <path class="wh2" d="M-30 10 C-46 24,-60 18,-70 28" fill="none" stroke="#f6c75a" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M6 -10 C18 -26,24 -30,34 -34 M18 -20 C22 -26,28 -26,30 -30" fill="none" stroke="#c98a2a" stroke-width="3" stroke-linecap="round"/>
  <path d="M0 -12 C12 -22,14 -30,22 -36 M12 -18 C14 -24,20 -26,20 -30" fill="none" stroke="#e8b04a" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M8 -6 C20 -16,30 -8,26 2 C34 6,30 14,22 14 C26 22,14 24,8 16 Z" fill="#d8443a" stroke="#8f2219" stroke-width=".7"/>
  <path d="M10 -10 C-6 -14,-24 -10,-34 -2 C-38 2,-36 6,-30 6 L-8 6 C0 6,8 4,12 -2 Z" fill="url(#dgHead)" stroke="#8a4c0e" stroke-width=".9"/>
  <path class="jaw" d="M-30 7 C-24 14,-10 16,6 12 C10 10,12 8,10 4 L-8 7 Z" fill="#e0a238" stroke="#8a4c0e" stroke-width=".9"/>
  <path d="M-33 1 L-29 -1" stroke="#5a2a06" stroke-width="1.4" stroke-linecap="round"/>
  <ellipse cx="-10" cy="-4" rx="4.2" ry="3.4" fill="#fff"/><circle cx="-11" cy="-4" r="2" fill="#1b1c20"/><circle cx="-11.7" cy="-4.8" r=".7" fill="#fff"/>
  <path d="M-16 -9 C-10 -12,-4 -11,0 -8" fill="none" stroke="#8a4c0e" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M-26 8 l3 3 3-3 3 3 3-3" fill="none" stroke="#fff" stroke-width=".9"/>`;
 svg.appendChild(head);
 const wh1=head.querySelector('.wh1'),wh2=head.querySelector('.wh2'),jaw=head.querySelector('.jaw');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let visible=true;
 try{new IntersectionObserver(es=>{visible=es[0].isIntersecting}).observe(svg)}catch(e){}
 function frame(ts){
  const t=reduce?1.2:ts/1000;
  const pts=[];
  for(let i=0;i<N;i++){
   const x=84+i*7.4+Math.sin(t*.6)*6;
   const y=86+Math.sin(i*.42-t*2.2)*(14+i*.55)*(i<3?.6:1)+Math.sin(t*.8)*5;
   pts.push([x,y]);
  }
  for(let i=0;i<N;i++){
   const [x,y]=pts[i],s=segs[i],a=i<N-1?Math.atan2(pts[i+1][1]-y,pts[i+1][0]-x):0;
   s.c.setAttribute('cx',x);s.c.setAttribute('cy',y);
   const nx=-Math.sin(a),ny=Math.cos(a);
   s.belly.setAttribute('cx',x+nx*s.r*.35);s.belly.setAttribute('cy',y+ny*s.r*.35);
   // 등지느러미: 몸 바깥(위쪽)으로 삼각형
   const fh=s.r*(i%2?1.05:.8)+3,bx=x-nx*s.r*.7,by=y-ny*s.r*.7,tx=bx-nx*fh+Math.cos(a)*4,ty=by-ny*fh+Math.sin(a)*4;
   fins[i].setAttribute('d',`M${bx-Math.cos(a)*s.r*.6} ${by-Math.sin(a)*s.r*.6}L${tx} ${ty}L${bx+Math.cos(a)*s.r*.6} ${by+Math.sin(a)*s.r*.6}Z`);
  }
  // 꼬리 깃
  const [lx,ly]=pts[N-1],[px,py]=pts[N-2],ta=Math.atan2(ly-py,lx-px);
  tail.setAttribute('d',`M${lx} ${ly}C${lx+Math.cos(ta+.9)*18} ${ly+Math.sin(ta+.9)*18},${lx+Math.cos(ta)*26} ${ly+Math.sin(ta)*26},${lx+Math.cos(ta)*30} ${ly+Math.sin(ta)*30}C${lx+Math.cos(ta-.6)*20} ${ly+Math.sin(ta-.6)*20},${lx+Math.cos(ta-1)*12} ${ly+Math.sin(ta-1)*12},${lx} ${ly}Z`);
  // 머리: 첫 마디에서 몸 반대 방향을 바라봄
  const [hx,hy]=pts[0],dir=Math.atan2(hy-pts[1][1],hx-pts[1][0])*180/Math.PI;
  head.setAttribute('transform',`translate(${hx-4},${hy}) rotate(${dir-180+Math.sin(t*1.3)*4})`);
  const sw=Math.sin(t*3)*5;
  wh1.setAttribute('d',`M-30 6 C-46 ${12+sw},-58 ${0-sw},-74 ${8+sw*.6}`);
  wh2.setAttribute('d',`M-30 10 C-44 ${22-sw},-60 ${16+sw},-70 ${28-sw*.6}`);
  jaw.setAttribute('transform',`rotate(${(Math.sin(t*1.6)+1)*3},6,8)`);
  // 여의주: 입 앞에서 둥실
  const ox=hx-62+Math.sin(t*1.1)*3,oy=hy-4+Math.cos(t*1.4)*4;
  pearl.setAttribute('cx',ox);pearl.setAttribute('cy',oy);glow.setAttribute('cx',ox);glow.setAttribute('cy',oy);
  glow.setAttribute('r',20+Math.sin(t*2.4)*3);
  flame.setAttribute('d',`M${ox-8} ${oy+4}C${ox-14} ${oy-6},${ox-4} ${oy-10},${ox} ${oy-20+Math.sin(t*5)*2}C${ox+4} ${oy-10},${ox+14} ${oy-6},${ox+8} ${oy+4}Z`);
  for(const c of clouds){const cx=((c.x-t*8*c.s)%(W+80)+W+80)%(W+80)-40;c.g.setAttribute('transform',`translate(${cx},${c.y}) scale(${c.s})`)}
  if(!reduce)requestAnimationFrame(loop);
 }
 function loop(ts){if(visible)frame(ts);else requestAnimationFrame(loop)}
 frame(performance.now());
})();
