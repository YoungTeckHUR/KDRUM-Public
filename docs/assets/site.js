/* Static documents remain readable without JavaScript; enhance navigation and image dialogs. */
(()=>{'use strict';
 const ko=document.documentElement.lang==='ko';
 const cards=[...document.querySelectorAll('.capability')];
 const workspace=document.body.dataset.navigationLayout==='workspace';
 const normalize=s=>String(s||'').normalize('NFKC').toLocaleLowerCase().replace(/[\u2010-\u2015\u2212·_-]/g,' ').replace(/\s+/g,' ').trim();
 const languageLinks=workspace?[...document.querySelectorAll('.language a')].map(a=>({a,base:new URL(a.getAttribute('href'),document.baseURI)})):[];
 function updateLanguageLinks(id){languageLinks.forEach(({a,base})=>{const url=new URL(base.href);url.hash=id==='home'?'':id;a.href=url.href;});}
 const aliases={architecture:'overview',features:'capabilities',functions:'capabilities',platform:'programs',references:'research',main:'home'};
 const query=document.getElementById('feature-search'),menu=document.querySelector('.workspace-menu');
 const groups=[...document.querySelectorAll('.feature-group')],links=[...document.querySelectorAll('[data-feature-link]')];
 const searchable=new Map(cards.map(card=>[card.dataset.feature,normalize(card.textContent+' '+card.dataset.searchTerms)]));
 let activeFeature='ga',composing=false;
 function filter(){
  const terms=normalize(query.value).split(' ').filter(Boolean);let count=0;
  links.forEach(link=>{const text=searchable.get(link.dataset.featureLink),compact=text.replace(/\s/g,'');link.hidden=!terms.every(term=>text.includes(term)||compact.includes(term));if(!link.hidden)count++;});
  groups.forEach(group=>{group.hidden=![...group.querySelectorAll('[data-feature-link]')].some(a=>!a.hidden);group.open=terms.length?!group.hidden:group.dataset.group===document.getElementById('cap-'+activeFeature)?.dataset.group;});
  document.getElementById('feature-count').textContent=terms.length?(ko?count+'개 기능 검색됨':count+' matching capabilities'):'';
  document.getElementById('feature-reset').hidden=!query.value;
  document.getElementById('no-results').hidden=count>0;
 }
 function route(focus=false){
  let id;try{id=decodeURIComponent(location.hash.slice(1))||'home';}catch{id='home';}
  id=aliases[id]||id;
  let target=document.getElementById(id),page='home',view=null,feature=null;
  if(id==='capabilities'){id='cap-'+activeFeature;target=document.getElementById(id);}
  if(target?.matches('.capability')){feature=target;activeFeature=target.dataset.feature;page='model';view=document.getElementById('capabilities');}
  else if(target?.closest('[data-model-view]')){page='model';view=target.closest('[data-model-view]');}
  else if(['programs','research','download'].includes(id))page=id;
  else{id='home';target=document.getElementById('home');}
  document.querySelectorAll('[data-workspace-page]').forEach(el=>el.hidden=el.dataset.workspacePage!==page);
  if(page!=='home')document.querySelectorAll('.home-introduction video').forEach(video=>video.pause());
  document.querySelectorAll('[data-model-view]').forEach(el=>el.hidden=el!==view);
  cards.forEach(card=>{card.hidden=card!==feature;card.open=card===feature;});
  if(feature){query.value='';filter();links.forEach(a=>{if(a.dataset.featureLink===activeFeature)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
  document.querySelectorAll('[data-page-link]').forEach(a=>{if(a.dataset.pageLink===(page==='model'?'capabilities':page))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelector('.model-overview-link').toggleAttribute('data-current',id==='overview');
  if(matchMedia('(max-width:800px)').matches)menu.open=false;
  updateLanguageLinks(id);
  if(focus){const heading=feature?.querySelector('h3')||target?.querySelector('h1,h2,h3')||target;heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});document.getElementById('main').scrollIntoView({block:'start',behavior:'instant'});if(id.startsWith('concept-'))target.scrollIntoView({block:'start',behavior:'instant'});}
 }
 if(workspace){
  document.documentElement.classList.add('workspace-ready');document.querySelector('.workspace-search').hidden=false;
  query.addEventListener('compositionstart',()=>composing=true);
  query.addEventListener('compositionend',()=>{composing=false;filter();});
  query.addEventListener('input',event=>{if(!composing&&!event.isComposing)filter();});
  document.getElementById('feature-reset').addEventListener('click',()=>{query.value='';composing=false;filter();query.focus();});
  groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open&&!query.value)groups.forEach(other=>{if(other!==group)other.open=false;});}));
  menu.open=!matchMedia('(max-width:800px)').matches;
  matchMedia('(max-width:800px)').addEventListener('change',event=>menu.open=!event.matches);
  cards.forEach(card=>card.querySelector(':scope>summary').addEventListener('click',event=>event.preventDefault()));
  addEventListener('hashchange',()=>route(true));filter();route(Boolean(location.hash));
 }
 async function shareFeature(a){
  const card=a.closest('.capability'),status=card.querySelector('.feature-share-status');
  const url=new URL(location.href);url.search='';url.hash=card.id;
  history.replaceState(history.state,'',url.pathname+url.hash);updateLanguageLinks(card.id);status.textContent='';
  try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(url.href);status.textContent=ko?'링크를 복사했습니다.':'Link copied.';}
  catch{status.textContent=ko?'주소창의 링크를 복사해 주세요.':'Copy the link from the address bar.';}
 }
 document.querySelectorAll('[data-share-feature]').forEach(a=>{a.textContent=ko?'기능 링크 복사':'Copy feature link';a.setAttribute('aria-label',a.textContent+': '+a.closest('.capability').querySelector('h3').textContent);});
 document.addEventListener('click',event=>{
  const a=event.target.closest('a');if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
  if(workspace&&a.classList.contains('skip')){event.preventDefault();const main=document.getElementById('main');main.setAttribute('tabindex','-1');main.focus();return;}
  if(a.hasAttribute('data-share-feature')){event.preventDefault();void shareFeature(a);return;}
  const href=a.getAttribute('href')||'';if(!workspace||!href.startsWith('#')||!document.getElementById(href.slice(1)))return;
  event.preventDefault();if(location.hash!==href)location.hash=href;else route(true);
 });
 const dialog=document.getElementById('image-viewer');let lastFocus;
 if(dialog){const zoom=dialog.querySelector('input');const img=dialog.querySelector('img');zoom.addEventListener('input',()=>{img.style.width=Number(zoom.value)*100+'%';});document.addEventListener('click',event=>{const a=event.target.closest('a[data-enlarge]');if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();lastFocus=a;img.src=a.href;img.alt=a.dataset.caption||a.textContent.trim();zoom.value='1';img.style.width='100%';document.getElementById('image-caption').textContent=img.alt;dialog.showModal();dialog.querySelector('button').focus();});dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>lastFocus?.focus());}
 // The bilingual media document has a complete static Korean default.
 const media=document.querySelector('[data-media-page]');
 if(media){const lang=new URLSearchParams(location.search).get('lang')==='en'?'en':'ko';document.documentElement.lang=lang;document.querySelectorAll('[data-language]').forEach(el=>{el.hidden=el.dataset.language!==lang;});document.querySelectorAll('[data-media-lang]').forEach(a=>{if(a.dataset.mediaLang===lang)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});document.querySelectorAll('[data-media-home]').forEach(a=>{a.href=lang==='ko'?'ko/':'./';});if(dialog){dialog.querySelector('.dialog-head>strong').textContent=lang==='ko'?'그림 확대':'Image detail';dialog.querySelector('.zoom-control span').textContent=lang==='ko'?'배율':'Zoom';dialog.querySelector('input').setAttribute('aria-label',lang==='ko'?'그림 확대 배율':'Image zoom level');dialog.querySelector('button').setAttribute('aria-label',lang==='ko'?'닫기':'Close');dialog.querySelector('.image-pan').setAttribute('aria-label',lang==='ko'?'확대 그림, 방향키로 이동':'Enlarged image, scroll with arrow keys');}
  const patchCard=(file,koBadge,enBadge)=>{document.querySelectorAll(`a[href$="/${file}"]`).forEach(a=>{const card=a.closest('.media-card');if(!card)return;const cardLang=card.closest('[data-language]')?.dataset.language||lang;const badge=card.querySelector('.badge');const title=card.querySelector('h3')?.textContent.trim()||'';const label=cardLang==='ko'?koBadge:enBadge;if(badge)badge.textContent=label;if(a.hasAttribute('data-caption'))a.dataset.caption=`${title} · ${label}`;card.querySelectorAll('a[data-enlarge]').forEach(link=>{link.dataset.caption=`${title} · ${label}`;});});};
  patchCard('02_water_cycle.jpg','Core 확립 · D-layer 개발 중','Established Core · D-layer in development');
  patchCard('07_continuous_hydrology.jpg','Core 확립 · D-layer 개발 중','Established Core · D-layer in development');
  document.querySelectorAll('a[href$="/04_end_to_end_workflow.jpg"]').forEach(a=>{const card=a.closest('.media-card');if(!card||card.querySelector('[data-water-quality-note]'))return;const cardLang=card.closest('[data-language]')?.dataset.language||lang;const note=document.createElement('p');note.dataset.waterQualityNote='true';note.className='media-status-note';note.textContent=cardLang==='ko'?'수질 출력은 그림에 포함된 확장 개념이며, 현재 공개 버전에서는 비활성·재개발 후보입니다.':'Water-quality output is an illustrated extension concept; it is disabled in the current public version and remains a redevelopment candidate.';card.querySelector('.media-body')?.append(note);});
  document.title=lang==='ko'?'K-DRUM 시각자료 | p18 공개 갤러리':'K-DRUM Visual Guide | p18 publication gallery';}
 // Optional analytics bootstrap. Existing site behavior is unchanged when analytics is disabled.
 const self=document.currentScript;
 if(self?.src){
  const base=new URL('.',self.src);
  const config=document.createElement('script');
  config.src=new URL('analytics-config.js',base).href;
  config.addEventListener('load',()=>{const analytics=document.createElement('script');analytics.src=new URL('analytics.js',base).href;analytics.defer=true;document.head.append(analytics);});
  document.head.append(config);
 }
 document.documentElement.dataset.siteReady='true';
})();
