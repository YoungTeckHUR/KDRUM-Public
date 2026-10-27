const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),docs=path.join(root,'docs');
const data=require('../../docs/assets/site-content.json');assert.equal(data.items.length,46);assert.equal(new Set(data.items.map(i=>i.id)).size,46);
require('./capability-contract.cjs').validate(data);
const generator=fs.readFileSync(path.join(root,'.github/scripts/navigation-layout.cjs'),'utf8');
const detailTemplate=generator.slice(generator.indexOf('function capability('),generator.indexOf('function sections('));
assert.ok(!/domain\[|d\[lang\]|d\.diagram/.test(detailTemplate),'No group fallback in capability rendering');
assert.ok(detailTemplate.includes("item['detail'+suffix]"),'Individual detail field rendered');
require('./capability-guidance.cjs').validate(data);
// Immutable feature identity and current approved state are deliberately separate.
const identity=require('../../docs/assets/capability-identity.json');
assert.deepEqual(data.items.map(i=>i.id).sort(),Object.keys(identity).sort());
for(const now of data.items){for(const key of ['kind','v'])assert.equal(now[key],identity[now.id][key],now.id+' '+key);}
assert.equal(data.items.find(i=>i.id==='estuary').g,'transport');
assert.equal(data.items.find(i=>i.id==='river-viewer').s,'SEPARATE DEVELOPMENT');
for(const rel of ['index.html','ko/index.html','media.html','seo-kdrum.html']){const html=fs.readFileSync(path.join(docs,rel),'utf8');assert.equal((html.match(/rel="canonical"/g)||[]).length,1,rel);assert.equal((html.match(/<h1>/g)||[]).length,1,rel);assert.ok(!/experience-v[234]|brand-runtime|tech-description-runtime/.test(html),'No legacy runtime chain');
 for(const match of html.matchAll(/\b(?:href|src)="([^"#]+)"/g)){const value=match[1];if(/^(?:https?:|data:|mailto:|\?)/.test(value))continue;let target=path.resolve(path.dirname(path.join(docs,rel)),value.split(/[?#]/)[0]);assert.ok(target.startsWith(docs+path.sep)||target===docs,value);if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');assert.ok(fs.existsSync(target),rel+' '+value);}
}
const js=fs.readFileSync(path.join(docs,'assets/site.js'),'utf8');assert.ok(!/MutationObserver|setInterval|setTimeout/.test(js));
assert.equal(fs.readdirSync(path.join(docs,'assets/diagrams')).filter(n=>n.endsWith('.svg')).length,12);
require('./current-content.cjs').validate(data);
assert.ok(fs.readFileSync(path.join(root,'DEVELOPMENT_STATUS.md'),'utf8').includes('2026-10-28'));
require('./current-content-audit.cjs');
console.log('PASS static routes, local assets, stable capability IDs/statuses, reviewed public labels/groups, bilingual descriptions, separate unpublished viewer, 46 entries, 12 diagrams, one runtime');
