'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const read=p=>fs.readFileSync(p,'utf8'),git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim();
const baseline='40ded09b5cc7217153626fff156b652dcffebfdd';
assert.equal(git('rev-parse','HEAD^'),baseline,'Review branch must start at the approved homepage');
const cssPath='docs/assets/site.css',css=read(cssPath);
assert.equal(git('hash-object',cssPath),'3f568b504a147595609ba49b1c67e298cdd57fc0','Exact approved stylesheet');
const publicBefore=git('ls-files','docs').split('\n').filter(p=>p!==cssPath).map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')]);
fs.mkdirSync('.github/fixtures',{recursive:true});fs.writeFileSync('.github/fixtures/typography-before-40ded09.css',css);
const addition=`

/* Typography refinements: retain the approved layout, content and image sizing. */
.capability summary p,.cap-detail p,.cap-detail li,.program p,.story p:not(.citation){font-size:1rem;line-height:1.7}
.capability summary h3{font-size:1.125rem;line-height:1.45}
.cap-detail h4{font-size:1rem;line-height:1.5}
.badge{font-size:.8125rem}
.hero-image figcaption,.story .citation,.site-footer p{font-size:.875rem;line-height:1.6}
.concept-card .media-body p{font-size:.9375rem;line-height:1.6}
.concept-links a{font-size:.875rem}
.capability-grid{align-items:stretch}
.capability:not([open])>summary{height:100%}
.concept-card{display:flex;flex-direction:column}
.concept-card .media-body{display:flex;flex-direction:column;flex:1;min-width:0}
.concept-card .concept-links{margin-top:auto;padding-top:8px}
.cap-detail>.resource-links{margin-top:24px}
.cap-detail .note .resource-links{margin-top:12px}
:lang(ko) :is(.section-heading h2,.section-heading p,.intro-block h3,.intro-block p,.capability h3,.cap-detail p,.cap-detail li,.program h3,.program p,.story h3,.story p,.concept-card h3,.concept-card p){word-break:keep-all;overflow-wrap:anywhere}
`;
fs.writeFileSync(cssPath,css+addition);
const density='.github/scripts/layout-density-audit.cjs';let d=read(density);
const old="const [min,max]=width<=700?[15.5,16.1]:[14,15.3];";assert.equal(d.split(old).length,2);
d=d.replace(old,"// Current readability target: 16px card body at desktop and mobile widths.\n   const [min,max]=[15.5,16.1];");fs.writeFileSync(density,d);
const audit='.github/scripts/homepage-readability-audit.cjs';let a=read(audit);
const hook=".then(()=>require('./capability-navigation-audit.cjs').run())";assert.equal(a.split(hook).length,2);
a=a.replace(hook,hook+".then(()=>require('./typography-balance-audit.cjs').run())");fs.writeFileSync(audit,a);
for(const [p,hash] of publicBefore)assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),hash,'Protected public file '+p);
assert.ok(read(cssPath).startsWith(css),'Original CSS preserved verbatim');
const beforeBuild=git('diff','--','docs/index.html','docs/ko/index.html','docs/media.html','docs/seo-kdrum.html');assert.equal(beforeBuild,'');
execFileSync('node',['.github/scripts/build-site.cjs'],{stdio:'inherit'});
assert.equal(git('diff','--','docs/index.html','docs/ko/index.html','docs/media.html','docs/seo-kdrum.html'),'','Static pages remain reproducible');
fs.mkdirSync('.github/notes',{recursive:true});
fs.writeFileSync('.github/notes/TYPOGRAPHY_BALANCE_20260919.md',`# Typography and card balance — 2026-09-19\n\nBaseline: ${baseline}.\n\n## Rationale\nThe approved site had 14.88px capability summaries, 15.2px detail text, 15.04px program text, 12px maturity labels and uneven closed-card/link alignment. This pass changes presentation only.\n\n## Change\nUse 16px body text in feature details, summaries, programs and research; 18px capability names and 16px detail headings; 13px maturity labels; 14px small captions and concept links; 15px thumbnail descriptions. Improve Korean phrase wrapping, equal-height closed-card rows and bottom-aligned concept links without fixed maximum heights. Reduce excess space before links inside the four supplementary notes.\n\n## Preserved\nAll public files except the appended stylesheet are byte-identical to baseline: 46 capability records, HTML, JavaScript/search/share behavior, images, PDF/video/QR, SEO and disabled analytics. Hero/section title sizing, page width, image sizing, main/2x2 layout and colors are unchanged. No new images, redesign, external fonts or dependencies.\n\n## Verification\nThe new audit compares the exact baseline CSS with the candidate on the same pages at seven widths in both languages, checks unchanged content/headings, measured font sizes, closed-card and concept-link alignment, reflow/clipping and two no-JavaScript cases. Existing 184 feature checks, 14 navigation cases, media and live checks remain enabled. The old density audit now explicitly expects 16px card body; its remaining bounds and baseline are unchanged. Final CI/live outcomes are recorded in the PR, not on the public website.\n\n## Rollback\nRevert the final PR with a new commit. Never reset history. One-time preparation files are removed before merge.\n`);
console.log('PREPARATION PASS: only public stylesheet changes; exact baseline CSS, all other public bytes and reproducible HTML preserved.');
