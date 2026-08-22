(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const actionText=ko?'상세 설명 열기':'Open detailed explanation';
  const docText=ko?'기능 설명 문서 보기':'Open capability document';
  const downloadText=ko?'MyWater에서 K-DRUM 다운로드':'Download K-DRUM from MyWater';
  const factLabels=ko
    ? ['K-water 개발','물리적 기반','연속·홍수사상 모의']
    : ['Developed by K-water','Physically based','Continuous & event simulation'];
  const knownFacts=new Set(ko
    ? ['K-water 개발','물리적 기반','격자단위 분포형','연속·홍수사상 모의','하천수리·범람 확장']
    : ['Developed by K-water','Physically based','Grid-unit distributed','Continuous & event simulation','River and flood extensions']);
  const programDefs=[
    ['core',/K-DRUM Core/i,'engine'],['authoring',/InputStudio/i,'input'],
    ['floodviewer',/FloodViewer/i,'viewer'],['geometry',/ChannelBed/i,'terrain'],
    ['output',/통합 결과출력|Integrated output/i,'netcdf'],
    ['viewer1d',/1차원 하천수리 결과 뷰어|1D River Hydraulics Results Viewer/i,'viewer1d'],
    ['research',/Estuary2DV/i,'estuary']
  ];
  const svgMap=ko?{
    'soil · snow · canopy · deep storage':'토양·적설·수관차단·심부저류',
    'soil · snow · deep storage':'토양·적설·심부저류',
    Qout:'유출','ET / loss':'증발산·손실',depth:'침수심',simulated:'계산',
    observed:'관측',peak:'첨두','rank / thread':'랭크·스레드','boundary exchange':'경계정보 교환'
  }:{};
  let cleaningCapabilities=false;
  let capabilityCleanupQueued=false;
  const escapeHtml=value=>String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function removeExtraVisuals(selector){
    document.querySelectorAll(selector).forEach(card=>{
      const keep=card.querySelector(':scope > .ev4-visual');
      [...card.children].forEach(child=>{
        if(child===keep)return;
        if(child.matches?.('.ev3-card-visual,.ev3-program-visual,.ev3-research-visual'))child.remove();
        else if(child.querySelector?.('svg')&&!child.classList.contains('ev4-visual'))child.remove();
      });
    });
  }
  function cleanHero(){
    const hero=document.querySelector('.hero'); if(!hero)return;
    hero.querySelectorAll('.ev3-hero-facts,.hero-facts,.ev3-hero-note,.hero-note,.unit-chain,.ev4-facts').forEach(node=>node.remove());
    hero.querySelectorAll('div,ul').forEach(node=>{
      if(node.closest('.actions,.brand-lockup,.hero-visual')||node.querySelector('h1,h2,h3,p,.actions,.brand-lockup'))return;
      const children=[...node.children]; if(children.length<3||children.length>8)return;
      const labels=children.map(child=>child.textContent.trim()).filter(value=>value.length<42);
      if(labels.filter(value=>knownFacts.has(value)).length>=3)node.remove();
    });
    const supporting=hero.querySelector('.supporting');
    if(supporting&&!hero.querySelector('.ev4-facts')){
      const facts=document.createElement('div'); facts.className='ev4-facts';
      facts.innerHTML=factLabels.map(value=>`<span>${escapeHtml(value)}</span>`).join(''); supporting.after(facts);
    }
  }
  function cleanStaticCards(){
    removeExtraVisuals('#outcomes .ev4-static-card'); removeExtraVisuals('#results .ev4-static-card');
    removeExtraVisuals('#platform .ev3-program-card'); removeExtraVisuals('#research .ev4-static-card');
  }
  function cleanArchitecture(){
    const section=document.getElementById('architecture'); const wrap=section?.querySelector('.wrap'); if(!section||!wrap)return;
    [...section.querySelectorAll('svg')].forEach(svg=>{if(svg.closest('.arch'))return;let node=svg;while(node.parentElement&&node.parentElement!==wrap)node=node.parentElement;if(node.parentElement===wrap&&!node.matches('.architecture'))node.remove();});
  }
  function ensureCardAction(card){
    card.querySelectorAll('.ev3-card-visual,.catlas-mini,.ev3-card-action').forEach(node=>node.remove());
    const actions=[...card.querySelectorAll(':scope > .ev4-card-action')];
    if(actions.length!==1||actions[0].querySelector('span')?.textContent.trim()!==actionText){
      actions.forEach(node=>node.remove()); const action=document.createElement('span'); action.className='ev4-card-action';
      action.innerHTML=`<span>${escapeHtml(actionText)}</span><b aria-hidden="true">→</b>`; card.append(action);
    }
    const title=card.querySelector('h4,h3')?.textContent.trim()||''; card.classList.add('ev4-action-card'); card.dataset.ev4Interactive='1';
    const label=`${title}. ${actionText}`; if(card.getAttribute('aria-label')!==label)card.setAttribute('aria-label',label);
  }
  function cleanCapabilities(){
    const section=document.getElementById('capabilities'); if(!section||cleaningCapabilities)return; cleaningCapabilities=true;
    try{
      section.querySelectorAll('.catlas-group-visual,.ev3-group-concept').forEach(node=>node.remove());
      section.querySelectorAll('.catlas-tab').forEach(tab=>tab.querySelectorAll('.ev3-tab-mark,svg,img,.catlas-icon,.catlas-tab-icon').forEach(node=>node.remove()));
      section.querySelectorAll('.catlas-card').forEach(ensureCardAction);
      const hint=section.querySelector('.ev3-click-hint,.ev4-click-hint'); const hintText=ko?'파란색 버튼이 있는 항목만 상세 설명이 열립니다.':'Only cards with a blue action open detailed explanations.'; if(hint&&hint.textContent!==hintText)hint.textContent=hintText;
      const intro=section.querySelector('.catlas-head p,.section-intro'); const introText=ko?'분야별 기능과 공개 성숙도를 확인합니다.':'Review capabilities and public maturity by domain.'; if(intro&&intro.textContent!==introText)intro.textContent=introText;
    }finally{cleaningCapabilities=false;}
  }
  function queueCapabilityCleanup(){
    if(capabilityCleanupQueued)return; capabilityCleanupQueued=true; requestAnimationFrame(()=>{capabilityCleanupQueued=false;cleanCapabilities();compactCopy();localizeSvg();});
  }
  function bindCapabilityObserver(){
    const section=document.getElementById('capabilities'); if(!section||section.dataset.ev4StableObserved)return; section.dataset.ev4StableObserved='1';
    new MutationObserver(()=>queueCapabilityCleanup()).observe(section,{childList:true,subtree:true});
  }
  function repairPrograms(){
    const platform=document.getElementById('platform'); if(!platform)return; const cards=[...platform.querySelectorAll('.card')];
    programDefs.forEach(([role,matcher,diagram])=>{const card=cards.find(item=>matcher.test(item.querySelector('h3,h4')?.textContent||''));if(!card)return;card.classList.add('ev3-program-card','ev4-static-card');card.dataset.programRole=role;card.dataset.static='1';card.style.cursor='default';card.removeAttribute('tabindex');card.removeAttribute('role');card.querySelectorAll('.ev4-card-action,.ev3-card-action').forEach(node=>node.remove());const svg=card.querySelector(':scope > .ev4-visual svg[data-diagram],:scope > .ev3-program-visual svg[data-diagram]');if(svg&&svg.dataset.diagram!==diagram)svg.dataset.diagram=diagram;});
    const intro=platform.querySelector('.section-intro'); const copy=ko?'입력자료 작성, 계산, 결과분석을 역할별로 구분합니다.':'Authoring, computation and result review are separated by role.'; if(intro&&intro.textContent!==copy)intro.textContent=copy;
  }
  function cleanResearch(){
    const research=document.getElementById('research'); if(!research)return;
    research.querySelectorAll('.ev4-card-action,.ev3-card-action,.research-code').forEach(node=>node.remove());
    research.querySelectorAll('.grid3 > .card').forEach(card=>{card.classList.add('ev4-static-card');card.dataset.static='1';card.style.cursor='default';card.removeAttribute('tabindex');card.removeAttribute('role');});
    const intro=research.querySelector('.section-intro'); const copy=ko?'공개 연구주제와 적용분야를 정리했습니다.':'Public research themes and applications.'; if(intro&&intro.textContent!==copy)intro.textContent=copy;
    research.querySelectorAll('details.ev4-history,.timeline,.ev3-timeline,[class*="history-timeline"],[class*="research-timeline"]').forEach(node=>node.remove());
    research.querySelectorAll('h2,h3,h4').forEach(heading=>{const value=heading.textContent.trim();if(value==='연구 연혁'||/^Research (history|timeline)$/i.test(value))heading.remove();});
    const placeholder=document.createElement('details'); placeholder.className='ev4-history'; placeholder.hidden=true; placeholder.dataset.emptyHistory='1'; research.append(placeholder);
  }
  function compactCopy(){
    const repeated=new Set(ko?['사용자가 얻는 결과','결과 이해','결과 유형','개념 예시','구성 프로그램','정보']:['WHAT USERS OBTAIN','UNDERSTANDING RESULTS','RESULT TYPE','CONCEPT ILLUSTRATION','PROGRAM COMPONENT','INFORMATION']);
    document.querySelectorAll('#outcomes span,#outcomes small,#results span,#results small,#platform span,#platform small').forEach(node=>{if(!node.children.length&&repeated.has(node.textContent.trim()))node.remove();});
  }
  function localizeSvg(scope=document){if(!ko)return;scope.querySelectorAll('svg text').forEach(node=>{const value=node.textContent.trim();if(svgMap[value]&&node.textContent!==svgMap[value])node.textContent=svgMap[value];});}
  function repairDialog(){
    const dialog=document.getElementById('catlas-dialog'); if(!dialog?.open)return; dialog.classList.add('ev4-dialog');
    const doc=dialog.querySelector('.catlas-doc'); if(doc){doc.classList.add('ev3-dialog-link');if(doc.textContent.trim()!==docText)doc.textContent=docText;doc.setAttribute('aria-label',docText);} localizeSvg(dialog);
  }
  function downloadSvg(){
    return `<svg viewBox="0 0 260 150" role="img" aria-label="MyWater K-Series" data-diagram="download" focusable="false"><rect x="1" y="1" width="258" height="148" rx="18" fill="#f4f9fc" stroke="#b9d5e3"/><path d="M58 52c5-18 22-28 39-22 11-18 42-16 50 5 20-7 40 8 38 29 17 1 27 11 27 25H52c-28 0-30-31 6-37Z" fill="#fff" stroke="#0069b4" stroke-width="4"/><path d="M130 62v43" stroke="#148b77" stroke-width="8" stroke-linecap="round"/><path d="m112 91 18 18 18-18" fill="none" stroke="#148b77" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M86 119h88" stroke="#0069b4" stroke-width="5" stroke-linecap="round"/><text x="130" y="139" text-anchor="middle" fill="#17364d" font-size="12" font-weight="800">MyWater · K-Series</text></svg>`;
  }
  function repairDownload(){
    const primary=document.querySelector('#references .ev4-download-primary'); if(primary){primary.innerHTML=`<span class="ev4-download-label">${escapeHtml(downloadText)}</span><span class="ev4-download-arrow" aria-hidden="true">→</span>`;primary.setAttribute('aria-label',downloadText);}
    const mark=document.querySelector('#references .ev4-download-mark'); if(mark)mark.innerHTML=downloadSvg();
  }
  function cleanAll(){cleanHero();cleanStaticCards();cleanArchitecture();cleanCapabilities();repairPrograms();cleanResearch();compactCopy();localizeSvg();repairDialog();repairDownload();bindCapabilityObserver();document.documentElement.dataset.kdrumExperienceV4Stable='ready';}
  function settleCapabilities(){[20,90,220,420].forEach(delay=>setTimeout(queueCapabilityCleanup,delay));}
  document.addEventListener('click',event=>{if(event.target.closest('#capabilities .catlas-tab'))settleCapabilities();if(event.target.closest('#capabilities .catlas-card'))[20,80].forEach(delay=>setTimeout(repairDialog,delay));if(event.target.closest('.ev4-tab'))[20,90].forEach(delay=>setTimeout(()=>{cleanStaticCards();repairPrograms();cleanResearch();compactCopy();repairDownload();},delay));},true);
  let attempts=0; const timer=setInterval(()=>{attempts+=1;if(document.documentElement.dataset.kdrumExperienceV4==='ready'||attempts>240){clearInterval(timer);cleanAll();setTimeout(cleanAll,120);setTimeout(cleanAll,360);}},50);
})();
