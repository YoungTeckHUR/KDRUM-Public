(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const KSeries='https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list';
  const KSeriesTerms='https://www.water.or.kr/kor/menu/sub.do?menuId=15_126';
  const CapDoc='https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/CAPABILITIES.md';
  const setText=(el,text)=>{if(el&&el.textContent!==text)el.textContent=text;};
  const meta=(name,value)=>{const el=document.querySelector(`meta[name="${name}"]`);if(el&&el.getAttribute('content')!==value)el.setAttribute('content',value);};
  const replaceText=(root,pairs)=>{if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){let v=n.nodeValue;for(const [a,b] of pairs)v=v.split(a).join(b);if(v!==n.nodeValue)n.nodeValue=v;}};

  if(ko){
    document.title='K-DRUM | 분포형 강우유출·하천수리·홍수범람해석';
    meta('description','K-DRUM은 K-water에서 개발한 물리적 기반의 격자단위 분포형 강우유출모형입니다. 유역 강우유출해석을 기반으로 1차원 하천수리와 2차원 홍수범람해석까지 기능을 확장하고 있습니다.');
    setText(document.querySelector('.eyebrow'),'분포형 강우유출 · 하천수리 · 홍수범람해석');
    setText(document.querySelector('.lead'),'K-DRUM은 K-water에서 개발한 물리적 기반의 격자단위 분포형 강우유출모형입니다.');
    setText(document.querySelector('.supporting'),'강우의 공간분포, 침투, 지표·지표하 유출, 유출추적과 하천 흐름을 해석하며, 현재는 1차원 하천수리와 2차원 홍수범람해석까지 기능을 확장하고 있습니다.');
  }else{
    document.title='K-DRUM | Distributed rainfall-runoff, river hydraulics and flood inundation';
    meta('description',"K-DRUM is K-water's physically based, grid-unit distributed rainfall-runoff model, extending toward one-dimensional river hydraulics and two-dimensional flood-inundation analysis.");
    setText(document.querySelector('.eyebrow'),'Distributed rainfall-runoff · river hydraulics · flood inundation');
    setText(document.querySelector('.lead'),"K-DRUM is K-water's physically based, grid-unit distributed rainfall-runoff model.");
    setText(document.querySelector('.supporting'),'It represents spatial rainfall, infiltration, surface and subsurface runoff, flow routing and river flow, with current extensions toward one-dimensional river hydraulics and two-dimensional flood-inundation analysis.');
  }

  if(ko){
    const chips=document.querySelectorAll('.unit-chain .unit-chip');
    ['강우·기상자료','유역 격자','1차원 하천수리','2차원 홍수범람','결과분석'].forEach((label,i)=>{const el=chips[i];if(!el)return;const img=el.querySelector('img');const current=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.nodeValue).join('').trim();if(current===label)return;el.textContent='';if(img)el.appendChild(img);el.append(label);});
    const boxes=document.querySelectorAll('.architecture .arch');
    [['강우·기상 입력자료','공간·시간 입력자료'],['유역 수문해석','격자단위 유출 및 물수지'],['하천수리해석','유량추적 및 1차원 수리해석'],['홍수범람해석','1차원–2차원 연계 및 2차원 범람해석'],['결과분석','NetCDF · FloodViewer · 1차원 결과 뷰어']].forEach((x,i)=>{if(boxes[i]){setText(boxes[i].querySelector('b'),x[0]);setText(boxes[i].querySelector('small'),x[1]);}});
  }

  const platform=document.getElementById('platform');
  if(platform){
    if(ko){
      setText(platform.querySelector('h2'),'K-DRUM 해석 및 지원 프로그램');
      setText(platform.querySelector('.section-intro'),'해석 엔진, 입력자료 작성, 결과분석과 후처리를 역할별 프로그램으로 구성하고 있습니다.');
      for(const card of platform.querySelectorAll('.tool-grid .card')){
        const h=card.querySelector('h3')?.textContent.trim();
        if(h==='K-DRUM Core')setText(card.querySelector('p'),'분포형 강우유출과 하천수리·홍수범람 해석을 수행하는 핵심 해석 엔진입니다.');
        if(h==='InputStudio')setText(card.querySelector('p'),'지형, 강우, 하천, 횡단면, 수리구조물과 모의조건을 프로젝트 단위로 작성하고 입력자료를 점검합니다.');
        if(h==='FloodViewer')setText(card.querySelector('p'),'수문·수리 계산결과를 지도, 시계열과 그래프로 조회·비교하는 통합 결과분석 프로그램입니다.');
        if(h==='ChannelBed')setText(card.querySelector('p'),'고해상도 지형자료와 하천선형을 이용해 하상 및 하천지형 자료를 보완·작성하는 지원도구입니다.');
        if(h==='통합 출력'){setText(card.querySelector('h3'),'통합 결과출력');setText(card.querySelector('p'),'계산결과와 결과분석 프로그램 사이의 자료교환을 위해 NetCDF 중심의 통합 출력체계를 사용합니다.');}
        if(h==='Estuary2DV')setText(card.querySelector('p'),'하구의 종·연직 2차원 수동역학과 염분거동 해석을 위한 별도 연구용 모형입니다.');
      }
    }
    const grid=platform.querySelector('.tool-grid');
    if(grid&&!grid.querySelector('[data-kdrum-1d-viewer]')){
      const card=document.createElement('div');card.className='card';card.dataset.kdrum1dViewer='1';
      card.innerHTML=ko?'<span class="status">별도 개발 중 · GitHub 미공개</span><h3>1차원 하천수리 결과 뷰어</h3><p>하천 종단·횡단면, 수위·유량 시계열 등 1차원 하천수리 계산결과를 조회·분석하는 별도 프로그램입니다. 현재 개발 중이며 공개 GitHub 저장소에는 아직 등록하지 않았습니다.</p>':'<span class="status">SEPARATE DEVELOPMENT · NOT YET ON GITHUB</span><h3>1D River Hydraulics Results Viewer</h3><p>A separate application for reviewing longitudinal/cross-section results and water-level/discharge time series from one-dimensional river-hydraulic simulations. It is under development and has not yet been published to the public GitHub repositories.</p>';
      grid.appendChild(card);
    }
  }

  const official=document.querySelector('#references .official');
  if(official){
    const info=official.querySelector('div');
    if(info)info.innerHTML=ko
      ?`<h3>K-water 기술 SW 공개 및 K-DRUM 다운로드</h3><p>K-water의 기술 SW 대국민 개방정책에 따라 K-Series 소프트웨어는 이용약관에 따라 외부 사용자도 무료로 이용할 수 있습니다. <strong>K-DRUM은 MyWater 물정보포털의 K-Series에서 무료로 내려받아 사용할 수 있습니다.</strong></p><p><a href="${KSeries}">MyWater K-Series에서 K-DRUM 확인</a> · <a href="${KSeriesTerms}">K-Series 기술 SW 이용안내</a> · <a href="https://www.kwater.or.kr/kiwe/main.do">K-water 연구원</a></p><p class="small">다운로드 및 사용조건은 MyWater에 게시된 최신 K-Series 이용약관과 버전 안내를 확인해 주세요.</p>`
      :`<h3>K-water technical software public access and K-DRUM download</h3><p>Under K-water's public-access policy for technical software, K-Series software is available for free external use subject to the published terms. <strong>K-DRUM can be downloaded through the MyWater K-Series portal and used free of charge under those terms.</strong></p><p><a href="${KSeries}">K-DRUM in MyWater K-Series</a> · <a href="${KSeriesTerms}">K-Series software terms</a> · <a href="https://www.kwater.or.kr/kiwe/main.do">K-water Research Institute</a></p><p class="small">Please confirm the latest download version and terms of use on MyWater.</p>`;
  }

  const groupKo={forcing:['강우자료·입력자료 품질관리','강우의 공간분포 산정과 입력자료 품질을 모의 전에 점검합니다.'],hydrology:['유역 수문·연속모의','침투, 토양수분, 증발산, 적설·융설과 초기상태를 연속모의 과정에서 함께 해석합니다.'],terrain:['사면·하도·지형','사면과 하도의 경사·조도·지형 특성을 구분하여 유출 및 하천흐름 해석에 적용합니다.'],audit:['물수지·매개변수 보정·결과보고','물수지, 관측자료 비교, 매개변수 보정과 결과보고 기능을 통해 계산결과의 적정성을 평가합니다.'],river:['하천수리·수리구조물·댐 운영','1차원 하천수리, 수리구조물과 댐·저수지 운영 시나리오를 해석합니다.'],flood:['1차원–2차원 연계·홍수범람','하천과 홍수터 사이의 양방향 유량교환과 2차원 홍수범람해석을 다룹니다.'],transport:['유사·물질추적·수질','유사 및 물질추적은 연구기능으로, 수질해석은 비활성 재개발 검토기능으로 구분합니다.'],platform:['병렬계산·결과출력·지원도구','병렬계산, NetCDF 결과출력, 입력자료 작성과 결과분석 프로그램을 함께 구성합니다.']};
  const statusKo={'ESTABLISHED':'기반 기능','IMPLEMENTED / QA':'구현·검증','ACTIVE DEVELOPMENT':'개발 중','VALIDATED DEVELOPMENT':'개발·검증(범위 한정)','RESEARCH FUNCTION':'연구 기능','DISABLED / REDEVELOPMENT':'비활성·재개발 검토','RELEASE CANDIDATE':'배포 후보','EXPERIMENTAL':'실험적 연구','ESTABLISHED / MODERNIZING':'기반 기능·개선 중','ACTIVE MODERNIZATION / QA':'개선·검증 중'};
  const replacements=[['공간 강우 입력','공간분포 강우 입력자료'],['Thiessen·IDW 강우배분','티센망·역거리가중(IDW) 강우 공간분포'],['고도보정 IDW·강우 QC','고도보정 IDW·강우자료 품질검사'],['강우 완전성 평가','강우자료 완전성·결측 평가'],['입력 사전점검·정합성','입력자료 사전검사·정합성 점검'],['연속·장기모의','연속유출·장기모의'],['HotStart·상태 재시작','HotStart(상태 재시작)'],['D층·지연 기저유출','심부저류층(D층)·지연 기저유출'],['사면 운동파 추적','사면 운동파 유출추적'],['하도 운동파 추적','하도 운동파 유량추적'],['하천 침투·심부저장 연계','하천 침투·심부저류층 연계'],['통합 실행 리포트','통합 실행결과 보고'],['소유역 리포팅','소유역별 결과보고'],['목표지점 보정·최적화','목표지점 매개변수 보정·최적화'],['소유역·목표지점 평가/보정 지원','소유역·목표지점 평가 및 보정 지원'],['출력 무결성·라이프사이클','결과출력 무결성 점검'],['1D 동역학파 하천망','1차원 동역학파 하천망 해석'],['분기·합류 수리','분기·합류부 하천수리'],['양방향 1D-2D 연계','1차원–2차원 양방향 연계'],['2D Local-Inertia 범람','Local Inertia 근사 2차원 홍수범람해석'],['Full SWE 해석','완전 천수방정식(Full SWE) 해석'],['다중해상도·Patch 2D','다중해상도·국부 고해상도 2차원 해석'],['2D 강우·배수·구조물·Tracer','2차원 직접강우·배수·수리구조물·물질추적'],['염료·보존성 추적자','염료·보존성 물질추적'],['수질 과정 모듈','수질해석 모듈'],['ST·OpenMP·MPI 병렬계산','단일 실행·OpenMP·MPI 병렬계산'],['NetCDF 통합출력','NetCDF 통합 결과출력'],['리포팅','결과보고'],['리포트','결과보고'],[' QA',' 품질검토'],['1D-2D','1차원–2차원'],['1D ','1차원 '],['2D ','2차원 '],['Viewer','뷰어']];

  function normalizeAtlas(){
    const cap=document.getElementById('capabilities');if(!cap)return;
    if(ko){
      setText(cap.querySelector('.catlas-head h2'),'K-DRUM 주요 기능');
      setText(cap.querySelector('.catlas-head p'),'강우유출, 하천수리, 홍수범람, 물수지, 매개변수 보정, 유사·물질추적, 댐 운영과 결과분석 기능을 분야별로 정리했습니다. 항목을 선택하면 해석 개념과 현재 개발·검증 상태를 확인할 수 있습니다.');
      setText(cap.querySelector('.catlas-count'),'45개 주요 기능');
      for(const tab of cap.querySelectorAll('.catlas-tab')){const x=groupKo[tab.dataset.group];if(x)setText(tab,x[0]);}
      const gid=cap.querySelector('.catlas-tab[aria-selected="true"]')?.dataset.group;const g=gid&&groupKo[gid];if(g){setText(cap.querySelector('.catlas-group-head h3'),g[0]);setText(cap.querySelector('.catlas-group-head p'),g[1]);}
      replaceText(cap.querySelector('.catlas-group'),replacements);
      for(const st of cap.querySelectorAll('.catlas-status')){const x=statusKo[st.textContent.trim()];if(x)setText(st,x);}
    }
    if(!cap.querySelector('.catlas-external-note')){const note=document.createElement('p');note.className='catlas-external-note small';note.textContent=ko?'※ 1차원 하천수리 결과 뷰어는 별도 개발 중이며 공개 GitHub 저장소에는 아직 등록되지 않았습니다.':'Note: A separate 1D River Hydraulics Results Viewer is under development and has not yet been published to the public GitHub repositories.';cap.querySelector('.catlas-head')?.after(note);}
  }
  function normalizeDialog(){const dlg=document.getElementById('catlas-dialog');if(!dlg?.open)return;if(ko){replaceText(dlg,replacements);for(const st of dlg.querySelectorAll('.catlas-status')){const x=statusKo[st.textContent.trim()];if(x)setText(st,x);}}for(const a of dlg.querySelectorAll('.catlas-doc')){a.href=CapDoc;a.textContent=ko?'기능 설명서 열기':'Open capability reference';}}
  normalizeAtlas();
  document.addEventListener('click',e=>{if(e.target.closest('.catlas-tab'))queueMicrotask(normalizeAtlas);if(e.target.closest('.catlas-card'))queueMicrotask(normalizeDialog);});
  if(!document.getElementById('kdrum-public-copy-style')){const s=document.createElement('style');s.id='kdrum-public-copy-style';s.textContent='.catlas-external-note{margin:10px 0 0;color:var(--muted)} #platform [data-kdrum-1d-viewer] .status{color:var(--dev)} #references .official strong{color:var(--text)}';document.head.appendChild(s);}
  document.documentElement.dataset.kdrumPublicCopy='ready';
})();