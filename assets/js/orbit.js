/* Hero orbit: tool icons travel round the ellipse, passing behind and in front of the portrait. */
(()=>{
const v=document.querySelector('.hero-visual'),o=v&&v.querySelector('.orbit');if(!o)return;
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const cards=[...v.querySelectorAll('.tool-card')],lights=[...o.querySelectorAll('.orbit-light')];
const tilt=-7*Math.PI/180,cT=Math.cos(tilt),sT=Math.sin(tilt);
let rx,ry,t0=performance.now(),speed=1,target=1,run=true,ang=0,vis=true;
const measure=()=>{rx=o.offsetWidth/2;ry=o.offsetHeight/2;cards.forEach(c=>{c.style.marginLeft=-c.offsetWidth/2+'px';c.style.marginTop=-c.offsetHeight/2+'px'});lights.forEach(l=>{l.style.marginLeft=-l.offsetWidth/2+'px';l.style.marginTop=-l.offsetHeight/2+'px'})};
measure();addEventListener('resize',measure);
v.addEventListener('pointerenter',()=>target=.3);v.addEventListener('pointerleave',()=>target=1);
new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(v);
document.addEventListener('visibilitychange',()=>{run=!document.hidden;t0=performance.now()});
v.classList.add('m-orbiting');
(function tick(now){
  requestAnimationFrame(tick);
  if(!run||!vis)return;
  const dt=Math.min(.05,(now-t0)/1000);t0=now;
  speed+=(target-speed)*.06;ang+=dt*.16*speed;
  cards.forEach((c,i)=>{
    const a=ang+i*(Math.PI*2/cards.length)+.6,x=Math.cos(a)*rx,y=Math.sin(a)*ry;
    const X=x*cT-y*sT,Y=x*sT+y*cT,depth=(Math.sin(a)+1)/2;      /* 0 = far/back, 1 = near/front */
    c.style.transform=`translate3d(${X}px,${Y}px,0) scale(${.86+depth*.28})`;
    c.style.zIndex=depth>.5?8:2;c.style.opacity=.55+depth*.45;
  });
  lights.forEach((l,i)=>{
    const a=-ang*(1.6+i*.35)+i*1.57,x=o.offsetWidth/2+Math.cos(a)*rx,y=o.offsetHeight/2+Math.sin(a)*ry;
    l.style.transform=`translate3d(${x}px,${y}px,0)`;
  });
})(performance.now());
})();
