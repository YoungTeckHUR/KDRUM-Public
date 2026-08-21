(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const KSeries='https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list';
  const KSeriesTerms='https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127';
  const CapDoc='https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/CAPABILITIES.md';
  const setText=(el,text)=>{if(el&&el.textContent!==text)el.textContent=text;};
  const meta=(name,value)=>{const el=document.querySelector(`meta[name="${name}"]`);if(el&&el.getAttribute('content')!==value)el.setAttribute('content',value);};
  const replaceText=(root,pairs)=>{
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      let value=node.nodeValue;
      for(const [from,to] of pairs)value=value.split(from).join(to);
      if(value!==node.nodeValue)node.nodeValue=value;
    }
  };

  if(ko){
    document.title='K-DRUM | 분포형 강우유출·하천수리·홍수범람해석';
    meta('description','K-DRUM은 K-water에서 개발한 물리적 기반의 격자단위 분포형 강우유출모형입니다. 유역 강우유출해석을 기반으로 1차원 하천수리해석과 2차원 홍수범람해석까지 기능을 확장하고 있습니다.');
    setText(document.querySelector('.eyebrow'),'분포형 강우유출 · 하천수리 · 홍수범람해석');
    setText(document.querySelector('.lead'),'K-DRUM은 K-water에서 개발한 물리적 기반의 격자단위 분포형 강우유출모형입니다.');
    setText(document.querySelector('.supporting'),'강우의 공간분포, 침투, 지표·지표하 유출, 유출추적과 하천 흐름을 해석하며, 현재는 1차원 하천수리해석과 2차원 홍수범람해석까지 기능을 확장하고 있습니다.');
  }else{
    document.title='K-DRUM | Distributed rainfall-runoff, river hydraulics and flood inundation';
    meta('description',"K-DRUM is K-water's physically based, grid-unit distributed rainfall-runoff model, extending toward one-dimensional river hydraulics and two-dimensional flood-inundation analysis.");
    setText(document.querySelector('.eyebrow'),'Distributed rainfall-runoff · river hydraulics · flood inundation');
    setText(document.querySelector('.lead'),"K-DRUM is K-water's physically based, grid-unit distributed rainfall-runoff model.");
    setText(document.querySelector('.supporting'),'It represents spatial rainfall, infiltration, surface and subsurface runoff, flow routing and river flow, with current extensions toward one-dimensional river hydraulics and two-dimensional flood-inundation analysis.');
  }

  if(ko){
    const chips=document.querySelectorAll('.unit-chain .unit-chip');
    ['강우·기상자료','유역 격자','1차원 하천수리','2차원 홍수범람','결과분석'].forEach((label,i)=>{
      const el=chips[i];if(!el)return;
      const img=el.querySelector('img');
      const current=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.nodeValue).join('').trim();
      if(current===label)return;
      el.textContent='';if(img)el.appendChild(img);el.append(label);
    });
    const boxes=document.querySelectorAll('.architecture .arch');
    [
      ['강우·기상 입력자료','공간·시간 입력자료'],
      ['유역 수문해석','격자단위 유출 및 물수지'],
      ['하천수리해석','유량추적 및 1차원 수리해석'],
      ['홍수범람해석','1차원–2차원 연계 및 2차원 범람해석'],
      ['결과분석','NetCDF · FloodViewer · 1차원 하천수리 결과 뷰어']
    ].forEach((x,i)=>{if(boxes[i]){setText(boxes[i].querySelector('b'),x[0]);setText(boxes[i].querySelector('small'),x[1]);}});
  }

  const platform=document.getElementById('platform');
  if(platform){
    if(ko){
      setText(platform.querySelector('h2'),'K-DRUM 해석 및 지원 프로그램');
      setText(platform.querySelector('.section-intro'),'해석 엔진, 입력자료 작성, 결과분석과 후처리를 역할별 프로그램으로 구성하고 있습니다.');
      for(const card of platform.querySelectorAll('.tool-grid .card')){
        const heading=card.querySelector('h3')?.textContent.trim();
        if(heading==='K-DRUM Core')setText(card.querySelector('p'),'분포형 강우유출과 하천수리·홍수범람 해석을 수행하는 핵심 해석 엔진입니다.');
        if(heading==='InputStudio')setText(card.querySelector('p'),'지형, 강우, 하천, 횡단면, 수리구조물과 모의조건을 프로젝트 단위로 작성하고 입력자료를 점검합니다.');
        if(heading==='FloodViewer')setText(card.querySelector('p'),'수문·수리 계산결과를 지도, 시계열과 그래프로 조회·비교하는 통합 결과분석 프로그램입니다.');
        if(heading==='ChannelBed')setText(card.querySelector('p'),'고해상도 지형자료와 하천선형을 이용해 하상 및 하천지형 자료를 보완·작성하는 지원도구입니다.');
        if(heading==='통합 출력'){setText(card.querySelector('h3'),'통합 결과출력');setText(card.querySelector('p'),'계산결과와 결과분석 프로그램 사이의 자료교환을 위해 NetCDF 중심의 통합 출력체계를 사용합니다.');}
        if(heading==='Estuary2DV')setText(card.querySelector('p'),'하구의 종·연직 2차원 수동역학과 염분거동 해석을 위한 별도 연구용 모형입니다.');
      }
    }
    const grid=platform.querySelector('.tool-grid');
    if(grid&&!grid.querySelector('[data-kdrum-1d-viewer]')){
      const card=document.createElement('div');
      card.className='card';
      card.dataset.kdrum1dViewer='1';
      card.innerHTML=ko
        ?'<span class="status">별도 개발 중 · 공개 GitHub 미등록</span><h3>1차원 하천수리 결과 뷰어</h3><p>하천 종단·횡단면, 수위·유량 시계열 등 1차원 하천수리 계산결과를 조회·분석하는 별도 프로그램입니다. 현재 개발 중이며 공개 GitHub 저장소에는 아직 등록하지 않았습니다.</p>'
        :'<span class="status">SEPARATE DEVELOPMENT · NOT YET ON PUBLIC GITHUB</span><h3>1D River Hydraulics Results Viewer</h3><p>A separate application for reviewing longitudinal/cross-section results and water-level/discharge time series from one-dimensional river-hydraulic simulations. It is under development and has not yet been published to the public GitHub repositories.</p>';
      grid.appendChild(card);
    }
  }

  const official=document.querySelector('#references .official');
  if(official){
    const info=official.querySelector('div');
    if(info)info.innerHTML=ko
      ?`<h3>K-water 기술 SW 대국민 개방 및 K-DRUM 다운로드</h3><p>K-water는 물관리 기술노하우를 소프트웨어로 구현한 K-Series 기술 SW를 MyWater에서 공개하고 있습니다. MyWater 안내에 따르면 K-Series 소프트웨어는 게시된 이용약관에 따라 K-water 이외의 개인도 무료로 사용할 수 있습니다. <strong>K-DRUM은 MyWater 물정보포털의 K-Series에서 무료로 내려받아 사용할 수 있습니다.</strong></p><p><a href="${KSeries}">MyWater K-Series에서 K-DRUM 확인</a> · <a href="${KSeriesTerms}">K-Series 기술 SW 이용약관</a> · <a href="https://www.kwater.or.kr/kiwe/main.do">K-water 연구원</a></p><p class="small">다운로드 버전과 사용조건은 MyWater에 게시된 최신 K-Series 안내 및 이용약관을 확인해 주세요.</p>`
      :`<h3>K-water public access to technical software and K-DRUM download</h3><p>K-water publishes its K-Series technical software through MyWater. MyWater states that K-Series software made available on the website may be used free of charge by individuals outside K-water subject to the published terms. <strong>K-DRUM can be downloaded through the MyWater K-Series portal and used free of charge under those terms.</strong></p><p><a href="${KSeries}">K-DRUM in MyWater K-Series</a> · <a href="${KSeriesTerms}">K-Series terms of use</a> · <a href="https://www.kwater.or.kr/kiwe/main.do">K-water Research Institute</a></p><p class="small">Please confirm the latest version and terms of use on MyWater.</p>`;
  }

  const groupKo={
    forcing:['강우자료·입력자료 품질관리','강우의 공간분포 산정과 입력자료 품질을 모의 전에 점검합니다.'],
    hydrology:['유역 수문·연속모의','침투, 토양수분, 증발산, 적설·융설과 초기상태를 연속모의 과정에서 함께 해석합니다.'],
    terrain:['사면·하도·지형','사면과 하도의 경사·조도·지형 특성을 구분하여 유출 및 하천흐름 해석에 적용합니다.'],
    audit:['물수지·매개변수 보정·결과보고','물수지, 관측자료 비교, 매개변수 보정과 결과보고 기능을 통해 계산결과의 적정성을 평가합니다.'],
    river:['하천수리·수리구조물·댐 운영','1차원 하천수리, 수리구조물과 댐·저수지 운영 시나리오를 해석합니다.'],
    flood:['1차원–2차원 연계·홍수범람','하천과 홍수터 사이의 양방향 유량교환과 2차원 홍수범람해석을 다룹니다.'],
    transport:['유사·물질추적·수질','유사 및 물질추적은 연구기능으로, 수질해석은 비활성 재개발 검토기능으로 구분합니다.'],
    platform:['병렬계산·결과출력·지원도구','병렬계산, NetCDF 결과출력, 입력자료 작성과 결과분석 프로그램을 함께 구성합니다.']
  };
  const statusKo={
    'ESTABLISHED':'기반 기능',
    'IMPLEMENTED / QA':'구현·검증',
    'ACTIVE DEVELOPMENT':'개발 중',
    'VALIDATED DEVELOPMENT':'개발·검증(범위 한정)',
    'RESEARCH FUNCTION':'연구 기능',
    'DISABLED / REDEVELOPMENT':'비활성·재개발 검토',
    'RELEASE CANDIDATE':'배포 후보',
    'EXPERIMENTAL':'실험적 연구',
    'ESTABLISHED / MODERNIZING':'기반 기능·개선 중',
    'ACTIVE MODERNIZATION / QA':'개선·검증 중'
  };
  const replacements=[
    ['공간 강우 입력','공간분포 강우 입력자료'],
    ['Thiessen·IDW 강우배분','티센망·역거리가중(IDW) 강우 공간분포'],
    ['고도보정 IDW·강우 QC','고도보정 IDW·강우자료 품질검사'],
    ['강우 완전성 평가','강우자료 완전성·결측 평가'],
    ['입력 사전점검·정합성','입력자료 사전검사·정합성 점검'],
    ['연속·장기모의','연속유출·장기모의'],
    ['HotStart·상태 재시작','HotStart(상태 재시작)'],
    ['D층·지연 기저유출','심부저류층(D층)·지연 기저유출'],
    ['사면 운동파 추적','사면 운동파 유출추적'],
    ['하도 운동파 추적','하도 운동파 유량추적'],
    ['하천 침투·심부저장 연계','하천 침투·심부저류층 연계'],
    ['통합 실행 리포트','통합 실행결과 보고'],
    ['소유역 리포팅','소유역별 결과보고'],
    ['목표지점 보정·최적화','목표지점 매개변수 보정·최적화'],
    ['소유역·목표지점 평가/보정 지원','소유역·목표지점 평가 및 보정 지원'],
    ['출력 무결성·라이프사이클','결과출력 무결성 점검'],
    ['1D 동역학파 하천망','1차원 동역학파 하천망 해석'],
    ['분기·합류 수리','분기·합류부 하천수리'],
    ['양방향 1D-2D 연계','1차원–2차원 양방향 연계'],
    ['2D Local-Inertia 범람','국부 관성(Local Inertia) 근사 2차원 홍수범람해석'],
    ['Full SWE 해석','완전 천수방정식(Full SWE) 해석'],
    ['다중해상도·Patch 2D','다중해상도·국부 고해상도 2차원 해석'],
    ['2D 강우·배수·구조물·Tracer','2차원 직접강우·배수·수리구조물·물질추적'],
    ['염료·보존성 추적자','염료·보존성 물질추적'],
    ['수질 과정 모듈','수질해석 모듈'],
    ['ST·OpenMP·MPI 병렬계산','단일 실행·OpenMP·MPI 병렬계산'],
    ['NetCDF 통합출력','NetCDF 통합 결과출력'],
    ['리포팅','결과보고'],
    ['리포트','결과보고'],
    [' QA',' 품질검토'],
    ['1D-2D','1차원–2차원'],
    ['1D ','1차원 '],
    ['2D ','2차원 ']
  ];

  function viewerCard(){
    return `<button type="button" class="catlas-card" data-id="viewer1d" data-status="SEPARATE DEVELOPMENT"><span class="catlas-status">${ko?'별도 개발 중':'SEPARATE DEVELOPMENT'}</span><h4>${ko?'1차원 하천수리 결과 뷰어':'1D River Hydraulics Results Viewer'}</h4><p>${ko?'종단·횡단면 및 수위·유량 시계열을 조회·분석하는 별도 프로그램이며 공개 GitHub에는 아직 등록하지 않았습니다.':'Separate result-analysis application for longitudinal/cross-section and water-level/discharge time-series review; not yet published on public GitHub.'}</p><div class="catlas-mini" aria-hidden="true"><span></span><span></span><span></span></div></button>`;
  }

  function injectViewerCard(cap){
    const selected=cap.querySelector('.catlas-tab[aria-selected="true"]')?.dataset.group;
    if(selected!=='platform')return;
    const grid=cap.querySelector('.catlas-grid');
    if(grid&&!grid.querySelector('[data-id="viewer1d"]'))grid.insertAdjacentHTML('beforeend',viewerCard());
  }

  function normalizeAtlas(){
    const cap=document.getElementById('capabilities');if(!cap)return;
    if(ko){
      setText(cap.querySelector('.catlas-head h2'),'K-DRUM 주요 기능');
      setText(cap.querySelector('.catlas-head p'),'강우유출, 하천수리, 홍수범람, 물수지, 매개변수 보정, 유사·물질추적, 댐 운영과 결과분석 기능을 분야별로 정리했습니다. 항목을 선택하면 해석 개념과 현재 개발·검증 상태를 확인할 수 있습니다.');
      setText(cap.querySelector('.catlas-count'),'46개 주요 기능');
      for(const tab of cap.querySelectorAll('.catlas-tab')){const x=groupKo[tab.dataset.group];if(x)setText(tab,x[0]);}
      const gid=cap.querySelector('.catlas-tab[aria-selected="true"]')?.dataset.group;
      const group=gid&&groupKo[gid];
      if(group){setText(cap.querySelector('.catlas-group-head h3'),group[0]);setText(cap.querySelector('.catlas-group-head p'),group[1]);}
      replaceText(cap.querySelector('.catlas-group'),replacements);
      for(const st of cap.querySelectorAll('.catlas-status')){const x=statusKo[st.textContent.trim()];if(x)setText(st,x);}
    }else{
      setText(cap.querySelector('.catlas-count'),'46 core capabilities');
    }
    injectViewerCard(cap);
  }

  function normalizeDialog(){
    const dlg=document.getElementById('catlas-dialog');if(!dlg?.open)return;
    if(ko){
      replaceText(dlg,replacements);
      for(const st of dlg.querySelectorAll('.catlas-status')){const x=statusKo[st.textContent.trim()];if(x)setText(st,x);}
    }
    for(const a of dlg.querySelectorAll('.catlas-doc')){a.href=CapDoc;a.textContent=ko?'기능 설명서 열기':'Open capability reference';}
  }

  function openViewerDialog(){
    const dlg=document.getElementById('catlas-dialog');
    const title=dlg?.querySelector('#catlas-title');
    const body=dlg?.querySelector('#catlas-body');
    if(!dlg||!title||!body)return;
    title.textContent=ko?'1차원 하천수리 결과 뷰어':'1D River Hydraulics Results Viewer';
    body.innerHTML=ko
      ?`<div class="catlas-dmeta"><span class="catlas-status">별도 개발 중 · 공개 GitHub 미등록</span><span>결과분석 프로그램</span></div><p class="catlas-dlead">1차원 하천수리 계산결과의 종단면·횡단면, 수위·유량 시계열을 조회하고 비교·분석하기 위한 별도 결과 뷰어입니다.</p><div class="catlas-graphic"><svg viewBox="0 0 760 220" aria-hidden="true"><path d="M45 150C150 118 235 140 330 90S520 70 710 115" fill="none" stroke="#65c8ee" stroke-width="5"/><path d="M45 180H710" stroke="#506875"/><g fill="#102a38" stroke="#3d7894"><rect x="70" y="42" width="150" height="64" rx="12"/><rect x="305" y="42" width="150" height="64" rx="12"/><rect x="540" y="42" width="150" height="64" rx="12"/></g><text x="145" y="80" text-anchor="middle" fill="#e9f7fd">종단면</text><text x="380" y="80" text-anchor="middle" fill="#e9f7fd">횡단면</text><text x="615" y="80" text-anchor="middle" fill="#e9f7fd">수위·유량 시계열</text></svg></div><div class="catlas-flow"><div><span>입력</span><b>1차원 하천수리 계산결과</b></div><div><span>결과분석</span><b>종단·횡단·시계열 조회</b></div><div><span>활용</span><b>수위·유량 비교 및 검토</b></div></div><div class="catlas-panels"><section class="catlas-panel"><h4>현재 공개 상태</h4><p>별도 프로그램으로 개발 중이며 공개 GitHub 저장소에는 아직 등록하지 않았습니다.</p></section><section class="catlas-panel"><h4>공개 범위</h4><p>현재 홈페이지에는 기능 존재와 용도만 안내하며 프로그램 파일이나 저장소 링크는 제공하지 않습니다.</p></section></div><a class="catlas-doc" href="${CapDoc}" target="_blank" rel="noopener">기능 설명서 열기</a>`
      :`<div class="catlas-dmeta"><span class="catlas-status">SEPARATE DEVELOPMENT · NOT YET ON PUBLIC GITHUB</span><span>Results analysis application</span></div><p class="catlas-dlead">A separate viewer for longitudinal profiles, cross sections, and water-level/discharge time series from one-dimensional river-hydraulic simulations.</p><div class="catlas-graphic"><svg viewBox="0 0 760 220" aria-hidden="true"><path d="M45 150C150 118 235 140 330 90S520 70 710 115" fill="none" stroke="#65c8ee" stroke-width="5"/><path d="M45 180H710" stroke="#506875"/><g fill="#102a38" stroke="#3d7894"><rect x="70" y="42" width="150" height="64" rx="12"/><rect x="305" y="42" width="150" height="64" rx="12"/><rect x="540" y="42" width="150" height="64" rx="12"/></g><text x="145" y="80" text-anchor="middle" fill="#e9f7fd">Long profile</text><text x="380" y="80" text-anchor="middle" fill="#e9f7fd">Cross section</text><text x="615" y="80" text-anchor="middle" fill="#e9f7fd">WL / Q series</text></svg></div><div class="catlas-flow"><div><span>Input</span><b>1D hydraulic results</b></div><div><span>Analysis</span><b>profiles and time series</b></div><div><span>Use</span><b>water-level/discharge review</b></div></div><div class="catlas-panels"><section class="catlas-panel"><h4>Current public status</h4><p>Under separate development and not yet published to the public GitHub repositories.</p></section><section class="catlas-panel"><h4>Public boundary</h4><p>The homepage documents the existence and intended use only; no program file or public repository link is provided yet.</p></section></div><a class="catlas-doc" href="${CapDoc}" target="_blank" rel="noopener">Open capability reference</a>`;
    dlg.showModal();
  }

  const cap=document.getElementById('capabilities');
  normalizeAtlas();
  if(cap){
    cap.addEventListener('click',event=>{
      const tab=event.target.closest('.catlas-tab');
      if(tab){queueMicrotask(normalizeAtlas);return;}
      const card=event.target.closest('.catlas-card');
      if(!card)return;
      if(card.dataset.id==='viewer1d'){openViewerDialog();return;}
      queueMicrotask(normalizeDialog);
    });
  }

  if(!document.getElementById('kdrum-public-copy-style')){
    const style=document.createElement('style');
    style.id='kdrum-public-copy-style';
    style.textContent='#platform [data-kdrum-1d-viewer] .status{color:var(--dev)} #references .official strong{color:var(--text)}';
    document.head.appendChild(style);
  }
  document.documentElement.dataset.kdrumPublicCopy='ready';
})();