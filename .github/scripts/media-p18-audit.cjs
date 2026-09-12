const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = (process.env.BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const output = process.env.AUDIT_DIR || 'media-p18-artifacts';
const manifest = require('../../docs/media/2026-09-12-p18/manifest.json');
const results = [];
fs.mkdirSync(output, {recursive:true});

(async () => {
  // Use the full browser for its PDF viewer and proprietary MP4 codecs.
  const browser = await chromium.launch({headless:true,channel:process.env.MEDIA_BROWSER_CHANNEL || 'chrome'});
  try {
    const request = await browser.newContext();
    const range = await request.request.get(`${base}/media/2026-09-12-p18/${manifest.video_web}`, {headers:{Range:'bytes=0-99'}});
    assert.equal(range.status(),206,'Preview server must support byte ranges for MP4 seeking');
    assert.match(range.headers()['content-range'],/^bytes 0-99\/\d+$/);
    assert.equal((await range.body()).length,100);
    await request.close();
    for (const lang of ['en','ko']) {
      for (const width of [1440,390]) {
        const name = `${lang}-${width}`;
        const context = await browser.newContext({viewport:{width,height:900}});
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
          if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
        });
        await page.goto(base + (lang === 'ko' ? '/ko/' : '/'));
        await page.waitForFunction(() => document.documentElement.dataset.kdrumExperienceV4Stable === 'ready');
        const guide = page.locator('.nav .media-guide-link');
        assert.equal(await guide.count(),1);
        assert.equal(await guide.innerText(),lang === 'ko' ? '시각자료' : 'Visual Guide');
        await guide.click();
        await page.waitForURL(`**/media.html?lang=${lang}`);
        assert.equal(await page.locator('html').getAttribute('lang'),lang);
        assert.equal(await page.locator('.card').count(),18);
        assert.equal(await page.locator('.card .status').count(),18);
        assert.ok((await page.locator('#videoText').innerText()).includes(lang === 'en' ? 'AI-generated concept visualization' : '모형 소개용 AI 개념영상'));
        assert.ok((await page.locator('#videoText').innerText()).includes(lang === 'en' ? 'not a direct K-DRUM numerical simulation result' : '실제 K-DRUM 수치모의 결과 영상은 아닙니다'));
        for (let i=0;i<18;i++) {
          const button = page.locator('.card button').nth(i);
          await button.scrollIntoViewIfNeeded();
          await page.waitForFunction(index => {
            const img = document.querySelectorAll('.thumb')[index];
            return img.complete && img.naturalWidth > 0;
          },i);
          assert.ok((await button.locator('img').getAttribute('src')).endsWith(manifest.feature_images[i]));
          await button.click();
          await page.waitForFunction(() => {
            const img = document.getElementById('viewerSlide');
            return document.getElementById('viewer').open && img.complete && img.naturalWidth > 0;
          });
          assert.ok((await page.locator('#viewerSlide').getAttribute('src')).endsWith(manifest.feature_images[i]));
          if(i===0) await page.screenshot({path:path.join(output,`${name}-enlarged.png`)});
          if(i%2===0) await page.keyboard.press('Escape');
          else await page.locator('#viewerClose').click();
          assert.equal(await page.locator('#viewer').evaluate(dialog=>dialog.open),false);
        }
        for (const resource of ['presentation_pdf','video_web','reference_image']) {
          const response = await context.request.get(`${base}/media/2026-09-12-p18/${manifest[resource]}`);
          assert.equal(response.status(),200);
          const bytes = await response.body();
          if(resource==='presentation_pdf') {
            assert.ok(response.headers()['content-type'].includes('application/pdf'));
            assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
            const local = fs.readFileSync(path.resolve(__dirname,'../../docs/media/2026-09-12-p18',manifest[resource]));
            assert.ok(bytes.equals(local));
          }
          if(resource==='video_web') assert.ok(response.headers()['content-type'].includes('video/mp4'));
          if(resource==='reference_image') assert.ok(response.headers()['content-type'].includes('image/png'));
        }
        // Exercise the actual PDF link, even in headless browsers without a PDF viewer.
        const [popup] = await Promise.all([context.waitForEvent('page'),page.locator('#pdfBtn').click()]);
        await popup.waitForURL('**/K-DRUM_v3.x_p18.pdf');
        await popup.close();
        await page.locator('video').scrollIntoViewIfNeeded();
        await page.locator('video').evaluate(async video => {video.muted=true; await video.play();});
        await page.waitForFunction(() => {
          const video = document.querySelector('video');
          return video.currentTime > 1 && video.readyState >= 2 && video.videoWidth > 0 && !video.error;
        });
        const playback = await page.locator('video').evaluate(video=>({duration:video.duration,width:video.videoWidth,height:video.videoHeight,frames:video.getVideoPlaybackQuality().totalVideoFrames,time:video.currentTime}));
        assert.ok(playback.frames>0);
        assert.ok(playback.duration>=20 && playback.duration<=24);
        await page.locator('video').evaluate(video=>{video.currentTime=video.duration-1;});
        await page.waitForFunction(()=>{
          const video=document.querySelector('video');
          return !video.seeking && video.currentTime >= video.duration-2;
        },null,{timeout:10000});
        await page.waitForFunction(()=>document.querySelector('video').ended,null,{timeout:15000});
        await page.locator('video').evaluate(video=>{video.currentTime=0;});
        const other = lang==='en'?'ko':'en';
        await page.locator(`[data-lang="${other}"]`).click();
        assert.equal(await page.locator('html').getAttribute('lang'),other);
        assert.ok(page.url().endsWith(`?lang=${other}`));
        await page.reload();
        assert.equal(await page.locator('html').getAttribute('lang'),other);
        await page.locator(`[data-lang="${lang}"]`).click();
        assert.equal(await page.locator('#homeLink').getAttribute('href'),lang==='ko'?'ko/':'./');
        const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth+1);
        assert.equal(overflow,false,`${name}: horizontal overflow`);
        await page.screenshot({path:path.join(output,`${name}-guide.png`),fullPage:true});
        await page.locator('#homeLink').click();
        await page.waitForFunction(() => document.documentElement.dataset.kdrumExperienceV4Stable === 'ready');
        const homeOther = page.locator('.language a').filter({hasText:lang==='en'?'한국어':'English'});
        await homeOther.click();
        await page.waitForFunction(() => document.documentElement.dataset.kdrumExperienceV4Stable === 'ready');
        assert.equal(await page.locator('html').getAttribute('lang'),other);
        assert.deepEqual(errors,[]);
        results.push({name,result:'PASS',images:18,enlarged:18,pdf:'HTTP 200, PDF bytes match, link opened',playback,languageSwitch:'PASS',homeNavigation:'PASS'});
        console.log(`PASS ${name}: 18 images, 18 enlargements, PDF, decoded video playback/seek/end, languages and home links`);
        await context.close();
      }
    }
  } finally {
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
