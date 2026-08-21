(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const CAPABILITIES='https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/CAPABILITIES.md';

  function ensurePlatformCard(){
    const platform=document.getElementById('platform');
    const grid=platform?.querySelector('.tool-grid, .grid3, .grid4');
    if(!grid||grid.querySelector('[data-kdrum-1d-viewer],[data-kdrum1d-viewer]'))return;

    const card=document.createElement('div');
    card.className='card';
    card.setAttribute('data-kdrum-1d-viewer','1');
    card.setAttribute('data-kdrum1d-viewer','1');
    card.innerHTML=ko
      ?'<span class="status">별도 개발 중 · 공개 GitHub 미등록</span><h3>1차원 하천수리 결과 뷰어</h3><p>하천 종단·횡단면, 수위·유량 시계열 등 1차원 하천수리 계산결과를 조회·분석하는 별도 프로그램입니다. 현재 개발 중이며 공개 GitHub 저장소에는 아직 등록하지 않았습니다.</p>'
      :'<span class="status">SEPARATE DEVELOPMENT · NOT YET ON PUBLIC GITHUB</span><h3>1D River Hydraulics Results Viewer</h3><p>A separate application for reviewing longitudinal and cross-section results and water-level/discharge time series from one-dimensional river-hydraulic simulations. It is under development and has not yet been published to the public GitHub repositories.</p>';
    grid.appendChild(card);
  }

  function viewerCardHtml(){
    return `<button type="button" class="catlas-card" data-id="viewer1d" data-status="SEPARATE DEVELOPMENT"><span class="catlas-status">${ko?'별도 개발 중':'SEPARATE DEVELOPMENT'}</span><h4>${ko?'1차원 하천수리 결과 뷰어':'1D River Hydraulics Results Viewer'}</h4><p>${ko?'종단·횡단면과 수위·유량 시계열을 조회·분석하는 별도 프로그램이며 공개 GitHub에는 아직 등록하지 않았습니다.':'A separate application for longitudinal/cross-section and water-level/discharge time-series analysis; not yet published on public GitHub.'}</p><div class="catlas-mini" aria-hidden="true"><span></span><span></span><span></span></div></button>`;
  }

  function ensureAtlasCard(){
    const cap=document.getElementById('capabilities');
    if(!cap)return;
    const selected=cap.querySelector('.catlas-tab[aria-selected="true"]')?.dataset.group;
    if(selected!=='platform')return;
    const grid=cap.querySelector('.catlas-grid');
    if(grid&&!grid.querySelector('.catlas-card[data-id="viewer1d"]')){
      grid.insertAdjacentHTML('beforeend',viewerCardHtml());
    }
  }

  function openViewerDialog(){
    const dlg=document.getElementById('catlas-dialog');
    const title=dlg?.querySelector('#catlas-title');
    const body=dlg?.querySelector('#catlas-body');
    if(!dlg||!title||!body)return;

    dlg.className='catlas-kind-platform';
    title.textContent=ko?'1차원 하천수리 결과 뷰어':'1D River Hydraulics Results Viewer';
    body.innerHTML=ko
      ?`<div class="catlas-dmeta"><span class="catlas-status">별도 개발 중 · 공개 GitHub 미등록</span><span>결과분석 프로그램</span></div><p class="catlas-dlead">1차원 하천수리 계산결과의 종단면·횡단면, 수위·유량 시계열을 조회하고 비교·분석하기 위한 별도 결과 뷰어입니다.</p><div class="catlas-graphic"><svg viewBox="0 0 760 220" aria-hidden="true"><path d="M45 150C150 118 235 140 330 90S520 70 710 115" fill="none" stroke="#65c8ee" stroke-width="5"/><path d="M45 180H710" stroke="#506875"/><g fill="#102a38" stroke="#3d7894"><rect x="70" y="42" width="150" height="64" rx="12"/><rect x="305" y="42" width="150" height="64" rx="12"/><rect x="540" y="42" width="150" height="64" rx="12"/></g><text x="145" y="80" text-anchor="middle" fill="#e9f7fd">종단면</text><text x="380" y="80" text-anchor="middle" fill="#e9f7fd">횡단면</text><text x="615" y="80" text-anchor="middle" fill="#e9f7fd">수위·유량 시계열</text></svg></div><div class="catlas-flow"><div><span>입력</span><b>1차원 하천수리 계산결과</b></div><div><span>결과분석</span><b>종단·횡단·시계열 조회</b></div><div><span>활용</span><b>수위·유량 비교 및 검토</b></div></div><div class="catlas-panels"><section class="catlas-panel"><h4>현재 공개 상태</h4><p>별도 프로그램으로 개발 중이며 공개 GitHub 저장소에는 아직 등록하지 않았습니다.</p></section><section class="catlas-panel"><h4>공개 범위</h4><p>현재 홈페이지에는 기능과 용도만 안내하며 프로그램 파일이나 저장소 링크는 제공하지 않습니다.</p></section></div><a class="catlas-doc" href="${CAPABILITIES}" target="_blank" rel="noopener">기능 설명서 열기</a>`
      :`<div class="catlas-dmeta"><span class="catlas-status">SEPARATE DEVELOPMENT · NOT YET ON PUBLIC GITHUB</span><span>Results analysis application</span></div><p class="catlas-dlead">A separate viewer for longitudinal profiles, cross sections, and water-level/discharge time series from one-dimensional river-hydraulic simulations.</p><div class="catlas-graphic"><svg viewBox="0 0 760 220" aria-hidden="true"><path d="M45 150C150 118 235 140 330 90S520 70 710 115" fill="none" stroke="#65c8ee" stroke-width="5"/><path d="M45 180H710" stroke="#506875"/><g fill="#102a38" stroke="#3d7894"><rect x="70" y="42" width="150" height="64" rx="12"/><rect x="305" y="42" width="150" height="64" rx="12"/><rect x="540" y="42" width="150" height="64" rx="12"/></g><text x="145" y="80" text-anchor="middle" fill="#e9f7fd">Long profile</text><text x="380" y="80" text-anchor="middle" fill="#e9f7fd">Cross section</text><text x="615" y="80" text-anchor="middle" fill="#e9f7fd">WL / Q series</text></svg></div><div class="catlas-flow"><div><span>Input</span><b>1D hydraulic results</b></div><div><span>Analysis</span><b>profiles and time series</b></div><div><span>Use</span><b>water-level/discharge review</b></div></div><div class="catlas-panels"><section class="catlas-panel"><h4>Current public status</h4><p>Under separate development and not yet published to the public GitHub repositories.</p></section><section class="catlas-panel"><h4>Public boundary</h4><p>The homepage documents the existence and intended use only; no program file or public repository link is provided yet.</p></section></div><a class="catlas-doc" href="${CAPABILITIES}" target="_blank" rel="noopener">Open capability reference</a>`;
    if(!dlg.open)dlg.showModal();
  }

  ensurePlatformCard();
  ensureAtlasCard();

  const capabilities=document.getElementById('capabilities');
  if(capabilities&&!capabilities.dataset.kdrumViewerBound){
    capabilities.dataset.kdrumViewerBound='1';
    capabilities.addEventListener('click',event=>{
      const viewer=event.target.closest('.catlas-card[data-id="viewer1d"]');
      if(viewer){
        event.preventDefault();
        event.stopImmediatePropagation();
        openViewerDialog();
        return;
      }
      if(event.target.closest('.catlas-tab'))ensureAtlasCard();
    });
  }

  document.documentElement.dataset.kdrumViewerRuntime='ready';
})();
