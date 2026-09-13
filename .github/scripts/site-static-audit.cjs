const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),docs=path.join(root,'docs');
const data=require('../../docs/assets/site-content.json');assert.equal(data.items.length,46);assert.equal(new Set(data.items.map(i=>i.id)).size,46);
const baseline=fs.readFileSync(path.join(docs,'assets/capability-atlas.js'),'utf8');
const vm=require('node:vm');const old=vm.runInNewContext(baseline.slice(baseline.indexOf('  const groups='),baseline.indexOf('  const css='))+';items');
for(const item of old){const now=data.items.find(i=>i.id===item.id);assert.ok(now,item.id);for(const key of ['s','sumKo','sumEn','nowKo','nowEn'])assert.equal(now[key],item[key],item.id+' '+key);}
for(const rel of ['index.html','ko/index.html','media.html','seo-kdrum.html']){const html=fs.readFileSync(path.join(docs,rel),'utf8');assert.equal((html.match(/rel="canonical"/g)||[]).length,1,rel);assert.equal((html.match(/<h1>/g)||[]).length,1,rel);assert.ok(!/experience-v[234]|brand-runtime|tech-description-runtime/.test(html),'No legacy runtime chain');
 for(const match of html.matchAll(/\b(?:href|src)="([^"#]+)"/g)){const value=match[1];if(/^(?:https?:|data:|mailto:|\?)/.test(value))continue;let target=path.resolve(path.dirname(path.join(docs,rel)),value.split(/[?#]/)[0]);assert.ok(target.startsWith(docs+path.sep)||target===docs,value);if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');assert.ok(fs.existsSync(target),rel+' '+value);}
}
const js=fs.readFileSync(path.join(docs,'assets/site.js'),'utf8');assert.ok(!/MutationObserver|setInterval|setTimeout/.test(js));
assert.equal(fs.readdirSync(path.join(docs,'assets/diagrams')).filter(n=>n.endsWith('.svg')).length,12);
assert.ok(fs.readFileSync(path.join(root,'DEVELOPMENT_STATUS.md'),'utf8').includes('Status reviewed: 2026-08-21'));
console.log('PASS static routes, local assets, original 45 capability statuses/copy, 46 entries, 12 diagrams, one runtime');
