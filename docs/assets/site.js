/* Progressive enhancement: content, links and native details work without JS. */
(()=>{'use strict';
 const ko=document.documentElement.lang==='ko';
 const group=document.getElementById('feature-group'),query=document.getElementById('feature-search');
 const cards=[...document.querySelectorAll('.capability')];
 const normalize=s=>String(s||'').normalize('NFKC').toLocaleLowerCase().replace(/[\u2010-\u2015\u2212·_-]/g,' ').replace(/\s+/g,' ').trim();
 const searchable=cards.map(card=>{const prose=[...card.querySelectorAll('h3,summary p,.detail-overview,ol,.detail-status p,.note p')].map(n=>n.textContent).join(' ');const text=normalize(prose+' '+(card.dataset.searchTerms||''));return {card,text,compact:text.replace(/\s/g,'')};});
 const languageLinks=cards.length?[...document.querySelectorAll('.language a')].map(a=>({a,base:new URL(a.getAttribute('href'),document.baseURI)})):[];
 function updateLanguageLinks(id){const valid=id&&document.getElementById(id);languageLinks.forEach(({a,base})=>{const url=new URL(base.href);url.hash=valid?id:'';a.href=url.href;});}
 const filter=()=>{if(!group||!query)return;let count=0;const terms=normalize(query.value).split(' ').filter(Boolean);searchable.forEach(({card,text,compact})=>{const show=(!group.value||card.dataset.group===group.value)&&terms.every(term=>text.includes(term)||compact.includes(term));card.hidden=!show;if(show)count++;});document.getElementById('feature-count').textContent=ko?count+' / '+cards.length+'개 항목':count+' of '+cards.length+' entries';document.getElementById('no-results').hidden=count>0;};
 if(group&&query){
  document.getElementById('feature-filters').hidden=false;
  document.getElementById('feature-search-help').hidden=false;
  const reset=document.getElementById('feature-reset');reset.hidden=false;
  [...group.options].forEach(option=>{const count=option.value?cards.filter(c=>c.dataset.group===option.value).length:cards.length;option.textContent+=' ('+count+')';});
  group.value='forcing';
  group.addEventListener('change',()=>{filter();updateLanguageLinks('capabilities');});
  let composing=false;
  const searchAll=()=>{if(composing)return;if(query.value.trim())group.value='';filter();updateLanguageLinks('capabilities');};
  query.addEventListener('compositionstart',()=>{composing=true;});
  query.addEventListener('compositionend',()=>{composing=false;searchAll();});
  query.addEventListener('input',event=>{if(!event.isComposing)searchAll();});
  reset.addEventListener('click',()=>{composing=false;query.value='';group.value='';filter();updateLanguageLinks('capabilities');query.focus({preventScroll:true});});
  filter();
 }
 const aliases={architecture:'overview',features:'capabilities',functions:'capabilities',platform:'programs',references:'research',main:'overview'};
 function hashTarget(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return null;}return id?document.getElementById(aliases[id]||id):null;}
 function revealHash(focus=false){const target=hashTarget();if(target?.matches('.capability')){group.value='';query.value='';filter();target.open=true;if(focus)target.querySelector('summary').focus({preventScroll:true});}if(target){updateLanguageLinks(target.id);target.scrollIntoView({block:'start'});}}
 addEventListener('hashchange',()=>revealHash());
 cards.forEach(card=>card.addEventListener('toggle',()=>{if(card.open&&!card.hidden)updateLanguageLinks(card.id);}));
 async function shareFeature(a){
  const card=a.closest('.capability'),status=card.querySelector('.feature-share-status');
  const url=new URL(location.href);url.search='';url.hash=card.id;
  history.replaceState(history.state,'',url.pathname+url.hash);updateLanguageLinks(card.id);
  status.textContent='';
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(url.href);status.textContent=ko?'링크를 복사했습니다.':'Link copied.';}
  catch{status.textContent=ko?'주소창의 링크를 복사해 주세요.':'Copy the link from the address bar.';}
 }
 document.querySelectorAll('[data-share-feature]').forEach(a=>{a.textContent=ko?'기능 링크 복사':'Copy feature link';a.setAttribute('aria-label',(ko?'기능 링크 복사: ':'Copy feature link: ')+a.closest('.capability').querySelector('h3').textContent);});
 document.addEventListener('click',event=>{
  const a=event.target.closest('a');if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
  if(a.hasAttribute('data-share-feature')){event.preventDefault();void shareFeature(a);return;}
  const href=a.getAttribute('href')||'';if(!href.startsWith('#cap-'))return;
  const target=document.getElementById(href.slice(1));if(!target?.matches('.capability'))return;
  event.preventDefault();if(location.hash!==href)location.hash=href;revealHash(true);
 });
 if(location.hash)revealHash();
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
