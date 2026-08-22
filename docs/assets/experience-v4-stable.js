(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const actionText=ko?'상세 설명 열기':'Open detailed explanation';
  const docText=ko?'기능 설명 문서 보기':'Open capability document';
  const factLabels=ko
    ? ['K-water 개발','물리적 기반','연속·홍수사상 모의']
    : ['Developed by K-water','Physically based','Continuous & event simulation'];
  const programDefs=[
    ['core',/K-DRUM Core/i,'engine'],
    ['authoring',/InputStudio/i,'input'],
    ['floodviewer',/FloodViewer/i,'viewer'],
    ['geometry',/ChannelBed/i,'terrain'],
    ['output',/통합 결과출력|Integrated output/i,'netcdf'],
    ['viewer1d',/1차원 하천수리 결과 뷰어|1D River Hydraulics Results Viewer/i,'viewer1d'],
    ['research',/Estuary2DV/i,'estuary']
  ];
  const svgMap=ko?{
    'soil · snow · canopy · deep storage':'토양·적설·수관차단·심부저류',
    Qout:'유출','ET / loss':'증발산·손실',depth:'침수심',simulated:'계산',
    observed:'관측',peak:'첨두','rank / thread':'랭크·스레드',
    'boundary exchange':'경계정보 교환'
  }:{};

  const escapeHtml=value=>String(value||'').replace(/[&<>"']/g,ch=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));

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
    const hero=document.querySelector('.hero');
    if(!hero)return;
    hero.querySelectorAll('.ev3-hero-facts,.hero-facts,.ev3-hero-note,.hero-note,.unit-chain,.ev4-facts').forEach(node=>node.remove());
    const supporting=hero.querySelector('.supporting');
    if(supporting){
      const facts=document.createElement('div');
      facts.className='ev4-facts';
      facts.innerHTML=factLabels.map(value=>`<span>${escapeHtml(value)}</span>`).join('');
      supporting.after(facts);
    }
  }

  function cleanStaticCards(){
    removeExtraVisuals('#outcomes .ev4-static-card');
    removeExtraVisuals('#results .ev4-static-card');
    removeExtraVisuals('#platform .ev3-program-card');
    removeExtraVisuals('#research .ev4-static-card');
  }

  function cleanArchitecture(){
    const section=document.getElementById('architecture');
    const wrap=section?.querySelector('.wrap');
    if(!section||!wrap)return;
    [...section.querySelectorAll('svg')].forEach(svg=>{
      if(svg.closest('.arch'))return;
      let node=svg;
      while(node.parentElement&&node.parentElement!==wrap)node=node.parentElement;
      if(node.parentElement===wrap&&!node.matches('.architecture'))node.remove();
    });
  }

  function cleanCapabilities(){
    const section=document.getElementById('capabilities');
    if(!section)return;
    section.querySelectorAll('.catlas-group-visual').forEach(node=>node.remove());
    section.querySelectorAll('.catlas-tab svg,.catlas-tab img,.catlas-tab .catlas-icon,.catlas-tab .catlas-tab-icon').forEach(node=>node.remove());
    section.querySelectorAll('.catlas-card').forEach(card=>{
      card.querySelectorAll('.ev3-card-visual,.catlas-mini,.ev3-card-action,.ev4-card-action').forEach(node=>node.remove());
      const action=document.createElement('span');
      action.className='ev4-card-action';
      action.innerHTML=`<span>${escapeHtml(actionText)}</span><b aria-hidden="true">→</b>`;
      card.append(action);
      const title=card.querySelector('h4,h3')?.textContent.trim()||'';
      card.classList.add('ev4-action-card');
      card.dataset.ev4Interactive='1';
      card.setAttribute('aria-label',`${title}. ${actionText}`);
    });
    const hint=section.querySelector('.ev3-click-hint,.ev4-click-hint');
    if(hint)hint.textContent=ko?'파란색 버튼이 있는 항목만 상세 설명이 열립니다.':'Only cards with a blue action open detailed explanations.';
    const intro=section.querySelector('.catlas-head p,.section-intro');
    if(intro)intro.textContent=ko?'분야별 기능과 공개 성숙도를 확인합니다.':'Review capabilities and public maturity by domain.';
  }

  function repairPrograms(){
    const platform=document.getElementById('platform');
    if(!platform)return;
    const cards=[...platform.querySelectorAll('.card')];
    programDefs.forEach(([role,matcher,diagram])=>{
      const card=cards.find(item=>matcher.test(item.querySelector('h3,h4')?.textContent||''));
      if(!card)return;
      card.classList.add('ev3-program-card','ev4-static-card');
      card.dataset.programRole=role;
      card.dataset.static='1';
      card.style.cursor='default';
      card.removeAttribute('tabindex');
      card.removeAttribute('role');
      card.querySelectorAll('.ev4-card-action,.ev3-card-action').forEach(node=>node.remove());
      const visual=card.querySelector(':scope > .ev4-visual,:scope > .ev3-program-visual');
      const svg=visual?.querySelector('svg[data-diagram]');
      if(svg&&svg.dataset.diagram!==diagram)svg.dataset.diagram=diagram;
    });
    const intro=platform.querySelector('.section-intro');
    if(intro)intro.textContent=ko?'입력자료 작성, 계산, 결과분석을 역할별로 구분합니다.':'Authoring, computation and result review are separated by role.';
  }

  function cleanResearch(){
    const research=document.getElementById('research');
    if(!research)return;
    research.querySelectorAll('.ev4-card-action,.ev3-card-action').forEach(node=>node.remove());
    research.querySelectorAll('.grid3 > .card').forEach(card=>{
      card.classList.add('ev4-static-card');
      card.dataset.static='1';
      card.style.cursor='default';
      card.removeAttribute('tabindex');
      card.removeAttribute('role');
    });
    const intro=research.querySelector('.section-intro');
    if(intro)intro.textContent=ko?'공개 연구주제와 적용분야를 정리했습니다.':'Public research themes and applications.';
    const details=research.querySelector('details.ev4-history');
    if(details)details.open=false;
  }

  function compactCopy(){
    const repeated=new Set(ko
      ? ['사용자가 얻는 결과','결과 이해','결과 유형','개념 예시','구성 프로그램','정보']
      : ['WHAT USERS OBTAIN','UNDERSTANDING RESULTS','RESULT TYPE','CONCEPT ILLUSTRATION','PROGRAM COMPONENT','INFORMATION']);
    document.querySelectorAll('#outcomes span,#outcomes small,#results span,#results small,#platform span,#platform small').forEach(node=>{
      if(!node.children.length&&repeated.has(node.textContent.trim()))node.remove();
    });
  }

  function localizeSvg(scope=document){
    if(!ko)return;
    scope.querySelectorAll('svg text').forEach(node=>{
      const value=node.textContent.trim();
      if(svgMap[value])node.textContent=svgMap[value];
    });
  }

  function repairDialog(){
    const dialog=document.getElementById('catlas-dialog');
    if(!dialog?.open)return;
    dialog.classList.add('ev4-dialog');
    const doc=dialog.querySelector('.catlas-doc');
    if(doc){
      doc.textContent=docText;
      doc.setAttribute('aria-label',docText);
    }
    localizeSvg(dialog);
  }

  function cleanAll(){
    cleanHero();
    cleanStaticCards();
    cleanArchitecture();
    cleanCapabilities();
    repairPrograms();
    cleanResearch();
    compactCopy();
    localizeSvg();
    repairDialog();
    document.documentElement.dataset.kdrumExperienceV4Stable='ready';
  }

  function settleCapabilities(){
    [20,90,220].forEach(delay=>setTimeout(()=>{
      cleanCapabilities();
      compactCopy();
      localizeSvg();
    },delay));
  }

  document.addEventListener('click',event=>{
    if(event.target.closest('#capabilities .catlas-tab'))settleCapabilities();
    if(event.target.closest('#capabilities .catlas-card'))[20,80].forEach(delay=>setTimeout(repairDialog,delay));
    if(event.target.closest('.ev4-tab'))[20,90].forEach(delay=>setTimeout(()=>{
      cleanStaticCards();
      repairPrograms();
      cleanResearch();
      compactCopy();
    },delay));
  },true);

  let attempts=0;
  const timer=setInterval(()=>{
    attempts+=1;
    if(document.documentElement.dataset.kdrumExperienceV4==='ready'||attempts>240){
      clearInterval(timer);
      cleanAll();
      setTimeout(cleanAll,120);
      setTimeout(cleanAll,320);
    }
  },50);
})();
