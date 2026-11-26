const en=document.body.dataset.lang==='en';
const say=(zh,english)=>en?english:zh;
// Clear the retired theme preference; all pages use the light palette.
try{localStorage.removeItem('hp-theme')}catch{}
document.querySelector(`[data-route="${document.body.dataset.page}"]`)?.classList.add('active');
const menu=document.querySelector('.menu');
function setMenu(open){if(!open)document.querySelector('.product-menu')?.removeAttribute('open');document.querySelector('nav').classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?say('收起导航','Close navigation'):say('展开导航','Open navigation'))}
menu.onclick=()=>setMenu(menu.getAttribute('aria-expanded')!=='true');
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus()}});
document.addEventListener('click',e=>{if(menu.getAttribute('aria-expanded')==='true'&&!e.target.closest('header'))setMenu(false)});
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('aside a').forEach(a=>{const active=a.hash==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})})},{rootMargin:'-15% 0px -55% 0px'});
document.querySelectorAll('article>section').forEach(s=>observer.observe(s));
async function copy(text,status){try{await navigator.clipboard.writeText(text);status.textContent=say('已复制：','Copied: ')+text}catch{status.textContent=say('自动复制不可用，请选择并手动复制：','Automatic copying is unavailable; select and copy this text manually: ')+text}}
document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>copy(b.dataset.copy,b.parentElement.querySelector('.copy-status')));
document.querySelectorAll('.copy-color').forEach(b=>b.onclick=()=>copy(b.dataset.color,document.querySelector('#colorStatus')));
const language=document.querySelector('.language-switch');
function languageURL(){const url=new URL(language.href);url.search=location.search;url.hash=location.hash;language.href=url.href}
languageURL();window.addEventListener('hashchange',languageURL);
language.addEventListener('click',()=>{try{localStorage.setItem('hp-language',en?'zh':'en')}catch{}});
const form=document.querySelector('.job-filters');
if(form){
 const query=document.querySelector('#job-query'),team=document.querySelector('#job-team'),type=document.querySelector('#job-type');
 const items=[...document.querySelectorAll('.job')];
 const params=new URLSearchParams(location.search);query.value=params.get('q')||'';team.value=params.get('team')||'';type.value=params.get('type')||'';
 // Match the product menu while retaining native selects as a no-JavaScript fallback.
 const pickers=[team,type].map(select=>{
  const label=form.querySelector(`label[for="${select.id}"]`);
  const wrap=document.createElement('div');wrap.className='job-picker';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='job-picker-trigger';trigger.id=select.id+'-trigger';
  const value=document.createElement('span');value.id=select.id+'-value';trigger.append(value);
  label.id=select.id+'-label';label.htmlFor=trigger.id;
  trigger.setAttribute('aria-labelledby',label.id+' '+value.id);trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
  const list=document.createElement('div');list.className='job-picker-list';list.id=select.id+'-list';list.hidden=true;list.setAttribute('role','listbox');list.setAttribute('aria-labelledby',label.id);trigger.setAttribute('aria-controls',list.id);
  const options=[...select.options].map(option=>{const b=document.createElement('button');b.type='button';b.className='job-picker-option';b.textContent=option.textContent;b.dataset.value=option.value;b.setAttribute('role','option');b.tabIndex=-1;list.append(b);return b});
  function close(restore=false){list.hidden=true;trigger.setAttribute('aria-expanded','false');if(restore)trigger.focus()}
  function sync(){value.textContent=select.selectedOptions[0]?.textContent||select.options[0].textContent;options.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.value===select.value)));close()}
  function open(last=false){form.querySelectorAll('.job-picker-trigger[aria-expanded="true"]').forEach(b=>b.click());list.hidden=false;trigger.setAttribute('aria-expanded','true');(last?options.at(-1):options.find(b=>b.dataset.value===select.value)||options[0]).focus()}
  trigger.addEventListener('click',()=>list.hidden?open():close());
  trigger.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();open(e.key==='ArrowUp')}});
  options.forEach(b=>b.addEventListener('click',()=>{select.value=b.dataset.value;select.dispatchEvent(new Event('change',{bubbles:true}));sync();close(true)}));
  list.addEventListener('keydown',e=>{let i=options.indexOf(document.activeElement);if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();i=e.key==='Home'?0:e.key==='End'?options.length-1:(i+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;options[i].focus()}else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){const found=options.find(b=>b.textContent.toLocaleLowerCase().startsWith(e.key.toLocaleLowerCase()));if(found){e.preventDefault();found.focus()}}});
  wrap.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close(true)}});
  wrap.addEventListener('focusout',e=>{if(!wrap.contains(e.relatedTarget))close()});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))close()});
  select.hidden=true;select.after(wrap);wrap.append(trigger,list);sync();return {sync};
 });
 function filter(updateURL=true){
  pickers.forEach(p=>p.sync());
  const words=query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);let count=0;
  items.forEach(item=>{const match=(!team.value||item.dataset.team===team.value)&&(!type.value||item.dataset.type===type.value)&&words.every(w=>item.dataset.search.toLocaleLowerCase().includes(w));item.hidden=!match;if(match)count++});
  document.querySelector('#job-count').textContent=en?`${count} of ${items.length} roles`:`显示 ${count} / ${items.length} 个岗位`;
  document.querySelector('#job-empty').hidden=count!==0;
  if(updateURL){const url=new URL(location.href);for(const [key,value] of [['q',query.value],['team',team.value],['type',type.value]]){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key)}history.replaceState(null,'',url);languageURL()}
 }
 query.addEventListener('input',()=>filter());team.addEventListener('change',()=>filter());type.addEventListener('change',()=>filter());
 form.addEventListener('reset',()=>setTimeout(()=>filter(),0));document.querySelector('#reset-jobs').onclick=()=>{form.reset();query.focus()};filter(false);
 function revealHash(){const target=document.getElementById(location.hash.slice(1));if(target?.classList.contains('job')){if(target.hidden){query.value='';team.value='';type.value='';filter()}target.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}))}}
 revealHash();window.addEventListener('hashchange',revealHash);
 items.forEach(item=>item.addEventListener('toggle',()=>{if(item.open){const url=new URL(location.href);url.hash=item.id;history.replaceState(null,'',url);languageURL()}else if(location.hash==='#'+item.id){history.replaceState(null,'',location.pathname+location.search);languageURL()}}));
}

