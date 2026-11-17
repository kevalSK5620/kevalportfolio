(()=>{
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const $=(s,r=document)=>[...r.querySelectorAll(s)],fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const add=(c)=>{const e=document.createElement('div');e.className=c;document.body.appendChild(e);return e};

/* images: load lazily, decode off the main thread (fixes the heavy portfolio page) */
$('img').forEach((im,i)=>{if(i>1)im.loading='lazy';im.decoding='async'});

/* scroll progress – one rAF-throttled transform */
const bar=add('m-progress');let t=0;
addEventListener('scroll',()=>{if(t)return;t=requestAnimationFrame(()=>{t=0;bar.style.transform=`scaleX(${scrollY/(document.documentElement.scrollHeight-innerHeight||1)})`})},{passive:true});

/* cursor blob – runs only while the mouse moves */
if(fine){const d=add('m-dot');document.body.classList.add('m-cursor');
  addEventListener('pointermove',e=>{d.classList.add('on');d.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0)`},{passive:true});
  document.addEventListener('pointerover',e=>d.classList.toggle('hot',!!e.target.closest('a,button')),{passive:true});}

/* reveal – observer unobserves after first show, so it costs nothing afterwards */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -6% 0px'});
const cards='.portfolio-card,.service-card,.info-card,.skill-box,.experience-item,.project-item,.timeline-item,.icon-box,.info-box,.info-item';
$('main h1,main h2').forEach(e=>{e.classList.add('m-r','m-wipe');io.observe(e)});
$(cards).forEach((e,i)=>{e.classList.add('m-r');e.style.transitionDelay=(i%3)*80+'ms';io.observe(e);setTimeout(()=>e.style.transitionDelay='',2000)});

/* card tilt – transform only, one frame per move */
if(fine)$(cards).forEach(el=>{let f=0;
  el.addEventListener('pointermove',e=>{if(f||!el.classList.contains('in'))return;f=requestAnimationFrame(()=>{f=0;const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
    el.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translate3d(-3px,-3px,0)`})},{passive:true});
  el.addEventListener('pointerleave',()=>{cancelAnimationFrame(f);f=0;el.style.transform=''});});

/* unique bit 1: headings scramble into place once */
const ch='01<>/{}#*+';
$('main h1,main h2').forEach(el=>{if(el.children.length)return;const s=el.textContent;
  const o=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;o.disconnect();let n=0;
    const id=setInterval(()=>{el.textContent=[...s].map((c,i)=>c===' '||i<n?c:ch[Math.random()*ch.length|0]).join('');if((n+=.8)>=s.length){el.textContent=s;clearInterval(id)}},40)},{threshold:.6});o.observe(el)});

/* unique bit 2: smooth fade between pages */
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');
  if(!a||a.target||e.metaKey||e.ctrlKey||a.origin!==location.origin||a.pathname===location.pathname||(a.getAttribute('href')||'').startsWith('#'))return;
  e.preventDefault();document.body.classList.add('m-out');setTimeout(()=>location.href=a.href,230)});
addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('m-out')});

$('.wave,.service-icon').forEach((e,i)=>{e.classList.add('m-float');e.style.animationDelay=i*-.7+'s'});
})();
