/* One-time, branch-only preparation. Removed before the review PR is opened. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');process.chdir(root);
const BASE='2d0d2dcdfa3f3dfdddc8ed7eb60104b1e83df8dd';
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
const original=p=>execFileSync('git',['show',BASE+':'+p],{encoding:'utf8'});
const replaceOnce=(s,from,to)=>{assert.equal(s.split(from).length-1,1,'Unique marker: '+from);return s.replace(from,to);};
for(const p of ['.github/scripts/build-site.cjs','docs/assets/site-content.json','docs/assets/site.css','docs/ko/index.html','docs/index.html']) assert.equal(read(p),original(p),'Baseline changed: '+p);

let build=read('.github/scripts/build-site.cjs');
build=replaceOnce(build,"const origin='https://youngteckhur.github.io/KDRUM-Public/';","const reading=require('./reading-experience.cjs');\nconst origin='https://youngteckhur.github.io/KDRUM-Public/';");
const lines=build.split('\n');
const overview=lines.findIndex(l=>l.startsWith(' html+=`<section class="section" id="overview">'));
assert(overview>=0);const tail='</div></section>`;';assert(lines[overview].endsWith(tail));
lines[overview]=lines[overview].slice(0,-tail.length)+'${reading.quickLinks(lang)}'+tail;
const start=lines.findIndex(l=>l.includes("L('처음 방문자를 위한 빠른 안내','Quick guide for first-time visitors')"));
assert(start>=0 && lines[start].includes('START HERE'));lines[start]='';
const gallery=lines.findIndex(l=>l.startsWith(' if(ko) html+=`<section class="section" id="grid-hydrology-concepts">'));
assert(gallery>=0);lines[gallery]=' html+=reading.visualConcept(lang,pre);';
build=lines.join('\n');
build=replaceOnce(build,"lang==='ko'&&it.conceptAnchor?","it.conceptAnchor?");
build=replaceOnce(build,"${it.diagram?figure(it.diagram,lang,pre,get(it,'diagramCaption',lang)):''}","${it.diagram?reading.relatedFigure(it,lang,pre):''}");
write('.github/scripts/build-site.cjs',build);

const data=JSON.parse(read('docs/assets/site-content.json'));
const short={
 ga:{ko:'강우강도와 초기 토양수분·투수특성에 따라 침투량과 초과강우가 달라집니다. 침투한 물은 토양저류에, 초과강우는 지표유출에 반영됩니다.',en:'Rainfall intensity, initial soil water and hydraulic properties control infiltration and rainfall excess. Infiltrated water updates soil storage; excess water contributes to surface runoff.'},
 runoff:{ko:'지표 흐름과 토양층 흐름은 경사·저류상태에 따라 서로 다른 속도로 하류에 전달됩니다. 유출 생성과 이후의 하도 추적은 구분하여 해석합니다.',en:'Surface and soil-layer pathways convey water downstream at different rates, depending on slope and storage. Runoff generation is distinct from subsequent channel routing.'},
 et:{ko:'토지피복·식생·계절별 LAI와 토양수분 상태에 따라 증발산과 후속 유출응답이 달라집니다.',en:'Land cover, vegetation, seasonal LAI and soil-water conditions influence evapotranspiration and subsequent runoff response.'},
 dlayer:{ko:'심부에 저장된 물의 느린 방출로 감수부와 저유량을 표현하는 개발 기능입니다. 전체 지하수 유동장을 해석하는 지하수모형과는 구분됩니다.',en:'This development extension represents recession and low flows through slow release from deeper storage. It is distinct from a model resolving the full groundwater-flow field.'}
};
const lengthChanges=[];
for(const item of data.items){if(!short[item.id])continue;for(const [lang,suffix] of [['ko','Ko'],['en','En']]){const key='more'+suffix,before=item[key];assert(before);const after=short[item.id][lang];assert(after.length<before.length);item[key]=after;lengthChanges.push({id:item.id,language:lang,before:before.length,after:after.length});}}
write('docs/assets/site-content.json',JSON.stringify(data,null,2)+'\n');

const css=`
/* Scoped reading-layout refinements; existing sections and media styles are unchanged. */
.quick-entry{margin-top:28px;padding:18px 0 0;border-top:1px solid var(--line);display:flex;align-items:center;gap:16px 24px;flex-wrap:wrap}
.quick-entry h3{font-size:1rem;line-height:1.5;letter-spacing:0}
.quick-entry-links{display:flex;gap:8px;flex-wrap:wrap;min-width:0}
.quick-entry-links a{display:inline-flex;align-items:center;gap:12px;min-height:44px;padding:8px 14px;border:1px solid var(--line);border-radius:6px;text-decoration:none;font-size:.875rem;font-weight:650;background:var(--soft)}
#grid-hydrology-concepts .section-heading p{max-width:760px}
.concept-overview-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:24px;align-items:start}
.concept-overview-grid>*{min-width:0}
.concept-master.figure{margin:0}
.concept-master> a{display:block}
.concept-master img{width:100%;height:auto;aspect-ratio:16/9;object-fit:contain;background:#fff}
.concept-master figcaption{flex-wrap:wrap;gap:8px 14px;margin-top:10px}
.concept-master figcaption a{min-height:44px;display:inline-flex;align-items:center}
.concept-thumbnail-grid.gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.concept-card .media-body{padding:12px}
.concept-card .media-body h3{font-size:1rem;line-height:1.45;letter-spacing:-.025em;overflow-wrap:break-word}
.concept-card .media-body p{font-size:.875rem;line-height:1.55;margin-top:6px}
.concept-links{display:flex;flex-wrap:wrap;gap:0 12px;margin-top:6px}
.concept-links a{display:inline-flex;align-items:center;min-height:44px;font-size:.8rem;font-weight:650}
.cap-detail .figure-reference{margin-top:14px}
.figure-reference figcaption{margin-top:0;align-items:center}
.figure-reference figcaption a{min-height:44px;display:inline-flex;align-items:center}
@media(max-width:1000px){.concept-overview-grid{grid-template-columns:1fr}.concept-master{width:100%;max-width:620px;margin-inline:auto!important}}
@media(max-width:700px){.quick-entry{display:block}.quick-entry-links{margin-top:10px}.concept-thumbnail-grid.gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.concept-card .media-body{padding:10px}.concept-card .media-body p{font-size:.9rem}.concept-links a{font-size:.875rem}.figure-reference figcaption{display:block}}
`;
write('docs/assets/site.css',read('docs/assets/site.css')+css);

// Verify linked diagrams as thoroughly as inline diagrams, without repeating images.
let detailAudit=read('.github/scripts/capability-detail-audit.cjs');
detailAudit=replaceOnce(detailAudit,"    const img=card.locator('.figure img');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());\n    assert.ok((await img.getAttribute('src')).endsWith(`/diagrams/${item.diagram}-${lang}.svg`));", "    const shared=card.locator('.figure[data-shared-diagram]');\n    assert.equal(await shared.getAttribute('data-shared-diagram'),item.diagram);\n    assert.equal(await shared.locator('img').count(),0,'Shared diagram is not duplicated inline');\n    const img=page.locator(`img[src$=\"/diagrams/${item.diagram}-${lang}.svg\"]`);\n    assert.equal(await img.count(),1,'Exactly one representative diagram remains');\n    await img.evaluate(el=>el.decode());\n    assert.ok((await shared.locator('a[data-enlarge]').getAttribute('href')).endsWith(`/diagrams/${item.diagram}-${lang}.svg`));");
write('.github/scripts/capability-detail-audit.cjs',detailAudit);
let smoke=read('.github/workflows/homepage-browser-smoke.yml');
smoke=replaceOnce(smoke,'      - name: Run rendered browser checks','      - name: Verify compact layout, content preservation and image links\n        env:\n          BASE_URL: http://127.0.0.1:8000/KDRUM-Public\n          READABILITY_AUDIT_DIR: browser-artifacts/readability\n        run: node .github/scripts/homepage-readability-audit.cjs\n\n      - name: Run rendered browser checks');
write('.github/workflows/homepage-browser-smoke.yml',smoke);
let live=read('.github/workflows/homepage-live-pages.yml');
live=replaceOnce(live,'            node .github/scripts/homepage-v4-audit.cjs','            node .github/scripts/homepage-v4-audit.cjs\n          BASE_URL="$BASE" READABILITY_AUDIT_DIR=live-artifacts/readability \\\n            node .github/scripts/homepage-readability-audit.cjs');
write('.github/workflows/homepage-live-pages.yml',live);

execFileSync('node',['.github/scripts/build-site.cjs'],{stdio:'inherit'});
const once=['docs/index.html','docs/ko/index.html','docs/seo-kdrum.html'].map(p=>[p,read(p)]);
execFileSync('node',['.github/scripts/build-site.cjs'],{stdio:'inherit'});
for(const [p,s]of once) assert.equal(read(p),s,'Reproducible '+p);
assert.equal(read('docs/seo-kdrum.html'),original('docs/seo-kdrum.html'),'FAQ unchanged');
assert.equal(read('docs/media.html'),original('docs/media.html'),'Media unchanged');
const beforeData=JSON.parse(original('docs/assets/site-content.json'));
for(let i=0;i<data.items.length;i++){
 const before={...beforeData.items[i]},after={...data.items[i]};
 if(short[after.id]){delete before.moreKo;delete before.moreEn;delete after.moreKo;delete after.moreEn;}
 assert.deepEqual(after,before,'All core capability fields preserved: '+after.id);
}
for(const page of ['docs/index.html','docs/ko/index.html']){
 const before=original(page),after=read(page);
 for(const id of ['results','programs','research','download']){
  const pattern=new RegExp('<section[^>]*id="'+id+'"[\\s\\S]*?<\\/section>');
  assert.equal(after.match(pattern)?.[0],before.match(pattern)?.[0],id+' preserved');
 }
 assert(!after.includes('개념도 확장 원칙'));assert(!after.includes('/masters/'));
 for(const id of ['concept-ga','concept-et','concept-runoff','concept-dlayer']) assert(after.includes('id="'+id+'"'));
}
fs.mkdirSync('preparation-evidence',{recursive:true});
write('preparation-evidence/lengths.json',JSON.stringify(lengthChanges,null,2));
write('preparation-evidence/prepared.diff',execFileSync('git',['diff','--','.github/scripts/build-site.cjs','.github/scripts/capability-detail-audit.cjs','.github/workflows/homepage-browser-smoke.yml','.github/workflows/homepage-live-pages.yml','docs'],{encoding:'utf8'}));
write('READABILITY_REVIEW_20260919.md',`# Homepage readability refinement — 2026-09-19\n\nBase: \`${BASE}\`.\n\n## Scope\n\nCompact topic navigation inside Overview; original five grid-process images arranged as a representative image and a 2×2 thumbnail set; shorter bilingual supplementary notes in four capabilities; repeated diagrams changed to direct enlarge links; matching Korean/English visual-section structure with explicit Korean-image-label notice on the English page. No new Master A/B/C images.\n\n## Preserved\n\nAll 46 capability names, summaries, technical overviews, computation steps, maturity/status wording, diagram mappings and references. Hero, Results, Programs, Research, Download, FAQ, media page, SEO and original assets remain unchanged. Analytics remains disabled.\n\n## Verification\n\nPreparation asserts baseline identity, targeted-field preservation, unchanged protected sections and repeatable static builds. Browser CI additionally checks six widths, bilingual structure, all five enlarged images, keyboard dismissal/focus return, topic/deep links, shortened notes, no duplicated SVG images and no public production guidance. Live CI repeats the readability checks after deployed-file hash verification.\n\n## Supplement length changes\n\n${lengthChanges.map(x=>'- '+x.id+' ('+x.language+'): '+x.before+' → '+x.after+' characters').join('\n')}\n\n## Rollback\n\nRevert this PR without resetting branch history. The baseline above is the accepted restored homepage, not the rejected Master A/B/C redesign.\n`);
console.log('PREPARATION PASS: deterministic build, protected content and assets retained.',JSON.stringify(lengthChanges));