const mobileToc=document.querySelector('.mobile-toc');
mobileToc?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileToc.open=false}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileToc)mobileToc.open=false});
// Hover reveals QR codes; touch and keyboard can pin either face.
const qrCards=[...document.querySelectorAll('.flip-card')];
function setQrFace(card,show){
 card.classList.toggle('is-flipped',show);
 card.querySelector('.qr-toggle').setAttribute('aria-pressed',String(show));
 card.querySelector('.flip-back').setAttribute('aria-hidden',String(!show));
 card.querySelector('.flip-front').setAttribute('aria-hidden',String(show));
 card.querySelector('.qr-original').tabIndex=show?0:-1;
}
qrCards.forEach(card=>{
 card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')setQrFace(card,true)});
 card.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!card.dataset.pinned)setQrFace(card,false)});
 card.querySelector('.qr-toggle').addEventListener('click',()=>{
  const pinned=!card.dataset.pinned;
  if(pinned)card.dataset.pinned='true';else delete card.dataset.pinned;
  setQrFace(card,pinned);
 });
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){delete card.dataset.pinned;setQrFace(card,false)}});
 card.addEventListener('focusout',e=>{if(!card.contains(e.relatedTarget)){delete card.dataset.pinned;setQrFace(card,false)}});
});
function openAccountQr(){
 const card=qrCards.find(card=>'#'+card.id===location.hash);
 if(card){card.dataset.pinned='true';setQrFace(card,true);requestAnimationFrame(()=>card.scrollIntoView({block:'start'}))}
}
window.addEventListener('hashchange',openAccountQr);
document.querySelectorAll('footer a[href*="#"]').forEach(a=>a.addEventListener('click',()=>{if(new URL(a.href).pathname===location.pathname)setTimeout(openAccountQr,0)}));
openAccountQr();
// Product navigation also works with touch, keyboard and outside clicks.
const productMenu=document.querySelector('.product-menu');
if(['box','rsi'].includes(document.body.dataset.page)){
 productMenu?.querySelector('summary')?.classList.add('active');
 const productPath=location.pathname.replace(/index\.html$/,'');
 productMenu?.querySelectorAll('a').forEach(a=>{if(a.pathname===productPath)a.setAttribute('aria-current','page')});
}
document.addEventListener('click',e=>{if(productMenu&&!productMenu.contains(e.target))productMenu.open=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&productMenu)productMenu.open=false});
// Preserve old product section bookmarks after introducing the dedicated home page.
if(document.body.dataset.page==='home'&&/^#(intro|chapter[123])$/.test(location.hash))location.replace((en?'/en':'')+'/products/hyperbrain-box/'+location.hash);
if(document.body.dataset.page.startsWith('news/')){
 const newsLink=document.querySelector('[data-route="news"]');newsLink?.classList.add('active');newsLink?.setAttribute('aria-current','page');
}
const newsFilters=document.querySelector('.news-filters');
if(newsFilters){
 const buttons=[...newsFilters.querySelectorAll('button')],stories=[...document.querySelectorAll('[data-news-kind]')];
 function filterNews(category,update=true){
  if(!buttons.some(b=>b.dataset.newsCategory===category))category='all';
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.newsCategory===category)));
  let count=0;stories.forEach(s=>{s.hidden=category!=='all'&&s.dataset.newsKind!==category;if(!s.hidden)count++});
  document.querySelector('.news-empty').hidden=count>0;
  document.querySelector('.news-result').textContent=en?`${count} ${count===1?'article':'articles'}`:`共 ${count} 篇新闻`;
  if(update){const u=new URL(location.href);if(category==='all')u.searchParams.delete('category');else u.searchParams.set('category',category);history.replaceState(null,'',u);languageURL()}
 }
 buttons.forEach(b=>b.addEventListener('click',()=>filterNews(b.dataset.newsCategory)));
 document.querySelector('[data-news-reset]').addEventListener('click',()=>{filterNews('all');buttons[0].focus()});
 filterNews(new URLSearchParams(location.search).get('category')||'all',false);
 window.addEventListener('popstate',()=>filterNews(new URLSearchParams(location.search).get('category')||'all',false));
}
// Full-screen product transitions: native scroll remains available, no wheel capture.
if(document.querySelector('.product-stages')){
 const sections=[...document.querySelectorAll('.product-stage')];
 const dots=[...document.querySelectorAll('.stage-pagination a')];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let animation=0;
 function cancelStageScroll(){cancelAnimationFrame(animation);animation=0}
 for(const event of ['wheel','touchstart','keydown'])window.addEventListener(event,cancelStageScroll,{passive:true});
 document.querySelectorAll('.product-stages a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const target=document.querySelector(link.hash);if(!target)return;
  event.preventDefault();cancelStageScroll();
  const from=scrollY,to=target.getBoundingClientRect().top+scrollY-document.querySelector('header').offsetHeight;
  if(reduced.matches){scrollTo({top:to,behavior:'instant'});return}
  const start=performance.now();
  function step(now){const t=Math.min((now-start)/650,1);scrollTo({top:from+(to-from)*(1-Math.pow(1-t,4)),behavior:'instant'});if(t<1)animation=requestAnimationFrame(step);else animation=0}
  animation=requestAnimationFrame(step);
 }));
 const stagesObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{
  entry.target.classList.toggle('stage-dimmed',entry.intersectionRatio<.18);
  if(entry.intersectionRatio>.5)dots.forEach(dot=>{if(dot.hash==='#'+entry.target.id)dot.setAttribute('aria-current','location');else dot.removeAttribute('aria-current')});
 })},{threshold:[0,.18,.5,.75]});sections.forEach(section=>stagesObserver.observe(section));
 const footerObserver=new IntersectionObserver(entries=>document.body.classList.toggle('home-footer-visible',entries[0].isIntersecting),{threshold:.1});footerObserver.observe(document.querySelector('footer'));
}
