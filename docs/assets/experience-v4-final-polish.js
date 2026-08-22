(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const factLabels=new Set(ko?
    ['K-water 개발','물리적 기반','격자단위 분포형','연속·홍수사상 모의','하천수리·범람 확장']:
    ['Developed by K-water','Physically based','Grid-unit distributed','Continuous & event simulation','River and flood extensions']);
  const programDefs=[
    ['core',/K-DRUM Core/i,'engine'],['authoring',/InputStudio/i,'input'],
    ['floodviewer',/FloodViewer/i,'viewer'],['geometry',/ChannelBed/i,'terrain'],
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

  function cleanHero(){
    const hero=document.querySelector('.hero');
    if(!hero)return;
    hero.querySelectorAll('.ev3-hero-facts,.hero-facts,.ev3-hero-note,.hero-note,.unit-chain').forEach(n=>n.remove());
    hero.querySelectorAll('div,ul').forEach(node=>{
      if(node.classList.contains('ev4-facts')||node.children.length<3||node.children.length>8)return;
      if(node.querySelector('h1,h2,h3,p,.actions,.brand-lockup'))return;
      const labels=[...node.children].map(c=>c.textContent.trim()).filter(v=>v.length<42);
      if(labels.filter(v=>factLabels.has(v)).length>=3)node.remove();
    });
    const facts=[...hero.querySelectorAll('.ev4-facts')];
    facts.slice(1).forEach(n=>n.remove());
    if(facts[0]){
      [...facts[0].children].slice(3).forEach(n=>n.remove());
      const keep=ko?['K-water 개발','물리적 기반','연속·홍수사상 모의']:
        ['Developed by K-water','Physically based','Continuous & event simulation'];
      [...facts[0].children].forEach((n,i)=>{if(keep[i])n.textContent=keep[i];});
    }
  }

  function estuarySvg(label){
    const safe=String(label||'').replace(/[&<>\"]/g,'');
    return `<svg viewBox="0 0 320 180" role="img" aria-label="${safe}" data-diagram="estuary" focusable="false">
      <rect x="1" y="1" width="318" height="178" rx="18" fill="#f3f8fb" stroke="#bfd4e0"/>
      <path d="M20 66h280v80H20z" fill="#cfeefa"/>
      <path d="M20 66c60 8 110-4 155-18 45-14 82-14 125-6" fill="none" stroke="#0069b4" stroke-width="4"/>
      <path d="M20 146c62-18 113-23 168-13 43 8 73 3 112-15" fill="none" stroke="#17364d" stroke-width="4"/>
      <g stroke="#148b77" stroke-width="2"><path d="M80 75v52"/><path d="M145 64v68"/><path d="M210 56v73"/><path d="M270 52v66"/></g>
      <path d="M40 99h235" stroke="#6559b5" stroke-width="3" stroke-dasharray="7 5"/>
    </svg>`;
  }

  function repairPrograms(){
    const platform=document.getElementById('platform');
    if(!platform)return;
    const cards=[...platform.querySelectorAll('.card')];
    programDefs.forEach(([role,matcher,diagram])=>{
      const card=cards.find(c=>matcher.test(c.querySelector('h3,h4')?.textContent||''));
      if(!card)return;
      card.classList.add('ev3-program-card','ev4-static-card');
      card.dataset.programRole=role; card.dataset.static='1'; card.style.cursor='default';
      card.removeAttribute('tabindex'); card.removeAttribute('role');
      card.querySelectorAll('.ev4-card-action,.ev3-card-action').forEach(n=>n.remove());
      let visual=card.querySelector(':scope>.ev4-visual,:scope>.ev3-program-visual');
      const current=visual?.querySelector('svg[data-diagram]')?.dataset.diagram;
      if(role==='research'&&current!=='estuary'){
        visual?.remove(); visual=document.createElement('div');
        visual.className='ev4-visual ev3-program-visual'; visual.dataset.conceptImage='1';
        visual.innerHTML=estuarySvg(card.querySelector('h3,h4')?.textContent||'Estuary2DV');
        card.prepend(visual);
      }else if(visual&&current!==diagram){
        const svg=visual.querySelector('svg'); if(svg)svg.dataset.diagram=diagram;
      }
    });
  }

  function compactCopy(){
    const exact=new Set(ko?
      ['사용자가 얻는 결과','결과 이해','결과 유형','개념 예시','구성 프로그램','정보']:
      ['WHAT USERS OBTAIN','UNDERSTANDING RESULTS','RESULT TYPE','CONCEPT ILLUSTRATION','PROGRAM COMPONENT','INFORMATION']);
    document.querySelectorAll('#outcomes span,#outcomes small,#results span,#results small,#platform span,#platform small').forEach(n=>{
      if(!n.children.length&&exact.has(n.textContent.trim()))n.remove();
    });
    const hint=document.querySelector('#capabilities .ev3-click-hint,#capabilities .ev4-click-hint');
    if(hint)hint.textContent=ko?'파란색 버튼이 있는 항목만 상세 설명이 열립니다.':'Only cards with a blue action open detailed explanations.';
    const cap=document.querySelector('#capabilities .catlas-head p');
    if(cap)cap.textContent=ko?'분야별 기능과 공개 성숙도를 확인합니다.':'Review capabilities and public maturity by domain.';
    const program=document.querySelector('#platform .section-intro');
    if(program)program.textContent=ko?'입력자료 작성, 계산, 결과분석을 역할별로 구분합니다.':'Authoring, computation and result review are separated by role.';
    const research=document.querySelector('#research .section-intro');
    if(research)research.textContent=ko?'공개 연구주제와 적용분야를 정리했습니다.':'Public research themes and applications.';
  }

  function localizeSvg(scope=document){
    if(!ko)return;
    scope.querySelectorAll('svg text').forEach(n=>{const v=n.textContent.trim();if(svgMap[v])n.textContent=svgMap[v];});
  }

  function repairDialog(){
    const dlg=document.getElementById('catlas-dialog');
    if(!dlg?.open)return;
    const doc=dlg.querySelector('.catlas-doc');
    if(doc){doc.textContent=ko?'기능 설명 문서 보기':'Open capability document';doc.setAttribute('aria-label',doc.textContent);}
    localizeSvg(dlg);
  }

  function bindTabs(){
    document.querySelectorAll('.ev4-tab').forEach(tab=>{
      if(tab.dataset.ev4FinalBound)return; tab.dataset.ev4FinalBound='1';
      tab.addEventListener('click',()=>requestAnimationFrame(()=>document.querySelector('.ev4-tab-wrap')?.scrollIntoView({block:'start'})));
    });
  }

  function repair(){
    cleanHero(); repairPrograms(); compactCopy(); localizeSvg(); repairDialog(); bindTabs();
    document.documentElement.dataset.kdrumExperienceV4FinalPolish='ready';
  }
  document.addEventListener('click',e=>{if(e.target.closest('.catlas-card,.catlas-tab,.ev4-tab'))[0,40,120,300].forEach(d=>setTimeout(repair,d));},true);
  [0,40,120,300,700].forEach(d=>setTimeout(repair,d));
  setInterval(()=>{if(document.getElementById('catlas-dialog')?.open||document.documentElement.dataset.ev4ActiveTab==='programs')repair();},300);
})();