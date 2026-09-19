'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process'),crypto=require('node:crypto');
const base='6531b06180fc39fed6a55a22a9ee139de1463bbf';
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
function replaceOne(s,a,b){assert.equal(s.split(a).length,2,'Expected exactly one edit target: '+a.slice(0,100));return s.replace(a,b);}
const originalData=read('docs/assets/site-content.json');
const protectedFiles=['docs/media.html','docs/seo-kdrum.html','docs/assets/analytics-config.js','.github/scripts/reading-experience.cjs'];
const originals=Object.fromEntries(protectedFiles.map(p=>[p,read(p)]));
const oldPages=Object.fromEntries(['docs/index.html','docs/ko/index.html'].map(p=>[p,read(p)]));
let build=read('.github/scripts/build-site.cjs');
build=replaceOne(build,'data-feature="${it.id}"','data-feature="${it.id}" data-search-terms="${esc(it.ko+\' \'+it.en+\' \'+it.id)}"');
build=replaceOne(build,'>관련 개념도 보기 →</a>',">${t(lang,'관련 개념도 보기','View related diagram')} →</a>");
build=replaceOne(build,'id="feature-search" placeholder=','id="feature-search" aria-describedby="feature-search-help" placeholder=');
build=replaceOne(build,'<p id="feature-count"',"<p id=\"feature-search-help\" class=\"feature-search-help\" hidden>${L('검색어를 입력하면 전체 분야에서 찾습니다. 한글·영문 모두 검색할 수 있습니다.','Typing searches all categories. Korean and English terms are supported.')}</p><div class=\"feature-search-status\"><p id=\"feature-count\"");
build=replaceOne(build,'</p><div class="capability-grid">',"</p><button type=\"button\" id=\"feature-reset\" class=\"feature-link-button\" hidden>${L('전체 기능 보기','Show all capabilities')}</button></div><div class=\"capability-grid\">");
build=replaceOne(build,'</div></div></details>',"<a class=\"feature-share\" href=\"#cap-${it.id}\" data-share-feature=\"${it.id}\">${t(lang,'이 기능 링크','Link to this capability')}</a><span class=\"feature-share-status\" role=\"status\"></span></div></div></details>");
write('.github/scripts/build-site.cjs',build);
const runtime=String.raw` const group=document.getElementById('feature-group'),query=document.getElementById('feature-search');
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
`;
let js=read('docs/assets/site.js');const start=js.indexOf(' const group='),end=js.indexOf(' const dialog=');assert.ok(start>0&&end>start);const preservedTail=js.slice(end);js=js.slice(0,start)+runtime+preservedTail;write('docs/assets/site.js',js);
const css=String.raw`
/* Capability navigation, scoped to existing search and detail controls. */
.feature-search-help{font-size:.875rem;color:var(--muted);margin:0 0 10px;line-height:1.55}
.feature-search-status{display:flex;align-items:center;justify-content:space-between;gap:8px 16px;flex-wrap:wrap;margin-bottom:24px}
.feature-search-status .result-count{margin:0}
.feature-link-button{font:inherit;font-size:.875rem;color:var(--blue);background:none;border:0;padding:6px 0;min-height:44px;text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.feature-share-status{align-self:center;font-size:.875rem;color:var(--muted)}
.feature-share-status:empty{display:none}
`;
write('docs/assets/site.css',read('docs/assets/site.css')+css);
let audit=read('.github/scripts/homepage-readability-audit.cjs');audit=replaceOne(audit,'})().catch(e=>{',"})().then(()=>require('./capability-navigation-audit.cjs').run()).catch(e=>{");write('.github/scripts/homepage-readability-audit.cjs',audit);
cp.execFileSync('node',['.github/scripts/build-site.cjs'],{stdio:'inherit'});
assert.equal(read('docs/assets/site-content.json'),originalData,'All 46 primary and supplementary descriptions unchanged');
for(const [p,s] of Object.entries(originals))assert.equal(read(p),s,'Protected file '+p);
const section=(s,id)=>{const marker='id="'+id+'"';const at=s.indexOf(marker);assert.ok(at>=0);return s.slice(s.lastIndexOf('<section',at),s.indexOf('</section>',at)+10);};
for(const [p,old] of Object.entries(oldPages)){const current=read(p);for(const id of ['overview','grid-hydrology-concepts','results','programs','research','download'])assert.equal(section(current,id),section(old,id),'Unchanged '+p+' '+id);assert.equal((current.match(/data-share-feature=/g)||[]).length,46);}
const first=Object.fromEntries(Object.keys(oldPages).map(p=>[p,read(p)]));cp.execFileSync('node',['.github/scripts/build-site.cjs'],{stdio:'inherit'});for(const [p,s]of Object.entries(first))assert.equal(read(p),s,'Deterministic build '+p);
const baselineAssetTree=cp.execFileSync('git',['ls-tree','-r',base,'docs/assets','docs/media'],{encoding:'utf8'}).trim().split('\n').filter(x=>!/docs\/assets\/site\.(css|js)$/.test(x));for(const entry of baselineAssetTree){const [meta,p]=entry.split('\t');const sha=meta.split(' ')[2];const bytes=fs.readFileSync(p);const actual=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');assert.equal(actual,sha,'Protected asset '+p);}
fs.mkdirSync('navigation-evidence',{recursive:true});write('navigation-evidence/preservation.json',JSON.stringify({baseline:base,capabilities:46,contentUnchanged:true,protectedSections:12,assetFilesChecked:baselineAssetTree.length,mediaAndAnalyticsUnchanged:true,deterministicBuild:true},null,2));
console.log('NAVIGATION PREPARATION PASS: preserved content, sections, assets, media and analytics; deterministic build.');
