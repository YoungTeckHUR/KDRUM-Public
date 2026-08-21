(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const assetBase=ko?'../assets/':'assets/';
  let lastCapabilityId='';

  const capabilitySymbols={
    'rain-spatial':'P','rain-methods':'IDW','rain-qc':'QC','rain-summary':'%','input-precheck':'CHK',
    'ga':'GA','runoff':'Q','continuous':'T','et':'ET','snow':'SN','warmup':'W','hotstart':'HS','dlayer':'D',
    'slope-separate':'S','kw-hill':'KW','kw-river':'Q','river-infil':'INF','channelbed':'DEM',
    'wb':'Σ','wb-1d2d':'QEX','run-report':'RPT','subbasin-report':'SUB','optimization':'OPT','subcal':'CAL','output-integrity':'OK',
    'dwnet':'1D','junction':'JCT','structures':'STR','dam-operation':'DAM','dam-forecast':'FCST','dam-scenario':'NET',
    'coupling':'1D↔2D','local-inertia':'LI','fullswe':'SWE','multires':'MR','flood-extras':'2D+',
    'sed-hill':'SED','sed-river':'QS','dye':'C(t)','wq':'WQ',
    'parallel':'OMP','netcdf':'NC','viewer':'MAP','inputstudio':'IN','viewer1d':'1D V','estuary':'X–Z'
  };
  const groupFallback={forcing:'P',hydrology:'H₂O',terrain:'DEM',audit:'Σ',river:'Q',flood:'2D',transport:'C(t)',platform:'APP'};

  const researchCodes={
    ko:[['홍수유출','RADAR'],['장기유출','LONG'],['가뭄','WB'],['병렬계산','MPI'],['지표수','SW/GW'],['산불','FIRE']],
    en:[['Flood runoff','RADAR'],['Long-term','LONG'],['Drought','WB'],['Parallel','MPI'],['Surface water','SW/GW'],['Wildfire','FIRE']]
  };

  const roleDefinitions=[
    {role:'core',codes:['K-DRUM Core'],labelKo:'해석 엔진',labelEn:'Simulation engine',code:'CORE'},
    {role:'authoring',codes:['InputStudio'],labelKo:'입력자료 작성',labelEn:'Project authoring',code:'INPUT'},
    {role:'floodviewer',codes:['FloodViewer'],labelKo:'통합 결과분석',labelEn:'Integrated results',code:'MAP'},
    {role:'geometry',codes:['ChannelBed'],labelKo:'지형·하상 작성',labelEn:'Terrain & channel bed',code:'BED'},
    {role:'output',codes:['통합 결과출력','Integrated output'],labelKo:'자료교환',labelEn:'Data exchange',code:'NC'},
    {role:'viewer1d',codes:['1차원 하천수리 결과 뷰어','1D River Hydraulics Results Viewer'],labelKo:'1차원 결과분석',labelEn:'1D results',code:'1D'},
    {role:'research',codes:['Estuary2DV'],labelKo:'연구 확장',labelEn:'Research extension',code:'X–Z'}
  ];

  function loadStylesheet(selector,href,datasetKey,datasetValue){
    return new Promise(resolve=>{
      const existing=document.querySelector(selector);
      if(existing){resolve();return;}
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href=href;
      link.dataset[datasetKey]=datasetValue;
      let settled=false;
      const finish=()=>{if(settled)return;settled=true;resolve();};
      link.addEventListener('load',finish,{once:true});
      link.addEventListener('error',finish,{once:true});
      document.head.appendChild(link);
      setTimeout(finish,2500);
    });
  }

  function ensureStylesheets(done){
    Promise.all([
      loadStylesheet('link[data-kdrum-design-system]',assetBase+'design-system-v2.css','kdrumDesignSystem','2'),
      loadStylesheet('link[data-kdrum-design-polish]',assetBase+'design-system-v2-polish.css','kdrumDesignPolish','2')
    ]).then(done,done);
  }

  function applyCapabilityDesign(){
    const cap=document.getElementById('capabilities');
    if(!cap)return;
    const selected=cap.querySelector('.catlas-tab[aria-selected="true"]');
    const group=selected?.dataset.group||'forcing';
    cap.dataset.activeGroup=group;
    cap.classList.add('capability-design-v2');

    for(const card of cap.querySelectorAll('.catlas-card')){
      const id=card.dataset.id||'';
      if(!card.querySelector('.catlas-symbol')){
        const symbol=document.createElement('span');
        symbol.className='catlas-symbol';
        symbol.setAttribute('aria-hidden','true');
        symbol.textContent=capabilitySymbols[id]||groupFallback[group]||'K';
        card.appendChild(symbol);
      }
    }
  }

  function applyDialogDesign(){
    const dialog=document.getElementById('catlas-dialog');
    if(!dialog?.open)return;
    if(lastCapabilityId)dialog.dataset.itemId=lastCapabilityId;
    const flow=dialog.querySelector('.catlas-flow');
    if(flow)flow.dataset.steps=String(flow.children.length);
  }

  function resolveProgramRole(card){
    const heading=card.querySelector('h3')?.textContent.trim()||'';
    if(card.matches('[data-kdrum-1d-viewer],[data-kdrum1d-viewer]'))return roleDefinitions.find(x=>x.role==='viewer1d');
    return roleDefinitions.find(def=>def.codes.some(code=>heading===code||heading.includes(code)))||null;
  }

  function applyPlatformDesign(){
    const platform=document.getElementById('platform');
    const grid=platform?.querySelector('.tool-grid,.grid3,.grid4');
    if(!platform||!grid)return;
    grid.classList.add('program-grid-v2');
    platform.classList.add('platform-design-v2');
    for(const card of grid.querySelectorAll(':scope>.card')){
      const def=resolveProgramRole(card);
      if(!def)continue;
      card.dataset.programRole=def.role;
      if(!card.querySelector('.program-role')){
        const label=document.createElement('span');
        label.className='program-role';
        label.textContent=ko?def.labelKo:def.labelEn;
        const status=card.querySelector(':scope>.status');
        if(status)status.after(label);else card.prepend(label);
      }
      if(!card.querySelector('.program-code')){
        const code=document.createElement('span');
        code.className='program-code';
        code.setAttribute('aria-hidden','true');
        code.textContent=def.code;
        card.appendChild(code);
      }
    }
  }

  function applyResearchDesign(){
    const research=document.getElementById('research');
    if(!research)return;
    research.classList.add('research-design-v2');
    const pairs=ko?researchCodes.ko:researchCodes.en;
    for(const card of research.querySelectorAll('.grid3 .card')){
      if(card.querySelector('.research-code'))continue;
      const heading=card.querySelector('h3')?.textContent.trim()||'';
      const match=pairs.find(([needle])=>heading.includes(needle));
      const code=document.createElement('span');
      code.className='research-code';
      code.setAttribute('aria-hidden','true');
      code.textContent=match?.[1]||'R&D';
      card.appendChild(code);
    }
  }

  function applyArchitectureDesign(){
    const architecture=document.getElementById('architecture');
    if(architecture)architecture.classList.add('architecture-design-v2');
  }

  function applyMyWaterDesign(){
    const official=document.querySelector('#references .official');
    if(!official)return;
    official.classList.add('mywater-callout-v2');
    const info=official.querySelector(':scope>div');
    if(info){
      if(!info.querySelector('.mywater-kicker')){
        const kicker=document.createElement('span');
        kicker.className='mywater-kicker';
        kicker.textContent=ko?'공식 배포 경로':'Official distribution channel';
        info.prepend(kicker);
      }

      const paragraphs=[...info.querySelectorAll(':scope>p')];
      const desktopCopy=paragraphs.find(p=>!p.querySelector('a')&&!p.classList.contains('small')&&!p.classList.contains('mywater-mobile-summary'));
      if(desktopCopy)desktopCopy.classList.add('mywater-desktop-copy');
      if(!info.querySelector('.mywater-mobile-summary')){
        const summary=document.createElement('p');
        summary.className='mywater-mobile-summary';
        summary.innerHTML=ko
          ?'<strong>K-DRUM은 MyWater K-Series에서 무료로 내려받아 사용할 수 있습니다.</strong> 다운로드 버전과 사용조건은 최신 이용약관을 확인해 주세요.'
          :'<strong>K-DRUM is available for free download through MyWater K-Series.</strong> Please confirm the current version and terms of use on MyWater.';
        const heading=info.querySelector('h3');
        if(heading)heading.after(summary);else info.appendChild(summary);
      }

      for(const p of info.querySelectorAll(':scope>p')){
        if(!p.querySelector('a'))continue;
        p.classList.add('mywater-links');
        for(const node of [...p.childNodes]){
          if(node.nodeType===Node.TEXT_NODE)node.remove();
        }
      }
    }
    const badge=official.querySelector('.mywater-link-badge');
    const anchor=badge?.closest('a');
    if(anchor)anchor.classList.add('mywater-primary-cta');
  }

  function applyReferenceDesign(){
    const references=document.getElementById('references');
    if(references)references.classList.add('references-design-v2');
  }

  function applyHeroDesign(){
    document.querySelector('.hero')?.classList.add('hero-design-v2');
  }

  function refreshDynamicDesign(){
    applyCapabilityDesign();
    applyPlatformDesign();
    applyMyWaterDesign();
    applyDialogDesign();
  }

  function scheduleDynamicRefresh(){
    setTimeout(refreshDynamicDesign,0);
    setTimeout(refreshDynamicDesign,40);
    requestAnimationFrame(()=>{
      refreshDynamicDesign();
      requestAnimationFrame(refreshDynamicDesign);
    });
  }

  function applyAll(){
    applyHeroDesign();
    applyCapabilityDesign();
    applyArchitectureDesign();
    applyResearchDesign();
    applyPlatformDesign();
    applyReferenceDesign();
    applyMyWaterDesign();
    applyDialogDesign();
    document.documentElement.dataset.kdrumDesignSystem='ready';
  }

  document.addEventListener('click',event=>{
    const card=event.target.closest('.catlas-card');
    const tab=event.target.closest('.catlas-tab');
    if(card)lastCapabilityId=card.dataset.id||'';
    if(card||tab)scheduleDynamicRefresh();
  },true);

  ensureStylesheets(applyAll);
})();